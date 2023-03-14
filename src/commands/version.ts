
/* IMPORT */

import _ from 'lodash';
import process from 'node:process';
import Prompt from 'prompts-helpers';
import semver from 'semver';
import {parseArgv} from 'specialist';
import {color} from 'specialist';
import Config from '~/config';
import Utils from '~/utils';

/* MAIN */

const version = async (): Promise<void> => {

  /* CHECKS */

  const repoPath = await Utils.repository.getPath ();

  if ( !repoPath ) return Utils.exit ( '[version] Unsupported repository' );

  const providers = await Utils.repository.getVersionProviders ( repoPath );

  if ( !providers.length ) return Utils.exit ( '[version] Unsupported repository' );

  /* NEXT */

  const argv = parseArgv ( process.argv.slice ( 2 ) );
  const commands = ['version', 'changelog', 'commit', 'tag', 'release'];
  const increments = ['major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease', 'custom'];

  let next = argv._[1] || argv._[0];
  let increment: string | false | undefined;
  let version: string | false | undefined;

  if ( next && !commands.includes ( next ) ) {

    if ( increments.includes ( next ) ) {

      increment = next;

    } else if ( /^(\d|v\d)/.test ( next ) ) {

      increment = 'custom';
      version = next;

    } else {

      return Utils.exit ( `[version] Invalid version number or version increment: "${color.bold ( next )}"` );

    }

  }

  if ( !version ) {

    if ( !increment ) {

      const increments = Config.version.increments;

      if ( !increments.length ) return Utils.exit ( '[version] You have to explicitly provide a version number when no increments are enabled' );

      increment = await Prompt.select ( 'Select an increment:', increments );

    }

    if ( increment === 'custom' ) {

      version = await Prompt.text ( 'Enter a version:' );

    }

  }

  if ( version ) {

    const original = version;

    version = _.trimStart ( version, 'v' ); // In order to support things like `v2`

    if ( !semver.valid ( version ) ) {

      const semversion = semver.coerce ( version );

      if ( !semversion ) return Utils.exit ( `[version] Invalid version number: "${color.bold ( original )}"` );

      version = semversion.version;

    }

  }

  /* NO CHANGES */

  const bumps = await Utils.repository.getVersionProvidersResult ( repoPath, 'getCommitsBumps', 1 );

  if ( ( !bumps || !bumps.length || ( bumps.length === 1 && !bumps[0].commits.length ) ) && !Config.force ) { // No changes

    if ( !await Prompt.noYes ( 'No changes detected, bump anyway?' ) ) return process.exit ();

  }

  /* BUMP */

  Utils.log ( 'Bumping the version...' );

  await Utils.script.run ( 'prebump' );

  await Promise.all ( providers.map ( provider => provider.bump ( increment, version ) ) ); //TSC

  await Utils.script.run ( 'postbump' );

};

/* EXPORT */

export default version;
