
/* IMPORT */

import Commit from '~/providers/commit/git';
import Utils from '~/utils';

/* MAIN */

const commit = async (): Promise<void> => {

  const repoPath = await Utils.repository.getPath ();
  const version = await Utils.repository.getVersion ( repoPath );

  if ( !repoPath || !version ) return Utils.exit ( '[commit] Unsupported repository' );

  await Utils.script.run ( 'precommit' );

  Utils.log ( 'Making the commit...' );

  await Commit.do ( repoPath, version );

  await Utils.script.run ( 'postcommit' );

};

/* EXPORT */

export default commit;
