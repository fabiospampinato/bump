
/* IMPORT */

import Commands from '~/commands';
import Config from '~/config';
import type {Options} from '~/types';

/* MAIN */

const bump = async ( { version, changelog, commit, tag, release }: Options = { version: Config.version.enabled, changelog: Config.changelog.enabled, commit: Config.commit.enabled, tag: Config.tag.enabled, release: Config.release.enabled } ): Promise<void> => {

  if ( version ) await Commands.version ();

  if ( changelog ) await Commands.changelog ();

  if ( commit ) await Commands.commit ();

  if ( tag ) await Commands.tag ();

  if ( release ) await Commands.release ();

};

/* EXPORT */

export default bump;
