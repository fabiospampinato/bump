
/* IMPORT */

import fs from 'node:fs';
import {getPackage, getRepositoryCommitsGroups, last} from '../utils';
import changelogRender from './changelog.render';

/* MAIN */

const changelogUpdate = async ( changelogPath: string ): Promise<void> => {

  const pkg = getPackage ();

  if ( !pkg ) throw new Error ( 'Unsupported repository' );

  const exists = fs.existsSync ( changelogPath );

  if ( !exists ) throw new Error ( 'Changelog not found' );

  const groups = await getRepositoryCommitsGroups ();
  const group = last ( groups ); //TODO: Detect the last rendered group instead

  if ( !group || group.versionDate || !group.commits.length ) return; // Nothing new

  group.version = pkg.version;
  group.versionDate = new Date ();

  const changelogPrev = fs.readFileSync ( changelogPath, 'utf8' );
  const changelogNew = await changelogRender ([ group ]);
  const changelogNext = `${changelogNew}${changelogPrev}`;

  fs.writeFileSync ( changelogPath, changelogNext );

};

/* EXPORT */

export default changelogUpdate;
