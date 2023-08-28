
/* IMPORT */

import fs from 'node:fs';
import path from 'node:path';
import {parseArgv} from 'specialist';
import {attempt, isError} from '../utils';
import type {Config, DeepPartial} from '../types';

/* MAIN */

const dynamic = (): DeepPartial<Config> => {

  const argv = parseArgv ( process.argv.slice ( 2 ) );
  const dynamicPath = argv['config'];

  if ( !dynamicPath ) return {};

  const dynamicPathResolved = path.resolve ( process.cwd (), dynamicPath );
  const dynamicConfigFile = attempt ( () => JSON.parse ( fs.readFileSync ( dynamicPathResolved, 'utf8' ) ) );
  const dynamicConfigJSON = attempt ( () => JSON.parse ( dynamicPath ) );
  const dynamicConfig = !isError ( dynamicConfigFile ) ? dynamicConfigFile : ( !isError ( dynamicConfigJSON ) ? dynamicConfigJSON : {} );

  return dynamicConfig;

};

/* EXPORT */

export default dynamic;
