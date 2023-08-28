
/* IMPORT */

import commitGit from '../actions/commit.git';
import {exit, getPackage, getRepositoryPath} from '../utils';
import command from './command';

/* MAIN */

const commit = async (): Promise<boolean> => {

  /* INITIALIZATION */

  const pkg = getPackage ();
  const repoPath = getRepositoryPath ();

  if ( !pkg || !repoPath ) return exit ( 'Unsupported repository' );

  /* COMMAND */

  return command ({
    name: 'commit',
    start: 'Making the commit...',
    success: 'Commit made successfully',
    error: 'Commit failed',
    run: () => {
      return commitGit ( pkg, repoPath );
    }
  });

};

/* EXPORT */

export default commit;
