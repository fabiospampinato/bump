
/* IMPORT */

import * as prask from 'prask';
import semver from 'semver';
import versionPackage from '../actions/version.package';
import versionPackageLock from '../actions/version.package_lock';
import {exit, getPackage, getRepositoryPath, getRepositoryCommitsPending, isVersionIncrement} from '../utils';
import command from './command';

/* MAIN */

const version = async ( version?: string | null ): Promise<boolean> => {

  /* INITIALIZATION */

  const pkg = getPackage ();
  const repoPath = getRepositoryPath ();

  if ( !pkg || !repoPath ) return exit ( 'Unsupported repository' );

  /* VERSION SELECTION */

  version ||= await prask.select ({ message: 'Select an increment:', options: ['major', 'minor', 'patch', 'manual'] });

  if ( version === 'manual' ) {

    version = await prask.string ({ message: 'Enter a version:', required: true });

  }

  if ( !version ) return false;

  if ( isVersionIncrement ( version ) ) {

    version = semver.inc ( pkg.version, version );

  } else {

    version = semver.coerce ( version )?.version;

  }

  if ( !version ) return exit ( 'Invalid version increment' );

  /* NO CHANGES CHECK */

  const pending = await getRepositoryCommitsPending ();

  if ( !pending.length ) {

    const confirmation = await prask.toggle ({ message: 'No changes detected, bump anyway?' });

    if ( !confirmation ) return false;

  }

  /* COMMAND */

  return command ({
    name: 'version',
    start: 'Bumping the version...',
    success: `Version bumped to "${version}" successfully`,
    error: 'Version bump failed',
    run: () => {
      versionPackage ( pkg, repoPath, version! ); //TSC
      versionPackageLock ( pkg, repoPath, version! ); //TSC
    }
  });

};

/* EXPORT */

export default version;
