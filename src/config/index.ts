
/* IMPORT */

import defaults from './defaults';
import global from './global';
import local from './local';
import env from './env';
import dynamic from './dynamic';
import options from './options';
import {merge} from '../utils';
import type {Config} from '../types';

/* MAIN */

const config = merge<Config> ([
  defaults (),
  global (),
  env (),
  local (),
  dynamic (),
  options ()
]);

/* EXPORT */

export default config;
