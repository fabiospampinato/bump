
/* IMPORT */

import Config from '../config';
import {format, getTokensForVersion, shell} from '../utils';
import type {Package} from '../types';

/* MAIN */

const tagGit = async ( pkg: Package, repoPath: string ): Promise<void> => {

  const tokens = getTokensForVersion ( pkg.version );
  const name = format ( Config.tag.name, tokens );

  await shell ( 'git', ['tag', name], { cwd: repoPath } );

};

/* EXPORT */

export default tagGit;
