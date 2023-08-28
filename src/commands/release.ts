
/* IMPORT */

import releaseGithub from '../actions/release.github';
import {exit, getPackage, getRepositoryPath} from '../utils';
import command from './command';

/* MAIN */

const release = async (): Promise<boolean> => {

  /* INITIALIZATION */

  const pkg = getPackage ();
  const repoPath = getRepositoryPath ();

  if ( !pkg || !repoPath ) return exit ( 'Unsupported repository' );

  /* COMMAND */

  return command ({
    name: 'commit',
    start: 'Releasing to GitHub...',
    success: 'Released to GitHub successfully',
    error: 'Release to GitHub failed',
    run: () => {
      return releaseGithub ( pkg, repoPath );
    }
  });

};

/* EXPORT */

export default release;
