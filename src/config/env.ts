
/* IMPORT */

import process from 'node:process';
import type {Config, DeepPartial} from '../types';

/* MAIN */

const env = (): DeepPartial<Config> => {

  const token = process.env['BUMP_GITHUB_TOKEN'] || process.env['GITHUB_TOKEN'];

  if ( !token ) return {};

  return { release: { github: { token } } };

};

/* EXPORT */

export default env;
