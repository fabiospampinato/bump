
/* IMPORT */

import findUp from 'find-up-json';
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import * as prask from 'prask';
import delay from 'promise-resolve-timeout';
import readdir from 'tiny-readdir';
import zeptomatch from 'zeptomatch';
import Config from './config';
import type {Package, TokensCommit, TokensVersion, Commit, CommitsGroup} from './types';
import type {SpawnOptions} from 'node:child_process';

/* MAIN */

const attempt = <T> ( fn: () => T ): T | Error => {

  try {

    return fn ();

  } catch ( error: unknown ) {

    return castError ( error );

  }

};

const castError = ( error: unknown ): Error => {

  if ( error instanceof Error ) return error;

  if ( typeof error === 'string' ) return new Error ( error );

  return new Error ( 'Unknown error' );

};

const exit = ( message: string ): false => {

  prask.log.error ( message );

  return false;

};

const format = ( template: string, replacements: Record<string, string> ): string => {

  for ( const replacement in replacements ) {

    template = template.replaceAll ( `[${replacement}]`, replacements[replacement] );

  }

  return template;

};

const formatDate = ( date: Date, format: 'YYYY-MM-DD' ): string => {

  return `${date.getFullYear ()}-${date.getMonth () + 1}-${date.getDate ()}`;

};

const getChangelogPath = ( rootPath: string, checkExistence: boolean ): string | undefined => {

  const names = [Config.changelog.path, 'CHANGELOG.md', 'CHANGELOG', 'changelog.md', 'changelog'];
  const paths = names.map ( name => path.join ( rootPath, name ) );

  for ( const path of paths ) {

    const exists = fs.existsSync ( path );

    if ( exists ) return path;

  }

  if ( checkExistence ) return;

  return paths[0];

};

const getChangelogSection = ( rootPath: string, index: number ): string | undefined => {

  const sections = getChangelogSections ( rootPath );
  const section = sections?.[index];

  return section;

};

