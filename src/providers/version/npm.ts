
/* IMPORT */

import Files from './files';

/* NPM */

class NPM extends Files {

  getFiles () {

    return {
      'package.json': ['"version":\\s*"([^"]*)"', '"version": "[version]"', 'm'],
      'package-lock.json': ['"version":\\s*"([^"]*)"', '"version": "[version]"', 'm']
    };

  }

}

/* EXPORT */

export default NPM;
