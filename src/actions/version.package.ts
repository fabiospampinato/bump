
/* IMPORT */

import fs from 'node:fs';
import path from 'node:path';
import type {Package} from '../types';

/* MAIN */

const versionPackage = ( pkg: Package, repoPath: string, version: string ): void => {

  const packagePath = path.join ( repoPath, 'package.json' );
  const packageExists = fs.existsSync ( packagePath );

  if ( !packageExists ) throw new Error ( 'package.json file not found' );

  const re = new RegExp ( `("version":\\s*)"(${pkg.version})"` );
  const packagePrev = fs.readFileSync ( packagePath, 'utf8' );
  const packageNext = packagePrev.replace ( re, `$1"${version}"` );
  const packageChanged = ( packagePrev !== packageNext );

  if ( !packageChanged ) throw new Error ( 'Unable to update version in package.json file' );

  fs.writeFileSync ( packagePath, packageNext );

};

/* EXPORT */

export default versionPackage;
