
/* IMPORT */

import fs from 'node:fs';
import {getRepositoryCommitsGroups} from '../utils';
import changelogRender from './changelog.render';

/* MAIN */

const changelogCreate = async ( changelogPath: string ): Promise<boolean> => {

  const exists = fs.existsSync ( changelogPath );

  if ( exists ) return false;

  const groups = await getRepositoryCommitsGroups ();
  const groupsTerminated = groups.filter ( group => !!group.version ).reverse ();
  const changelog = await changelogRender ( groupsTerminated );

  fs.writeFileSync ( changelogPath, changelog );

  return true;

};

/* EXPORT */

export default changelogCreate;
