
/* IMPORT */

import Config from '../config';
import {format, getTokensForCommit, getTokensForVersion} from '../utils';
import type {CommitsGroup} from '../types';

/* MAIN */

const changelogRender = async ( groups: CommitsGroup[] ): Promise<string> => {

  const lines: string[] = [];

  for ( const group of groups ) {

    if ( !group.versionDate ) continue;

    const tokens = getTokensForVersion ( group.version, new Date ( group.versionDate ) );
    const lineVersion = format ( Config.changelog.version, tokens );

    lines.push ( lineVersion );
    lines.push ( '\n\n' );

    if ( group.commits.length ) {

      for ( const commit of group.commits ) {

        const tokens = getTokensForCommit ( commit );
        const lineCommit = format ( Config.changelog.commit, tokens );

        lines.push ( lineCommit );
        lines.push ( '\n' );

      }

      lines.push ( '\n' );

    }

  }

  return lines.join ( '' );

};

/* EXPORT */

export default changelogRender;
