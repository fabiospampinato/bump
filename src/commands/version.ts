
/* IMPORT */

import * as _ from 'lodash';
import chalk from 'chalk';
import Prompt from 'inquirer-helpers';
import * as minimist from 'minimist';
import * as semver from 'semver';
import Config from '../config';
import Utils from '../utils';

/* VERSION */

async function version () {

  /* CHECKS */

  const repoPath = await Utils.repository.getPath ();

  if ( !repoPath ) return Utils.exit ( '[version] Unsupported repository' );

  const providers = await Utils.repository.getVersionProviders ( repoPath );

  if ( !providers.length ) return Utils.exit ( '[version] Unsupported repository' );

  /* NEXT */

  const argv = minimist ( process.argv.slice ( 2 ) ),
        commands = ['version', 'changelog', 'commit', 'tag', 'release'],
        increments = ['major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease', 'custom'];

  let next = argv._[1] || argv._[0],
      increment,
      version;

  if ( next && !commands.includes ( next ) ) {

    next = _.trimStart ( next, 'v' ); // In order to support things like `v2`

    if ( increments.includes ( next ) ) {

      increment = next;

    } else if ( /^\d/.test ( next ) ) {

      increment = 'custom';

      version = semver.coerce ( next );

      if ( !semver.valid ( version ) ) return Utils.exit ( `[version] Invalid version number: "${chalk.bold ( version )}"` );

    } else {

      return Utils.exit ( `[version] Invalid version number or version increment: "${chalk.bold ( next )}"` );

    }

  }

  if ( !version ) {

    if ( !increment ) {

      const increments = Config.version.increments;

      if ( !increments.length ) return Utils.exit ( '[version] You have to explicitly provide a version number when no increments are enabled' );

      increment = await Prompt.list ( 'Select an increment:', increments );

    }

    if ( increment === 'custom' ) {

      version = await Prompt.input ( 'Enter a version:' );

      version = semver.coerce ( version );

      if ( !semver.valid ( version ) ) return Utils.exit ( `[version] Invalid version number: "${chalk.bold ( version )}"` );

    }

  }

  /* BUMP */

  Utils.log ( 'Bumping the version...' );

  await Promise.all ( providers.map ( provider => provider.bump ( increment, version ) ) );

}

/* EXPORT */

export default version;
