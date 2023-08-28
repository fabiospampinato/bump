
/* IMPORT */

import Config from '../config';
import version from './version';
import changelog from './changelog';
import commit from './commit';
import tag from './tag';
import release from './release';

/* MAIN */

const bump = async ( increment?: string ) : Promise<boolean> => {

  if ( Config.version.enabled ) {

    if ( !await version ( increment ) ) return false;

  }

  if ( Config.changelog.enabled ) {

    if ( !await changelog () ) return false;

  }

  if ( Config.commit.enabled ) {

    if ( !await commit () ) return false;

  }

  if ( Config.tag.enabled ) {

    if ( !await tag () ) return false;

  }

  if ( Config.release.enabled ) {

    if ( !await release () ) return false;

  }

  return true;

};

/* EXPORT */

export default bump;
