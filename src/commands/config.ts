
/* IMPORT */

import {inspect} from 'node:util';
import Config from '../config';

/* MAIN */

const config = (): true => {

  console.log ( inspect ( Config, { colors: true, depth: Infinity, maxArrayLength: Infinity, maxStringLength: Infinity, breakLength: 1 } ) );

  return true;

};

/* EXPORT */

export default config;
