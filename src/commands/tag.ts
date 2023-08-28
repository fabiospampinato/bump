
/* IMPORT */

import tagGit from '../actions/tag.git';
import {exit, getPackage, getRepositoryPath} from '../utils';
import command from './command';

/* MAIN */

const tag = async (): Promise<boolean> => {

  /* INITIALIZATION */

  const pkg = getPackage ();
  const repoPath = getRepositoryPath ();

  if ( !pkg || !repoPath ) return exit ( 'Unsupported repository' );

  /* COMMAND */

  return command ({
    name: 'tag',
    start: 'Tagging the commit...',
    success: 'Commit tagged successfully',
    error: 'Commit tagging failed',
    run: () => {
      return tagGit ( pkg, repoPath );
    }
  });

};

/* EXPORT */

export default tag;
