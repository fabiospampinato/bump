
/* IMPORT */

import {parseArgv} from 'specialist';
import type {Config, DeepPartial, ScriptName} from '../types';

/* MAIN */

const options = (): DeepPartial<Config> => {

  const argv = parseArgv ( process.argv.slice ( 2 ) );
  const optionsConfig: DeepPartial<Config> = {};

  optionsConfig.scripts = {};

  if ( argv['scripts'] === false ) {

    optionsConfig.scripts.enabled = false;

  }

  const scripts: ScriptName[] = ['preversion', 'postversion', 'prechangelog', 'postchangelog', 'precommit', 'postcommit', 'pretag', 'posttag', 'prerelease', 'postrelease'];

  for ( const script of scripts ) {

    optionsConfig.scripts[script] = argv[script];

  }

  return optionsConfig;

};

/* EXPORT */

export default options;
