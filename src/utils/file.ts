
/* IMPORT */

import fs from 'node:fs';
import path from 'node:path';

/* MAIN */

const File = {

  /* API */

  exists: async ( filePath: string ): Promise<boolean> => {

    try {

      await fs.promises.access ( filePath );

      return true;

    } catch {

      return false;

    }

  },

  make: async ( filePath: string, content: string ): Promise<void> => {

    const folderPath = path.dirname ( filePath );

    await fs.promises.mkdir ( folderPath, { recursive: true } );

    await File.write ( filePath, content );

  },

  read: async ( filePath: string ) : Promise<string | null> => {

    try {

      const content = fs.promises.readFile ( filePath, 'utf8' );

      return content;

    } catch {

      return null;

    }

  },

  write: async ( filePath: string, content: string ): Promise<void> => {

    await fs.promises.writeFile ( filePath, content );

    // touch.sync ( filePath ); // So that programs will notice the change //TODO: Is this actually needed?

  }

};

/* EXPORT */

export default File;
