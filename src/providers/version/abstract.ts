
/* IMPORT */

import * as _ from 'lodash';
import * as path from 'path';
import * as pify from 'pify';
import Prompt from 'inquirer-helpers';
import * as semver from 'semver';
import * as simpleGit from 'simple-git';
import Config from '../../config';
import Utils from '../../utils';

/* ABSTRACT */

abstract class Abstract {

  repoPath; git;

  constructor ( repoPath: string ) {

    this.repoPath = repoPath;

    this.git = pify ( _.bindAll ( simpleGit ( this.repoPath ), ['log', 'silent', 'show'] ) );
    this.git.silent ( true );

    this.init ();

  }

  abstract async isSupported (): Promise<boolean>;

  init () {}

  async bump ( increment: string, version: string | null = null ) {

    /* VARIABLES */

    const commitsBump = await this.getCommitsBumps ( 1 );

    /* CHECKS */

    if ( !commitsBump.length && !Config.force ) { // No changes

      if ( !await Prompt.yesNo ( 'No changes detected, bump anyway?' ) ) return;

    }

    /* VERSION */

    if ( !version ) {

      version = await this.getVersion ();

      version = semver.inc ( version, increment );

      if ( !version ) return;

    }

    /* BUMP */

    await Utils.script.run ( 'prebump' );

    await this.updateVersion ( version );

    await Utils.script.run ( 'postbump' );

  }

  async getContent ( filePath: string ) {

    const repoFilePath = path.join ( this.repoPath, filePath );

    return await Utils.file.read ( repoFilePath );

  }

  async getContentByCommit ( commit: Commit, filePath: string ) {

    try {

      return await this.git.show ( `${commit.hash}:${filePath}` );

    } catch ( e ) {}

  }

  async setContent ( filePath: string, content: string ) {

    const repoFilePath = path.join ( this.repoPath, filePath );

    await Utils.file.write ( repoFilePath, content );

  }

  async getCommitNth ( nth: number ): Promise<Commit | undefined> {

    const commits = await this.getCommitsChunk ( nth, 1 );

    return commits[0];

  }

  async getCommitsChunk ( nth: number, size: number ): Promise<Commit[]> {

    try { // An error gets thrown if there are no commits

      const log = await this.git.log ([ '-n', size, '--skip', size * nth ]);

      return log.all;

    } catch ( e ) {

      return [];

    }

  }

  async getCommitsBumps ( limit: number = Infinity ): Promise<Bump[]> { // Get "limit" number of groups of commits grouped by version

    let bumps: Bump[] = [],
        bump: Bump = { version: '', commits: [] },
        chunkNth = 0,
        prevVersion = await this.getVersion ();

    while ( true ) {

      const commits = await this.getCommitsChunk ( chunkNth, 50 );

      if ( !commits.length ) break;

      for ( let commit of commits ) {

        const version = await this.getVersionByCommit ( commit );

        if ( version !== prevVersion ) {

          const commitLast = bump.commits.pop () as Commit;

          if ( bumps.length >= limit ) break;

          const commits = [commit];

          if ( commitLast ) {

            commits.unshift ( commitLast );

            commitLast.isBump = true;

          }

          if ( !bump.commits.length ) {

            bumps.pop ();

          }

          bump = { version: prevVersion, commits };

          bumps.push ( bump );

        } else {

          bump.commits.push ( commit );

        }

        prevVersion = version;

      }

      if ( bumps.length >= limit ) break;

      chunkNth++;

    }

    return bumps;

  }

  async getVersion () {

    const commit = await this.getCommitNth ( 0 );

    return await this.getVersionByCommit ( commit );

  }

  abstract async getVersionByCommit ( commit?: Commit ): Promise<string>;

  abstract async updateVersion ( version: string );

}

/* EXPORT */

export default Abstract;
