
/* IMPORT */

import {setTimeout as delay} from 'node:timers/promises';
import {color} from 'specialist';
import Watcher from 'watcher';
import file from '~/utils/file';
import log from '~/utils/log';
import type {UploaderOptions} from '~/types';

/* MAIN */

class Uploader<UploadResult, CancelResult> {

  /* VARIABLES */

  private options: UploaderOptions<UploadResult, CancelResult>;
  private watcher?: Watcher;

  private uploading: Record<string, Promise<UploadResult>> = {};
  private reuploading: Record<string, Promise<CancelResult>> = {};

  private uploadedNr: number = 0;
  private uploadingNr: number = 0;

  private wait?: Promise<void> | false; // Until this promise resolves, i.e. this property gets set to `false`, we can't exit, in order not to miss out any FS events
  private exit?: Function; // Makes `start` resolve

  /* CONSTRUCTOR */

  constructor ( options: UploaderOptions<UploadResult, CancelResult> ) {

    this.options = options;

  }

  /* WATCHING */

  _watchHandler = ( callback: ( filePath: string ) => void ): (( filePath: string ) => void) => {

    return ( filePath: string ) => {

      this.keepalive ();

      callback ( filePath );

    };

  }

  watch = (): void => {

    this.unwatch ();

    // const isIgnored = ( filePath: string ) => /node_modules/.test ( filePath );
    // const isMatch = ( filePath: string ) => !isIgnored ( filePath ) && zeptomatch ( this.options.globs, filePath );

    this.watcher = new Watcher (); //TODO: This is watching globs... that doesn't work anymore
    this.watcher.on ( 'add', this._watchHandler ( this.upload ) )
    this.watcher.on ( 'change', this._watchHandler ( this.reupload ) )
    this.watcher.on ( 'unlink', this._watchHandler ( this.reupload ) );

  }

  unwatch = (): void => {

    this.watcher?.close ();

  }

  /* UPLOADING */

  upload = async ( filePath: string ): Promise<void> => {

    if ( this.isUploading ( filePath ) ) return this.reupload ( filePath );

    if ( !file.exists ( filePath ) ) return;

    log ( `Uploading "${color.bold ( filePath )}"` );

    this.uploadingNr += 1;

    await ( this.uploading[filePath] = this.options.upload ( filePath ) );

    this.uploadingNr -= 1;
    this.uploadedNr += 1;

    this.finish ();

  }

  isUploading = ( filePath: string ): boolean => {

    return ( filePath in this.uploading );

  }

  reupload = async ( filePath: string ): Promise<void> => {

    if ( this.isReuploading ( filePath ) ) return;

    if ( !this.isUploading ( filePath ) ) return this.upload ( filePath );

    log ( `Reuploading "${color.bold ( filePath )}" because it changed on disk` );

    this.uploadingNr += 1;
    this.uploadedNr -= 1;

    const asset = await this.uploading[filePath];

    await ( this.reuploading[filePath] = this.options.cancel ( filePath, asset ) );

    delete this.uploading[filePath];
    delete this.reuploading[filePath];

    this.uploadingNr -= 1;

    return this.upload ( filePath );

  }

  isReuploading = ( filePath: string ): boolean => {

    return ( filePath in this.reuploading );

  }

  /* LIFECYCLE */

  keepalive = ( timeout: number = 5000 ): void => {

    const thisWait = this.wait = new Promise ( async resolve => {

      await delay ( timeout );

      if ( this.wait !== thisWait ) return;

      this.wait = false;

      resolve ();

    });

  }

  start = (): Promise<void> => {

    this.watch ();

    this.keepalive ();

    return new Promise ( resolve => {

      this.exit = () => resolve ();

    });

  }

  finish = ( force?: boolean ): void => {

    if ( !force && ( this.options.filesNr > 0 ? this.uploadedNr !== this.options.filesNr : !!this.uploadingNr ) ) return;

    if ( this.wait ) {

      this.wait.then ( () => this.finish () );

    } else {

      this.unwatch ();

      this.exit?.();

    }

  }

}

/* EXPORT */

export default Uploader;
