
/* IMPORT */

import Config from '../config';
import {format, getTokensForVersion, shell} from '../utils';
import type {Package} from '../types';

/* MAIN */

const commitGit = async ( pkg: Package, repoPath: string ): Promise<void> => {

  const tokens = getTokensForVersion ( pkg.version );
  const message = format ( Config.commit.message, tokens );

  await shell ( 'git', ['add', '.'], { cwd: repoPath } );
  await shell ( 'git', ['commit', '-a', '-m', message], { cwd: repoPath } );

};

/* EXPORT */

export default commitGit;
