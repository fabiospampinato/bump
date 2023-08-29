### Version 3.2.0
- Added a "--force" option, for disabling confirmation props

### Version 3.1.0
- Added support for customizing the release title on github

### Version 3.0.1
- Removed semver dependency

### Version 3.0.0
- Rewritten, deleted almost all third-party dependencies, more opinionated, simpler, faster

### Version 2.1.2
- Lowercased readme file
- Lowercased changelog file
- Lowercased license file
- Updated Caporal dependency definition, for compatibility with Yarn and pnpm

### Version 2.1.1
- Ensuring the right version of @octokit/rest is used
- Fixed a bug where duplicate headings for the same version were generated

### Version 2.1.0
- Added a "changelog.ask" configuration option controlling whether the user is asked if they want a changelog created

### Version 2.0.1
- Update .github/FUNDING.yml
- Deleted repo-level github funding.yml
- Trimmed down dependencies tree

### Version 2.0.0
- Release: uploading files in parallel, improving bandwidth utilization
  - In a benchmark I did this lowered the time required to upload all files by ~30%
- Release: added a `release.github.filesNr` setting, if set bump will wait and watch the file system until all expected files are found
  - This enables bump to be run in parallel with your build script, bump will upload files as soon as they are available
  - This optimization therefore potentially makes the time required to upload assets 0, compared to the default approach
- Changed glob engine, replaced [globby](https://github.com/sindresorhus/globby) with [picomatch](https://github.com/micromatch/picomatch)
  - You might need to update your globs accordingly

### Version 1.2.2
- Ensuring there are no conflicts when updating the same files multiple times
- Improved version detection

### Version 1.2.1
- Updated moment

### Version 1.2.0
- Added support for releasing to an arbitrary GitHub repository

### Version 1.1.2
- Properly importing types

### Version 1.1.1
- Fixed a typo

### Version 1.1.0
- Added support for the `GITHUB_TOKEN` environment variable

### Version 1.0.6
- Ensuring pre/post-bump scripts are only run once

### Version 1.0.5
- Fixed a regression that caused scripts to be disabled by default

### Version 1.0.4
- Changelog: improved merge commit detection
- Ensuring versions with an arbitrary number of commits are supported

### Version 1.0.3
- Added a `—no-scripts` option
- Making the first option “no” rather than “yes”

### Version 1.0.2
- Files provider: ensuring the version number is properly extracted even when using global regexes
- Readme: mentioning the default regex flags
- Improved no-changes detection
- Changelog: improved initial version detection
- Readme: mentioning disabling the `tag` command with releasing to GitHub

### Version 1.0.1
- Updated package description
- Less aggressive custom version coersion
- Improved bump commits algorithm
- Disabling the `release` command by default

### Version 1.0.0
- Initial release
