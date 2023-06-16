
/* IMPORT */

import Files from './files';

/* NPM */

class NPM extends Files {

  getFiles () {

    return {
      'package.json': ['"version":\\s*"([^"]*?)"', '"version": "[version]"', "mi"],
      'package-lock.json': ['"version":\\s*"([^"]*?)"', '"version": "[version]"', "gmi"]
    };

  }

}

/* EXPORT */

export default NPM;
