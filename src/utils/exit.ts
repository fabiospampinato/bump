
/* IMPORT */

import {color} from 'specialist';

/* EXIT */

function exit ( message: string = 'An error occurred!', code: number = 1 ) {

  console.error ( color.red ( message ) );

  process.exit ( code );

}

/* EXPORT */

export default exit;
