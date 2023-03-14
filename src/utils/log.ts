
/* IMPORT */

import Config from '~/config';

/* MAIN */

const log = ( message: unknown ): void => {

  if ( Config.silent ) return;

  console.log ( message );

};

/* EXPORT */

export default log;
