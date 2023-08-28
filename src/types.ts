
/* HELPERS */

type DeepPartial<T extends object> = T extends unknown[] ? T : { [Key in keyof T]?: DeepPartial<T[Key]> };

type ScriptName = `pre${Command['name']}` | `post${Command['name']}`;

/* MAIN */

type Command = {
  name: 'version' | 'changelog' | 'commit' | 'tag' | 'release',
  start: string,
  success: string,
  error: string,
  run: ( log: ( message: string ) => void ) => Promise<void> | void
};

type Commit = {
  author_email: string,
  author_name: string,
  date: string,
  hash: string,
  message: string
};

type CommitsGroup = {
  version: string,
  versionDate: Date | undefined,
  commits: Commit[]
};

type Config = {
  version: {
    enabled: boolean
  },
  changelog: {
    enabled: boolean,
    create: boolean,
    review: boolean,
    path: string,
    version: string,
    commit: string
  },
  commit: {
    enabled: boolean,
    message: string
  },
  tag: {
    enabled: boolean,
    name: string
  },
  release: {
    enabled: boolean,
    github: {
      enabled: boolean,
      open: boolean,
      draft: boolean,
      prerelease: boolean,
      files: string[],
      filesNr: number,
      token: string,
      owner: string,
      repo: string
    }
  },
  scripts: {
    enabled: boolean,
    preversion: string,
    prechangelog: string,
    precommit: string,
    pretag: string,
    prerelease: string,
    postversion: string,
    postchangelog: string,
    postcommit: string,
    posttag: string,
    postrelease: string
  }
};

type Package = {
  name: string,
  version: string
};

type TokensCommit = {
  message: string,
  date: string,
  hash: string,
  hash4: string,
  hash7: string,
  hash8: string,
  author_name: string,
  author_email: string
};

type TokensVersion = {
  version: string,
  version_date: string
};

/* EXPORT */

export type {DeepPartial, ScriptName};
export type {Command, Commit, CommitsGroup, Config, Package, TokensCommit, TokensVersion};
