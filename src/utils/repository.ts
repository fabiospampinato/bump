
/* IMPORT */

import _ from 'lodash';
import Config from '~/config';
import VersionProviders from '~/providers/version';
import Git from '~/utils/git';

/* MAIN */

const Repository = {

  /* API */

  getPath: async (): Promise<string | null> => {

    return Git.getPath ();

  },

  getVersion: async ( repoPath: string | null ): Promise<string> => {

    if ( repoPath ) {

      const version = await Repository.getVersionProvidersResult ( repoPath, 'getVersion' );

      if ( version ) return version;

    }

    return Config.version.initial;

  },

  getVersionProviders: async ( repoPath: string ) => { //TSC

    const providers = VersionProviders.map ( Provider => new Provider ( repoPath ) );
    const isSupported = await Promise.all ( providers.map ( provider => provider.isSupported () ) );
    const providersSupported = providers.filter ( ( _, index ) => isSupported[index] );

    return providersSupported;

  },

  getVersionProvidersResult: async ( repoPath: string, method: string, ...args ) => { //TSC

    const providers = await Repository.getVersionProviders ( repoPath );

    for ( const provider of providers ) {

      const result = await provider[method]( ...args );

      if ( result ) return result;

    }

  }

};

/* EXPORT */

export default Repository;
