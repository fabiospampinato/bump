#!/usr/bin/env node

/* IMPORT */

import {bin, color} from 'specialist';
import {all, config, version, changelog, commit, tag, release} from '.';

/* MAIN */

bin ( 'bump', 'Update your project\'s version, and more' )
  /* USAGES */
  .usage ( `bump ${color.yellow ( '[version|type]' )}` )
  .usage ( `bump ${color.yellow ( 'minor' )}` )
  .usage ( `bump ${color.yellow ( '1.0.1' )}` )
  .usage ( `bump ${color.green ( '--config' )} ${color.blue ( './conf/bump.json' )}` )
  .usage ( `bump ${color.magenta ( 'tag' )} ${color.green ( '--posttag' )} ${color.blue ( '"echo Done!"' )}` )
  .usage ( `bump ${color.magenta ( 'release' )} ${color.green ( '--prerelease' )} ${color.blue ( '"npm run build"' )} ${color.green ( '--postrelease' )} ${color.blue ( '"npm publish"' )}` )
  /* DEFAULT COMMAND */
  .option ( '--config, -c <path|object>', 'Path to configuration file or plain JSON object' )
  .option ( '--force', 'Force the command, without asking for confirmation' )
  .option ( '--no-scripts', 'Disable pre and post scripts' )
  .option ( '--preversion <script>', 'Script to execute before bumping the version' )
  .option ( '--prechangelog <script>', 'Script to execute before updating the changelog' )
  .option ( '--precommit <script>', 'Script to execute before making the commit' )
  .option ( '--pretag <script>', 'Script to execute before tagging the commit' )
  .option ( '--prerelease <script>', 'Script to execute before releasing' )
  .option ( '--postversion <script>', 'Script to execute after bumping the version' )
  .option ( '--postchangelog <script>', 'Script to execute after updating the changelog' )
  .option ( '--postcommit <script>', 'Script to execute after making the commit' )
  .option ( '--posttag <script>', 'Script to execute after tagging the commit' )
  .option ( '--postrelease <script>', 'Script to execute after releasing' )
  .argument ( '[version|type]', 'Next version or supported increment type' )
  .action ( ( _, args ) => all ( args[0] ) )
  /* CONFIG */
  .command ( 'config', 'Inspect the configuration, for debugging' )
  .action ( () => config () )
  /* VERSION */
  .command ( 'version', 'Only bump the version number' )
  .argument ( '[version|type]', 'Next version or supported increment type' )
  .action ( ( _, args ) => version ( args[0] ) )
  /* CHANGELOG */
  .command ( 'changelog', 'Only update the changelog' )
  .action ( () => changelog ( true ) )
  /* COMMIT */
  .command ( 'commit', 'Only make the commit' )
  .action ( () => commit () )
  /* TAG */
  .command ( 'tag', 'Only tag the commit' )
  .action ( () => tag () )
  /* RELEASE */
  .command ( 'release', 'Only make the release' )
  .action ( () => release () )
  /* RUN */
  .run ();
