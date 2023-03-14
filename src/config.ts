
/* IMPORT */

import _ from 'lodash';
import findUp from 'find-up-json';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import {parseArgv} from 'specialist';
import Utils from '~/utils';
import type {ArrayMaybe} from '~/types';

/* MAIN */

const Config = {
  force: false, // Force the command without prompting the user
  silent: false, // Minimize the amount of logs
  files: <Record<string, ArrayMaybe<[string, string, string?]>>> {}, // A map of `relativeFilePath: ArrayMaybe<[regex, replacement, regexFlags?]>
  version: {
    enabled: true, // Bump the version number
    initial: '0.0.0', // Initial version
    increments: ['major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease', 'custom'] // List of available increments to pick from
  },
  changelog: {
    ask: true, // Whether to ask to create a changelog or not
    enabled: true, // Enable changelog auto-updates
    create: false, // Create the changelog file if it doesn't exist
    open: true, // Open the changelog file after bumping
    file: 'CHANGELOG.md', // Name of the changelog file
    version: '### Version [version]', // Template for the version line
    commit: '- [message]', // Template for the commit line
    separator: '\n' // Template for the separator between versions sections
  },
  commit: {
    enabled: true, // Commit the changes automatically
    message: 'Bumped version to [version]' // Template for the commit message
  },
  tag: {
    enabled: true, // Tag the bump commit
    name: 'v[version]' // Template for the name of the tag
  },
  release: {
    enabled: false, // Release to any enabled release providers
    github: {
      enabled: false, // Make a GitHub release
      open: true, // Open the release/draft page
      draft: true, // Mark it as a draft
      prerelease: false, // Mark it as a prerelease
      files: [], // Globs of files to attach to the release
      filesNr: -1, // Number of files expected, if provided bump will watch the file system until it has found the expected number of files. It's recommended to set this value
      token: '', // GitHub OAuth token with `public_repo` priviledge
      owner: '', // GitHub repository owner
      repo: '' // GitHub repository name
    }
  },
  tokens: {
    date: {
      format: 'YYYY-MM-DD' // Moment.js format to use when generating the `[date]` token
    },
    version_date: {
      format: 'YYYY-MM-DD' // Moment.js format to use when generating the `[version_date]` token
    }
  },
  scripts: {
    enabled: true, // Run the scripts
    prebump: '', // Script to execute before bumping the version
    postbump: '', // Script to execute after bumping the version
    prechangelog: '', // Script to execute before updating the changelog
    postchangelog: '', // Script to execute after updating the changelog
    precommit: '', // Script to execute before committing
    postcommit: '', // Script to execute after committing
    pretag: '', // Script to execute before tagging
    posttag: '', // Script to execute after tagging
    prerelease: '', // Script to execute before releasing
    postrelease: '' // Script to execute after releasing
  }
};

/* LOCAL */

const initLocal = (): void => {

  const localConfig = findUp ( '.bump.json', os.homedir () );

  if ( !localConfig ) return;

  Utils.config.merge ( Config, localConfig.content );

};

initLocal ();

/* CWD */

const initCwd = (): void => {

  const cwdConfig = findUp ( 'bump.json', process.cwd () );

  if ( !cwdConfig ) return;

  Utils.config.merge ( Config, cwdConfig.content );

};

initCwd ();

/* DYNAMIC */

const initDynamic = () => {

  const argv = parseArgv ( process.argv.slice ( 2 ) );

  /* CONFIG */

  const dynamicPath = _.isString ( argv['config'] ) ? argv['config'] : '';
  const dynamicPathResolved = path.resolve ( process.cwd (), dynamicPath );
  const dynamicConfigFile = _.attempt ( () => fs.readFileSync ( dynamicPathResolved, 'utf8' ) );
  const dynamicConfigJSON = _.attempt ( () => JSON.parse ( dynamicPath ) );
  const dynamicConfig = !_.isError ( dynamicConfigFile ) ? dynamicConfigFile : ( !_.isError ( dynamicConfigJSON ) ? dynamicConfigJSON : undefined );

  if ( dynamicConfig ) Utils.config.merge ( Config, dynamicConfig );

  /* COMMIT & TAG */

  if ( !Config.commit.enabled ) Config.tag.enabled = false;

  /* SWITCHES */

  const switches = <const> ['silent', 'force'];

  switches.forEach ( name => {

    Config[name] = argv[name] || Config[name] || undefined;

  });

  /* SCRIPTS */

  Config.scripts.enabled = !!argv['scripts'] || !!Config.scripts.enabled;

  const scripts = <const> ['prebump', 'postbump', 'prechangelog', 'postchangelog', 'precommit', 'postcommit', 'pretag', 'posttag', 'prerelease', 'postrelease']

  scripts.forEach ( name => {

    Config.scripts[name] = argv[name] || Config.scripts[name] || undefined;

  });

};

initDynamic ();

/* INIT ENVIRONMENT */

const initEnvironment = (): void => {

  const token = process.env['GITHUB_TOKEN'];

  if ( token ) Config.release.github.token = token;

};

initEnvironment ();

/* EXPORT */

export default Config;
