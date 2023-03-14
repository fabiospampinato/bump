
/* IMPORT */

import Config from '~/config';
import Utils from '~/utils';

/* MAIN */

const Tag = {

  /* API */

  add: async ( repoPath: string, version: string ): Promise<void> => {

    const name = Utils.template.render ( Config.tag.name, {version} );

    try {

      await Utils.shell.exec ( 'git', ['tag', name], { cwd: repoPath } );

    } catch ( error: unknown ) {

      Utils.log ( error );

      Utils.exit ( '[tag] An error occurred while tagging the commit' );

    }

  }

};

/* EXPORT */

export default Tag;
