
/* IMPORT */

import * as Caporal from 'caporal';
import {color, updater} from 'specialist';
import {name, version} from '../package.json';
import bump from '.';

const caporal = Caporal as any;

/* CLI */

async function CLI () {

  /* APP */

  updater ({ name, version });

  const app = caporal.version ( version );

  /* COMMANDS */

  app.option ( '--config, -c <path|object>', 'Path to configuration file or plain JSON object' )
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
     .action ( () => bump ({ release: true }));

  /* HELP */

  const command = app['_defaultCommand'];
  const helpLines = [
    `bump ${color.yellow ( 'minor' )}`,
    `bump ${color.yellow ( '1.0.1' )}`,
    `bump ${color.green ( '--config' )} ${color.blue ( './conf/bump.json' )} ${color.green ( '--force' )} ${color.green ( '--silent' )}`,
    `bump ${color.magenta ( 'tag' )} ${color.green ( '--posttag' )} ${color.blue ( '"echo Done!"' )}`,
    `bump ${color.magenta ( 'release' )} ${color.green ( '--prerelease' )} ${color.blue ( '"npm run build"' )} ${color.green ( '--postrelease' )} ${color.blue ( '"npm publish"' )}`
  ];

  command.help ( helpLines.join ( '\n' ), { name: 'USAGE - ADVANCED' } );

  /* PARSE */

  caporal.parse ( process.argv );

}

/* EXPORT */

export default CLI;
