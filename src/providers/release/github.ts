
/* IMPORT */

import fs from 'fs';
import mime from 'mime-types';
import octokit from '@octokit/rest';
import opn from 'opn';
import path from 'path';
import username from 'git-username';
import Config from '../../config';
import Utils from '../../utils';
import Changelog from '../changelog/file';
import type {UploaderOptions} from '../../types';

/* MAIN */

const GitHub = {

  async do ( repoPath: string, version: string ) {

    if ( !Config.release.github.token ) return Utils.exit ( '[release] Missing GitHub token' );

    const cwd = repoPath;
    const github = new octokit ({
      auth: Config.release.github.token
    });

    try {

      const owner = Config.release.github.owner || username ({ cwd });
      const repo = Config.release.github.repo || path.basename ( cwd );
      const tag = Utils.template.render ( Config.tag.name, {version} );

      const release = await github.repos.createRelease ({
        owner,
        repo,
        draft: Config.release.github.draft,
        prerelease: Config.release.github.prerelease,
        name: tag,
        tag_name: tag,
        body: await Changelog.section.readLast ( repoPath )
      });

      if ( Config.release.github.open ) {

        opn ( release.data.html_url, { wait: false } );

      }

      if ( Config.release.github.files.length ) {

        const options: UploaderOptions<octokit.Response<octokit.ReposUpdateReleaseAssetResponseUploader>, octokit.Response<octokit.ReposDeleteReleaseAssetResponse>> = {
          globs: Config.release.github.files,
          filesNr: Config.release.github.filesNr,
          upload ( filePath: string ) {
            return github.repos.uploadReleaseAsset ({
              url: release.data.upload_url,
              name: path.basename ( filePath ),
              file: fs.createReadStream ( filePath ),
              headers: {
                'content-type': mime.lookup ( filePath ),
                'content-length': fs.statSync ( filePath ).size
              }
            });
          },
          cancel ( filePath: string, asset: octokit.Response<octokit.ReposUpdateReleaseAssetResponseUploader> ) {
            return github.repos.deleteReleaseAsset ({
              owner,
              repo,
              asset_id: asset.data.id
            });
          }
        }

        const uploader = new Utils.Uploader ( options );

        await uploader.start ();

      }

    } catch ( e ) {

      Utils.log ( e );

      Utils.exit ( '[release] An error occurred while making the GitHub release' );

    }

  }

};

/* EXPORT */

export default GitHub;
