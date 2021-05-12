
/* IMPORT */

import * as chokidar from 'chokidar';
import {FSWatcher} from 'chokidar';
import delay from 'promise-resolve-timeout';
import {color} from 'specialist';
import file from './file';
import log from './log';
import {UploaderOptions} from '../types';

/* UPLOADER */

class Uploader<UploadResult, CancelResult> {

  /* VARIABLES */

  options: UploaderOptions<UploadResult, CancelResult>;
  watcher: FSWatcher;

  uploading: Record<string, Promise<UploadResult>> = {};
  reuploading: Record<string, Promise<CancelResult>> = {};

  uploadedNr: number = 0;
  uploadingNr: number = 0;

  wait: Promise<void> | false; // Until this promise resolves, i.e. this property gets set to `false`, we can't exit, in order not to miss out any FS events
  exit: Function; // Makes `start` resolve

  /* CONSTRUCTOR */

  constructor ( options: UploaderOptions<UploadResult, CancelResult> ) {

    this.options = options;

  }

  /* WATCHING */

  _watchHandler ( method: Function ) {

    return ( filePath: string ) => {

      this.keepalive ();

      method.call ( this, filePath );

    };

  }

  watch (): void {

    this.unwatch ();

    this.watcher = chokidar.watch ( this.options.globs, { ignored: /node_modules/ } )
                           .on ( 'add', this._watchHandler ( this.upload ) )
                           .on ( 'change', this._watchHandler ( this.reupload ) )
                           .on ( 'unlink', this._watchHandler ( this.reupload ) );

  }

  unwatch (): void {

    this.watcher?.close ();

  }

  /* UPLOADING */

  async upload ( filePath: string ): Promise<any> {

    if ( this.isUploading ( filePath ) ) return this.reupload ( filePath );

    if ( !file.exists ( filePath ) ) return;

    log ( `Uploading "${color.bold ( filePath )}"` );

    this.uploadingNr++;

    await ( this.uploading[filePath] = this.options.upload ( filePath ) );

    this.uploadingNr--;
    this.uploadedNr++;

    this.finish ();

  }

  isUploading ( filePath: string ): boolean {

    return filePath in this.uploading;

  }

  async reupload ( filePath: string ): Promise<void> {

    if ( this.isReuploading ( filePath ) ) return;

    if ( !this.isUploading ( filePath ) ) return this.upload ( filePath );

    log ( `Reuploading "${color.bold ( filePath )}" because it changed on disk` );

    this.uploadingNr++;
    this.uploadedNr--;

    const asset = await this.uploading[filePath];

    await ( this.reuploading[filePath] = this.options.cancel ( filePath, asset ) );

    delete this.uploading[filePath];
    delete this.reuploading[filePath];

    this.uploadingNr--;

    return this.upload ( filePath );

  }

  isReuploading ( filePath: string ): boolean {

    return filePath in this.reuploading;

  }

  /* LIFECYCLE */

  keepalive ( timeout: number = 5000 ): void {

    const thisWait = delay ( timeout, () => {

      if ( this.wait !== thisWait ) return;

      this.wait = false;

    });

    this.wait = thisWait;

  }

  start (): Promise<void> {

    this.watch ();

    this.keepalive ();

    return new Promise ( resolve => {

      this.exit = () => resolve ();

    });

  }

  finish ( force?: boolean ): void {

    if ( !force && ( this.options.filesNr > 0 ? this.uploadedNr !== this.options.filesNr : !!this.uploadingNr ) ) return;

    if ( this.wait ) {

      this.wait.then ( () => this.finish () );

    } else {

      this.unwatch ();

      this.exit ();

    }

  }

}

/* EXPORT */

export default Uploader;
