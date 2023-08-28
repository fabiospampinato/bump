
/* IMPORT */

import Spinner from 'tiny-spinner';
import Config from '../config';
import {log, shell} from '../utils';
import type {ScriptName} from '../types';

/* MAIN */

const script = async ( name: ScriptName ): Promise<boolean> => {

  if ( !Config.scripts.enabled ) return true;

  const script = Config.scripts[name];

  if ( !script ) return true;

  const spinner = new Spinner ();

  spinner.start ( `Running "${name}" script...` );

  try {

    await shell ( script );

    spinner.success ( `Successfully ran "${name}" script` );

    return true;

  } catch ( error: unknown ) {

    spinner.error ( `Failed to run "${name}" script` );

    log ( error );

    return false;

  }

};

/* EXPORT */

export default script;
