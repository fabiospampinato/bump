
/* IMPORT */

import fs from 'node:fs';
import * as prask from 'prask';
import open from 'tiny-open';
import Config from '../config';

/* MAIN */

const changelogReview = async ( changelogPath: string ): Promise<void> => {

  const exists = fs.existsSync ( changelogPath );

  if ( !exists ) throw new Error ( 'Changelog not found' );

  open ( changelogPath );

  const confirmation = Config.force || await prask.toggle ({ message: 'Review the changelog. Can we continue now?' });

  if ( confirmation ) return;

  throw new Error ( 'Changelog review failed' );

};

/* EXPORT */

export default changelogReview;
