
/* IMPORT */

import Config from '~/config';
import Changelog from '~/providers/changelog/file';
import Utils from '~/utils';

/* MAIN */

const changelog = async (): Promise<void> => {

  const repoPath = await Utils.repository.getPath ();
  const version = await Utils.repository.getVersion ( repoPath );

  if ( !repoPath || !version ) return Utils.exit ( '[changelog] Unsupported repository' );

  await Utils.script.run ( 'prechangelog' );

  Utils.log ( 'Updating the changelog...' );

  await Changelog.update ( repoPath, version );

  await Utils.script.run ( 'postchangelog' );

  if ( Config.changelog.open ) {

    await Changelog.open ( repoPath );

  }

};

/* EXPORT */

export default changelog;
