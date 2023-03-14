
/* IMPORT */

import _ from 'lodash';
import path from 'node:path';
import process from 'node:process';
import File from '~/utils/file';

/* MAIN */

const Git = {

  /* API */

  getPath: async (): Promise<string | null> => {

    //TODO: Maybe find up recursively?

    const gitPath = path.join ( process.cwd (), '.git' );
    const gitPathExists = await File.exists ( gitPath );

    return gitPathExists ? gitPath : null;

  }

};

/* EXPORT */

export default Git;
