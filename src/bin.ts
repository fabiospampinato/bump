#!/usr/bin/env node

/* IMPORT */

import {bin} from 'specialist';
import bump from '.';

/* MAIN */

//TODO: Add back custom usage examples

bin ( 'bump', 'Update your project\'s version, and more' )
  /* DEFAULT OPTIONS */
  .option ( '--config, -c <path|object>', 'Path to configuration file or plain JSON object' )
  .option ( '--force', 'Force the command without prompting the user' )
  .option ( '--silent', 'Minimize the amount of logs' )
  .option ( '--no-scripts', 'Disable scripts' )
  .option ( '--prebump <script>', 'Script to execute before bumping the version' )
  .option ( '--prechangelog <script>', 'Script to execute before updating the changelog' )
  .option ( '--precommit <script>', 'Script to execute before making the commit' )
  .option ( '--pretag <script>', 'Script to execute before tagging the commit' )
  .option ( '--prerelease <script>', 'Script to execute before releasing' )
  .option ( '--postbump <script>', 'Script to execute after bumping the version' )
  .option ( '--postchangelog <script>', 'Script to execute after updating the changelog' )
  .option ( '--postcommit <script>', 'Script to execute after making the commit' )
  .option ( '--posttag <script>', 'Script to execute after tagging the commit' )
  .option ( '--postrelease <script>', 'Script to execute after releasing' )
  /* DEFAULT COMMAND */
  .argument ( '[version|increment]', 'Next version or supported increment name' )
  .action ( () => bump () )
  /* VERSION */
  .command ( 'version', 'Only bump the version number' )
  .option ( '--config, -c <path|object>', 'Path to configuration file or plain JSON object' )
  .option ( '--force', 'Force the command without prompting the user' )
  .option ( '--silent', 'Minimize the amount of logs' )
  .option ( '--no-scripts', 'Disable scripts' )
  .option ( '--prebump <script>', 'Script to execute before bumping the version' )
  .option ( '--postbump <script>', 'Script to execute after bumping the version' )
  .argument ( '[version|increment]', 'Next version or supported increment name' )
  .action ( () => bump ({ version: true }) )
  /* CHANGELOG */
  .command ( 'changelog', 'Only update the changelog' )
  .option ( '--config, -c <path|object>', 'Path to configuration file or plain JSON object' )
  .option ( '--force', 'Force the command without prompting the user' )
  .option ( '--silent', 'Minimize the amount of logs' )
  .option ( '--no-scripts', 'Disable scripts' )
  .option ( '--prechangelog <script>', 'Script to execute before updating the changelog' )
  .option ( '--postchangelog <script>', 'Script to execute after updating the changelog' )
  .action ( () => bump ({ changelog: true }) )
  /* COMMIT */
  .command ( 'commit', 'Only make the commit' )
  .option ( '--config, -c <path|object>', 'Path to configuration file or plain JSON object' )
  .option ( '--force', 'Force the command without prompting the user' )
  .option ( '--silent', 'Minimize the amount of logs' )
  .option ( '--no-scripts', 'Disable scripts' )
  .option ( '--precommit <script>', 'Script to execute before making the commit' )
  .option ( '--postcommit <script>', 'Script to execute after making the commit' )
  .action ( () => bump ({ commit: true }) )
  /* TAG */
  .command ( 'tag', 'Only tag the commit' )
  .option ( '--config, -c <path|object>', 'Path to configuration file or plain JSON object' )
  .option ( '--force', 'Force the command without prompting the user' )
  .option ( '--silent', 'Minimize the amount of logs' )
  .option ( '--no-scripts', 'Disable scripts' )
  .option ( '--pretag <script>', 'Script to execute before tagging the commit' )
  .option ( '--posttag <script>', 'Script to execute after tagging the commit' )
  .action ( () => bump ({ tag: true }) )
  /* RELEASE */
  .command ( 'release', 'Only make the release' )
  .option ( '--config, -c <path|object>', 'Path to configuration file or plain JSON object' )
  .option ( '--force', 'Force the command without prompting the user' )
  .option ( '--silent', 'Minimize the amount of logs' )
  .option ( '--no-scripts', 'Disable scripts' )
  .option ( '--prerelease <script>', 'Script to execute before releasing' )
  .option ( '--postrelease <script>', 'Script to execute after releasing' )
  .action ( () => bump ({ release: true }) )
  /* RUN */
  .run ();
