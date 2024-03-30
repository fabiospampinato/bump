# Bump

<p align="center">
  <img src="resources/demo/usage.gif" width="1000" alt="Usage">
</p>

Bump updates the project's version, updates/creates the changelog, makes the bump commit, tags the bump commit and makes the release to GitHub. Opinionated but configurable.

This tool requires a top-level `package.json` file to work, and assumes you are using `git`.

## Features

Bump is here to save you time. These are all its commands, which you can also call manually individually:

- **version**: It can update your project's version, either automatically with an increment (e.g. `minor`) or manually (e.g. `v1.2.3`).
- **changelog**: It can update the changelog with the latest changes. If you don't have a changelog already it can generate one for you which includes logs about all previous versions too. It can also wait for you to review the updated changelog, so that you can tweak it before making a commit.
- **commit**: It can make the bump commit.
- **tag**: It can tag the bump commit.
- **release**: It can make a release to GitHub, including using the relevant section of the changelog as its description and uploading files.

Some other notable features:

- **Configurable**: Every string and what commands get executed by default can be configured via the settings.
- **Scripts**: Custom scripts can be run before/after any command.

## Install

```sh
npm install -g @fabiospampinato/bump
```

## Usage

Just run `bump` from inside your project. If you want to run only a specific command run `bump <command>` (i.e. `bump changelog`). If you want to learn more about the supported commands or options check out `bump --help` and `bump <command> --help`.

<p align="center">
  <img src="resources/demo/help.png" width="789" alt="Help">
</p>

## Settings

Bump comes with the following default settings:

```js
{
  "force": false, // If "true" it will not ask the user for confirmation
  "version": {
    "enabled": true // Bump the version number
  },
  "changelog": {
    "enabled": true, // Enable changelog auto-updates
    "create": false, // Create the changelog file if it doesn't exist
    "review": true, // Open the changelog file after bumping, and wait for it to be reviewed
    "path": "CHANGELOG.md", // Path to the changelog file
    "version": "### Version [version]", // Template for the version line
    "commit": "- [message]", // Template for the commit line
  },
  "commit": {
    "enabled": true, // Commit the changes automatically
    "message": "Bumped version to [version]" // Template for the commit message
  },
  "tag": {
    "enabled": true, // Tag the bump commit
    "name": "v[version]" // Template for the name of the tag
  },
  "release": {
    "enabled": false, // Release to any enabled release providers
    "github": {
      "enabled": false, // Make a GitHub release
      "open": true, // Open the release/draft page
      "draft": true, // Mark it as a draft
      "prerelease": false, // Mark it as a prerelease
      "files": [], // Globs of files to attach to the release
      "filesNr": -1, // Number of files expected to match the globs, for validation purposes
      "title": "v[version]", // Template for the release title
      "token": "", // GitHub personal access token with `public_repo` priviledge
      "owner": "", // GitHub repository owner
      "repo": "" // GitHub repository name
    }
  },
  "scripts": {
    "enabled": true, // Enable pre/post scripts
    "prebump": "", // Script to execute before bumping the version
    "postbump": "", // Script to execute after bumping the version
    "prechangelog": "", // Script to execute before updating the changelog
    "postchangelog": "", // Script to execute after updating the changelog
    "precommit": "", // Script to execute before committing
    "postcommit": "", // Script to execute after committing
    "pretag": "", // Script to execute before tagging
    "posttag": "", // Script to execute after tagging
    "prerelease": "", // Script to execute before releasing
    "postrelease": "" // Script to execute after releasing
  }
}
```

You can override them in multiple ways:

- **Computer-level settings**: Place your computer-level settings inside `~/.bump.json` to override the default ones. You should put auth tokens there.
- **repository-level settings**: Place your repository-level settings at the root of your repository in a file named `bump.json`, these settings also override computer-level settings.
- **Dynamic settings**: You can pass an arbitrary settings object via the `--config` CLI option, these settings have even higher priority.
- **Dynamic scripts**: Scripts can be provided inline with the command also, like `--preversion "do something"`, these have the highest proprity.
- **Environment variables**: the following environment variable is supported too: `BUMP_GITHUB_TOKEN`, if you'd like to provide your token that way.

Check out [cash](https://github.com/kenwheeler/cash)'s [bump.json](https://github.com/kenwheeler/cash/blob/master/bump.json) as an example.

## Enabled commands

When running `bump` without explicitly providing a command all the enabled ones are executed.

If for instance you don't want to tag your bump commits you can disable the related command by setting `tag.enabled = false`.

All commands except `release` are enabled by default, I recommed you to check if everything is correct, review the changelog manually as some commits shouldn't be put into the changelog, and then make the release manually with `bump release`.

## Templates & Tokens

Bump uses templates for generating the strings it needs. Inside those templates you can put tokens, which will be replaced with some value.

A token has the following syntax: `[token]`, and it will be replaced with some value.

The following tokens are available for commits messages, tag names, and changelog headers:

| Token            | Value                                       |
| ---------------- | ------------------------------------------- |
| `[version]`      | Version's number                            |
| `[version_date]` | Version's date                              |

The following tokens are available for changelog commits:

| Token            | Value                                       |
| ---------------- | ------------------------------------------- |
| `[message]`      | Commit's message                            |
| `[date]`         | Commit's date                               |
| `[hash]`         | Commit's hash                               |
| `[hash4]`        | Commit's hash cropped to first 4 characters |
| `[hash7]`        | Commit's hash cropped to first 7 characters |
| `[hash8]`        | Commit's hash cropped to first 8 characters |
| `[author_name]`  | Author's name                               |
| `[author_email]` | Author's email                              |

## Hints

- **Commits messages**: Spend some extra seconds to write descriptive commits messages, with no extra effort you'll be improving your changelogs as well. If you're already doing this, just enjoy the extra free time!
- **Changelogs**: Changelogs are cool, if your existing project doesn't have one simply run `bump changelog` to generate it.
- **Scripts**: Scripts can be used for building/testing/deployments/etc. For example: a `preversion` script could be used for running tests, a `postversion` script could be used for compiling your project for production, a `postcommit` script could be used for pushing the commit to origin.

## License

MIT © Fabio Spampinato
