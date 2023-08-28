
/* MAIN */

import fs from 'node:fs';
import path from 'node:path';
import open from 'tiny-open';
import Config from '../config';
import {format, getChangelogSection, getFilesForGlobs, getTokensForVersion} from '../utils';
import type {Package} from '../types';

/* MAIN */

const releaseGithub = async ( pkg: Package, repoPath: string, update: ( message: string ) => void ): Promise<void> => {

  /* INITIALIZATION */

  const config = Config.release.github;

  if ( !config.owner ) throw new Error ( 'Missing "github.owner" configuration' );

  if ( !config.repo ) throw new Error ( 'Missing "github.repo" configuration' );

  if ( !config.token ) throw new Error ( 'Missing "github.token" configuration' );

  /* RELEASING */

  const releaseUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/releases`;

  const tokens = getTokensForVersion ( pkg.version );
  const tag = format ( Config.tag.name, tokens );
  const body = getChangelogSection ( repoPath, 0 );

  const response = await fetch ( releaseUrl, {
    method: 'POST',
    headers: {
      'Authorization': `token ${config.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify ({
      name: tag,
      tag_name: tag,
      body,
      draft: config.draft,
      prerelease: config.prerelease
    })
  });

  /* OPENING */

  const data = await response.json ();
  const releaseViewUrl = data.html_url;
  const releaseEditUrl = releaseViewUrl.replace ( '/releases/tag/', '/releases/edit/' );

  open ( releaseEditUrl );

  /* UPLOADING */

  if ( !config.files.length ) return;

  const uploadUrl = data.upload_url.replace ( /\{.*?\}/, '' );

  const files = await getFilesForGlobs ( repoPath, config.files, config.filesNr, 10 );

  for ( let i = 0, l = files.length; i < l; i++ ) {

    const file = files[i];
    const relativePath = path.relative ( repoPath, file );

    update ( `(${i + 1}/${l}) Uploading "${relativePath}"...` );

    const name = path.basename ( file );
    const stat = fs.statSync ( file );
    const content = fs.readFileSync ( file );

    const response = await fetch ( `${uploadUrl}?name=${name}`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${config.token}`,
        'Content-Type': 'application/octet-stream',
        'Content-Length': `${stat.size}`
      },
      body: content
    });

    const result = await response.json ();

    if ( result?.state !== 'uploaded' ) throw new Error ( `Failed to upload "${name}", try again` );

  }

};

/* EXPORT */

export default releaseGithub;
