
/* IMPORT */

import merge from 'plain-object-merge';
import defaults from './defaults';
import global from './global';
import local from './local';
import env from './env';
import dynamic from './dynamic';
import options from './options';
import type {Config} from '../types';

/* MAIN */

const config = merge ([
  defaults (),
  global (),
  env (),
  local (),
  dynamic (),
  options ()
]) as Config; //TSC

/* EXPORT */

export default config;
