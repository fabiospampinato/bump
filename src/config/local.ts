
/* IMPORT */

import findUp from 'find-up-json';
import process from 'node:process';
import type {Config, DeepPartial} from '../types';

/* MAIN */

const local = (): DeepPartial<Config> => {

  const file = findUp ( 'bump.json', process.cwd () );

  if ( !file ) return {};

  return file.content;

};

/* EXPORT */

export default local;