const getChangelogSections = ( rootPath: string ): string[] | undefined => {

  const changelogPath = getChangelogPath ( rootPath, false );

  if ( !changelogPath ) return;

  const exists = fs.existsSync ( changelogPath );

  if ( !exists ) return;

  const changelogContent = fs.readFileSync ( changelogPath, 'utf8' );

  const versionPrefixRe = /^(#+\s)/m; //FIXME: This assumes versions start with "#", which technically may not always be true, and that a version line is the first header line, which is also not always true
  const versionPrefixMatch = changelogContent.match ( versionPrefixRe );
  const versionPrefix = versionPrefixMatch ? versionPrefixMatch[1] : '### ';

  const sectionRe = new RegExp ( `^${versionPrefix}.*([^]*?)(?=${versionPrefix}|(?![^]))`, 'gm' );
  const sections = [...changelogContent.matchAll ( sectionRe )].map ( match => match[1].trim () );

  return sections;

};

const getFilesForGlobs = ( rootPath: string, globs: string[], expected: number = -1, maxAttempts: number = 1 ): Promise<string[]> => {

  const junkRe = /([\\/])(?:__MACOSX|\._[^\\/]*|\.AppleDouble|Desktop\.ini|\.#[^\\/]*|\.DS_Store|ehthumbs\.db|Icon\r|\.LSOverride|\.git|node_modules|\.Spotlight-V100[^\\/]*|Thumbs\.db|\.Trashes|[^\\/]+\.\d{4,}|[^\\/]+\.tmp-\d{10}[a-f0-9]{6}|[^\\/]+~|##)(?:\1|$)/i;
  const isJunk = ( filePath: string ) => junkRe.test ( filePath );
  const isMatch = ( filePath: string ) => zeptomatch ( globs, filePath );

  return new Promise ( async ( resolve, reject ) => {

    while ( true ) {

      const {files} = await readdir ( rootPath, { ignore: isJunk } );
      const filesForGlobs = files.filter ( isMatch );
      const isExpected = ( expected === -1 || filesForGlobs.length === expected );

      if ( isExpected ) return resolve ( filesForGlobs );

      maxAttempts -= 1;

      if ( maxAttempts <= 0 ) return reject ( new Error ( `Expected to find ${expected} files, but found ${filesForGlobs.length}` ) );

      await delay ( 1000 ); //TODO: Maybe this should be configurable

    }

  });

};

const getPackage = (): Package | undefined => {

  const result = findUp ( 'package.json' )?.content;

  if ( !isObject ( result ) ) return;

  if ( !( 'name' in result ) || !isString ( result.name ) ) return;

  if ( !( 'version' in result ) || !isString ( result.version ) ) return;

  const {name, version} = result;

  return {name, version};

};

const getPackagePath = (): string | undefined => {

  return findUp ( 'package.json' )?.path;

};

const getPackageVersionAtCommit = async ( commit: string ): Promise<string | undefined> => {

  try {

    const content = await shell ( `git show ${commit}:package.json` );
    const pkg = JSON.parse ( content );

    if ( !isObject ( pkg ) ) return;

    if ( !( 'version' in pkg ) || !isString ( pkg.version ) ) return;

    return pkg.version;

  } catch {

    return;

  }

};

const getPackageVersionsAtCommits = async ( commits: string[] ): Promise<(string | undefined)[]> => {

  return Promise.all ( commits.map ( getPackageVersionAtCommit ) );

};

const getRepositoryPath = (): string | undefined => {

  const packagePath = getPackagePath ();

  if ( !packagePath ) return;

  const repoPath = path.dirname ( packagePath );
  const gitPath = path.join ( repoPath, '.git' );

  if ( !fs.existsSync ( gitPath ) ) return;

  return repoPath;

};

const getRepositoryCommits = async ( withFile?: string ): Promise<Commit[]> => { // From oldest to newest

  const log = await shell ( 'git', ['log', '-n', `${100_000}`, `--pretty=format:%aE^^^^%aN^^^^%aD^^^^%H^^^^%s`, ...( withFile ? ['--', withFile] : [] ) ]);
  const rows = log.split ( /\r\n?|\n/g ).filter ( Boolean ).map ( row => row.split ( '^^^^' ) );
  const commits = rows.map ( ([ author_email, author_name, date, hash, message ]) => ({ author_email, author_name, date, hash, message }) ).reverse ();

  return commits;

};

const getRepositoryCommitsGroups = async (): Promise<CommitsGroup[]> => { // From oldest to newest

  const commits = await getRepositoryCommits ();
  const commitsWithPackage = await getRepositoryCommits ( 'package.json' );
  const commitsWithPackageVersions = await getPackageVersionsAtCommits ( commitsWithPackage.map ( commit => commit.hash ) );
  const versions: Partial<Record<string, string>> = {};
  const groups: CommitsGroup[] = [];

  for ( let i = 0, l = commitsWithPackage.length; i < l; i++ ) {

    versions[commitsWithPackage[i].hash] = commitsWithPackageVersions[i];

  }

  let versionPrev = '';
  let versionPrevIndex = -1;

  for ( let i = 0, l = commits.length; i < l; i++ ) {

    const version = versions[commits[i].hash] || versionPrev;

    if ( !version ) continue;

    if ( version !== versionPrev ) { // Terminated group

      const versionStart = versionPrevIndex + 1;
      const versionEnd = i;

      groups.push ({
        version,
        versionDate: new Date ( commits[i].date ),
        commits: commits.slice ( versionStart, versionEnd ).reverse () // From newest to oldest
      });

      versionPrev = version;
      versionPrevIndex = versionEnd;

    } else if ( i === l - 1 ) { // Unterminated group

      groups.push ({
        version: '',
        versionDate: undefined,
        commits: commits.slice ( versionPrevIndex + 1 )
      });

    }

  }

  return groups;

};

const getRepositoryCommitsPending = async (): Promise<Commit[]> => {

  const groups = await getRepositoryCommitsGroups ();
  const group = last ( groups );

  if ( !group || group.versionDate || !group.commits.length ) return [];

  return group.commits;

};

const getTokensForCommit = ( commit: Commit ): TokensCommit => {

  const message = commit.message;
  const date = formatDate ( new Date ( commit.date ), 'YYYY-MM-DD' );
  const hash = commit.hash;
  const hash4 = commit.hash.slice ( 0, 4 );
  const hash7 = commit.hash.slice ( 0, 7 );
  const hash8 = commit.hash.slice ( 0, 8 );
  const author_name = commit.author_name;
  const author_email = commit.author_email;

  return {message, date, hash, hash4, hash7, hash8, author_name, author_email};

};

const getTokensForVersion = ( version: string, date: Date = new Date () ): TokensVersion => {

  const version_date = formatDate ( date, 'YYYY-MM-DD' );

  return {version, version_date};

};

const isError = ( value: unknown ): value is Error => {

  return value instanceof Error;

};

const isObject = ( value: unknown ): value is object => {

  return typeof value === 'object' && value !== null;

};

const isString = ( value: unknown ): value is string => {

  return typeof value === 'string';

};

const isUndefined = ( value: unknown ): value is undefined => {

  return typeof value === 'undefined';

};

const isVersionIncrement = ( version: string ): version is 'major' | 'minor' | 'patch' => {

  return ( version === 'major' || version === 'minor' || version === 'patch' );

};

const last = <T> ( values: T[] ): T | undefined => {

  return values[values.length - 1];

};

const log = ( message: unknown ): void => {

  console.log ();
  console.log ( message );

};

const semverCoerce = ( version: string ): string | undefined => {

  const semver = semverParse ( version );

  if ( !semver ) return;

  return `${semver.major}.${semver.minor}.${semver.patch}${semver.suffix}`;

};

const semverInc = ( version: string, increment: 'major' | 'minor' | 'patch' ): string | undefined => {

  const semver = semverParse ( version );

  if ( !semver ) return;

  semver.suffix = '';

  if ( increment === 'major' ) {

    semver.major += 1;
    semver.minor = 0;
    semver.patch = 0;

  } else if ( increment === 'minor' ) {

    semver.minor += 1;
    semver.patch = 0;

  } else if ( increment === 'patch' ) {

    semver.patch += 1;

  }

  return `${semver.major}.${semver.minor}.${semver.patch}${semver.suffix}`;

};

const semverParse = ( version: string ): { major: number, minor: number, patch: number, suffix: string } | undefined => {

  const re = /(\d+)(?:\.(\d+))?(?:\.(\d+))?(-[a-z]+(?:\.\d+))?/;
  const match = version.match ( re );

  if ( !match ) return;

  const major = Number ( match[1] );
  const minor = Number ( match[2] || 0 );
  const patch = Number ( match[3] || 0 );
  const suffix = match[4] || '';

  return { major, minor, patch, suffix };

};

const shell = async ( command: string, args: string[] = [], options: SpawnOptions = {} ): Promise<string> => {

  return new Promise ( ( resolve, reject ) => {

    const shell = !args.length;
    const process = spawn ( command, args, { ...options, shell } );
    const stderrChunks: Buffer[] = [];
    const stdoutChunks: Buffer[] = [];

    process.stderr?.on ( 'data', chunk => {
      stderrChunks.push ( chunk );
    });

    process.stdout?.on ( 'data', chunk => {
      stdoutChunks.push ( chunk );
    });

    process.on ( 'exit', () => {
      const stderr = Buffer.concat ( stderrChunks ).toString ();
      if ( stderr ) return reject ( stderr );
      const stdout = Buffer.concat ( stdoutChunks ).toString ();
      return resolve ( stdout );
    });

  });

};

/* EXPORT */

export {attempt, castError, exit, format, formatDate, getChangelogPath, getChangelogSection, getChangelogSections, getFilesForGlobs, getPackage, getPackagePath, getPackageVersionAtCommit, getRepositoryPath, getRepositoryCommits, getRepositoryCommitsGroups, getRepositoryCommitsPending, getTokensForCommit, getTokensForVersion, isError, isObject, isString, isUndefined, isVersionIncrement, last, log, semverCoerce, semverInc, semverParse, shell};
