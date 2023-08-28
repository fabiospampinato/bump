
/* IMPORT */

import fs from 'node:fs';
import path from 'node:path';
import type {Package} from '../types';

/* MAIN */

const versionPackageLock = ( pkg: Package, repoPath: string, version: string ): void => {

  const packageLockPath = path.join ( repoPath, 'package-lock.json' );
  const packageLockExists = fs.existsSync ( packageLockPath );

  if ( !packageLockExists ) return;

  const re = new RegExp ( `("name":\\s*"${pkg.name}"\\s*,\\s*"version":\\s*)"(${pkg.version})"`, 'g' );
  const packageLockPrev = fs.readFileSync ( packageLockPath, 'utf8' );
  const packageLockNext = packageLockPrev.replace ( re, `$1"${version}"` );
  const packageLockChanged = ( packageLockPrev !== packageLockNext );

  if ( !packageLockChanged ) throw new Error ( 'Unable to update version in package-lock.json file' );

  fs.writeFileSync ( packageLockPath, packageLockNext );

};

/* EXPORT */

export default versionPackageLock;
