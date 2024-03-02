
/* IMPORT */

import changelogCreate from '../actions/changelog.create';
import changelogReview from '../actions/changelog.review';
import changelogUpdate from '../actions/changelog.update';
import Config from '../config';
import {exit, getChangelogPath, getPackage, getRepositoryPath} from '../utils';
import command from './command';

/* MAIN */

const changelog = async ( create: boolean = Config.changelog.create, review: boolean = Config.changelog.review ): Promise<boolean> => {

  /* INITIALIZATION */

  const pkg = getPackage ();
  const repoPath = getRepositoryPath ();

  if ( !pkg || !repoPath ) return exit ( 'Unsupported repository' );

  const changelogPath = getChangelogPath ( repoPath, !create );

  if ( !changelogPath ) return true;

  /* COMMAND */

  const result = await command ({
    name: 'changelog',
    start: 'Updating the changelog...',
    success: 'Changelog updated successfully',
    error: 'Changelog update failed',
    run: async () => {
      const created = await changelogCreate ( changelogPath );
      if ( created ) return;
      await changelogUpdate ( changelogPath );
    }
  });

  if ( !result || !review ) return result;

  await changelogReview ( changelogPath );

  return true;

};

/* EXPORT */

export default changelog;
