
/* IMPORT */

import Files from '~/providers/version/files';
import type {ArrayMaybe} from '~/types';

/* MAIN */

class NPM extends Files {

  /* API */

  getFiles = (): Record<string, ArrayMaybe<[string, string, string?]>> => {

    return {
      'package.json': ['"version":\\s*"([^"]*?)"', '"version": "[version]"', "mi"],
      'package-lock.json': ['"version":\\s*"([^"]*?)"', '"version": "[version]"', "mi"]
    };

  }

}

/* EXPORT */

export default NPM;
