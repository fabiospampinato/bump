
/* IMPORT */

import {spawn} from 'node:child_process';
import type {SpawnOptions} from 'node:child_process';

/* MAIN */

const Shell = {

  /* API */

  exec: async ( command: string, args: string[], options: SpawnOptions = {} ): Promise<void> => {

    return new Promise ( resolve => {

      const child = spawn ( command, args, { stdio: 'inherit', ...options } );

      child.on ( 'exit', resolve );

    });

  },

  spawn: async ( command: string, options: SpawnOptions = {} ): Promise<void> => {

    return new Promise ( resolve => {

      const child = spawn ( command, { stdio: 'inherit', shell: true, ...options } );

      child.on ( 'exit', resolve );

    });

  }

};

/* EXPORT */

export default Shell;
