
/* IMPORT */

import Spinner from 'tiny-spinner';
import {log} from '../utils';
import script from './script';
import type {Command} from '../types';

/* MAIN */

const action = async ( command: Command ): Promise<boolean> => {

  /* PRE SCRIPT */

  const prescript = await script ( `pre${command.name}` );

  if ( !prescript ) return false;

  /* COMMAND */

  const spinner = new Spinner ();

  spinner.start ( command.start );

  try {

    await command.run ();

    spinner.success ( command.success );

  } catch ( error: unknown ) {

    spinner.error ( command.error );

    log ( error );

    return false;

  }

  /* POST SCRIPT */

  const postscript = await script ( `post${command.name}` );

  if ( !postscript ) return false;

  /* RETURN */

  return true;

};

/* EXPORT */

export default action;
