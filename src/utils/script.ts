
/* IMPORT */

import _ from 'lodash';
import process from 'node:process';
import {color} from 'specialist';
import Config from '~/config';
import exit from '~/utils/exit';
import log from '~/utils/log';
import Shell from '~/utils/shell';

/* MAIN */

const Script = {

  /* API */

  run: async ( name: string ): Promise<void> => {

    if ( !Config.scripts.enabled ) return;

    const script = Config.scripts[name];

    if ( !script ) return;

    const size = ( process.stdout.getWindowSize?.()?.[0] || 25 ) - 1;

    try {

      log ( color.yellow ( `┌─ script:${name} ${'─'.repeat ( size - 12 - name.length )}┐` ) );

      await Shell.spawn ( script );

      log ( color.yellow ( `└${'─'.repeat ( size - 2 )}┘` ) );

    } catch ( error: unknown ) {

      log ( error );

      exit ( `[script] An error occurred while executing the "${color.bold ( name )}" script` );

    }

  }

};

/* EXPORT */

export default Script;
