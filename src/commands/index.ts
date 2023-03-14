
/* IMPORT */

import version from '~/commands/version';
import changelog from '~/commands/changelog';
import commit from '~/commands/commit';
import tag from '~/commands/tag';
import release from '~/commands/release';

/* MAIN */

const Commands = {
  version,
  changelog,
  commit,
  tag,
  release
};

/* EXPORT */

export default Commands;
