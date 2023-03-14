
/* IMPORT */

import process from 'node:process';
import {color} from 'specialist';

/* MAIN */

const exit = ( message: string = 'An error occurred' ): never => {

  console.error ( color.red ( message ) );

  process.exit ( 1 );

};

/* EXPORT */

export default exit;
