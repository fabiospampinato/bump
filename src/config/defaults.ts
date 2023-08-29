
/* IMPORT */

import type {Config} from '../types';

/* MAIN */

const defaults = (): Config => ({
  force: false,
  version: {
    enabled: true
  },
  changelog: {
    enabled: true,
    create: false,
    review: true,
    path: 'CHANGELOG.md',
    version: '### Version [version]',
    commit: '- [message]'
  },
  commit: {
    enabled: true,
    message: 'Bumped version to [version]'
  },
  tag: {
    enabled: true,
    name: 'v[version]'
  },
  release: {
    enabled: false,
    github: {
      enabled: false,
      open: true,
      draft: true,
      prerelease: false,
      files: <string[]> [],
      filesNr: -1,
      title: 'v[version]',
      token: '',
      owner: '',
      repo: ''
    }
  },
  scripts: {
    enabled: true,
    preversion: '',
    prechangelog: '',
    precommit: '',
    pretag: '',
    prerelease: '',
    postversion: '',
    postchangelog: '',
    postcommit: '',
    posttag: '',
    postrelease: ''
  }
});

/* EXPORT */

export default defaults;
