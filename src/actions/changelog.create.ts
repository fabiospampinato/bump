
/* IMPORT */

import fs from 'node:fs';
import {getRepositoryCommitsGroups} from '../utils';
import changelogRender from './changelog.render';

/* MAIN */

const changelogCreate = async ( changelogPath: string ): Promise<void> => {

  const exists = fs.existsSync ( changelogPath );

  if ( exists ) return;

  const groups = await getRepositoryCommitsGroups ();
  const groupsTerminated = groups.filter ( group => !!group.version ).reverse ();
  const changelog = await changelogRender ( groupsTerminated );

  fs.writeFileSync ( changelogPath, changelog );

};

/* EXPORT */

export default changelogCreate;
