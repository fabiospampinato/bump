
/* IMPORT */

import _ from 'lodash';
import Config from '~/config';
import Abstract from '~/providers/version/abstract';
import type {Commit} from '~/types';

/* MAIN */

class Files extends Abstract {

  files; basePaths; regexes; replacements;

  async isSupported () {

    for ( let i = 0, l = this.basePaths.length; i < l; i++ ) {

      if ( !!await this.getContent ( this.basePaths[i] ) ) return true;

    }

    return false;

  }

  init () {

    this.files = this.getFiles ();
    this.basePaths = Object.keys ( this.files );
    this.regexes = {};
    this.replacements = {};

    /* POPULATING REGEXES / REPLACEMENTS */

    _.forOwn ( this.files, ( data, basePath ) => {

      const datas = _.isArray ( data[0] ) ? data : [data];
      const [regexes, replacements, flags] = _.zip ( ...datas ) as string[][];

      this.regexes[basePath] = regexes.map ( ( regex, i ) => new RegExp ( regex, _.get ( flags, i, 'gmi' ) ) );
      this.replacements[basePath] = replacements;

    });

  }

  getFiles () {

    return Config.files;

  }

  async getVersion () {

    return await this.getVersionByFiles () || await super.getVersion ();

  }

  async getVersionByFiles () {

    return await this.getVersionByContentProvider ( basePath => this.getContent ( basePath ) );

  }

  async getVersionByCommit ( commit?: Commit ) {

    if ( !commit ) return Config.version.initial;

    const version = await this.getVersionByContentProvider ( basePath => this.getContentByCommit ( commit, basePath ) );

    if ( version ) return version;

    return Config.version.initial;

  }

  async getVersionByContentProvider ( contentProvider: Function ) {

    for ( let i = 0, l = this.basePaths.length; i < l; i++ ) {

      const basePath = this.basePaths[i];
      const content = await contentProvider ( basePath );

      if ( !content ) continue;

      for ( let ri = 0, rl = this.regexes[basePath].length; ri < rl; ri++ ) {

        const re = this.regexes[basePath][ri];
        const matches = stringMatches ( content, re );

        for ( let match of matches ) {

          if ( match && match[1] ) return match[1] as string;

        }

      }

    }

  }

  async updateVersion ( version: string ) {

    for ( let basePath of this.basePaths ) {

      const content = await this.getContent ( basePath );

      if ( !content ) return;

      let newContent = content;

      this.regexes[basePath].forEach ( ( regex, ri ) => {

        const replacement = this.replacements[basePath][ri];

        newContent = newContent.replace ( regex, replacement.replace ( /\[version\]/g, version ) );

      });

      await this.setContent ( basePath, newContent );

    }

  }

}

/* EXPORT */

export default Files;
