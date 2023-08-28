
/* IMPORT */

import findUp from 'find-up-json';
import os from 'node:os';
import type {Config, DeepPartial} from '../types';

/* MAIN */

const global = (): DeepPartial<Config> => {

  const file = findUp ( '.bump.json', os.homedir () );

  if ( !file ) return {};

  return file.content;

};

/* EXPORT */

export default global;
