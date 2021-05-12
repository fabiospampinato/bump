
/* IMPORT */

import * as _ from 'lodash';
import * as execa from 'execa';
import {color} from 'specialist';
import * as windowSize from 'window-size';
import Config from '../config';
import Utils from '../utils';

/* SCRIPT */

const Script = {

  async run ( name: string ) {

    if ( !Config.scripts.enabled ) return;

    const script = Config.scripts[name];

    if ( !script ) return;

    const size = _.get ( windowSize.get (), 'width', 40 );

    try {

      Utils.log ( color.yellow ( `┌─ script:${name} ${'─'.repeat ( size - 12 - name.length )}┐` ) );

      await execa.shell ( `${script} && exit 0`, { stdout: 'inherit', stderr: 'inherit' } );

      Utils.log ( color.yellow ( `└${'─'.repeat ( size - 2 )}┘` ) );

    } catch ( e ) {

      Utils.log ( e );

      Utils.exit ( `[script] An error occurred while executing the "${color.bold ( name )}" script` );

    }

  }

};

/* EXPORT */

export default Script;
