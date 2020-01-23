
/* TYPES */

type Bump = {
  commits: Commit[]
  version: string
};

type Commit = {
  author_email: string,
  author_name: string,
  date: string,
  hash: string,
  message: string,
  isBump?: boolean
};

type Options = {
  version?: boolean,
  changelog?: boolean,
  commit?: boolean,
  tag?: boolean,
  release?: boolean
};

type UploaderOptions<UploadResult, CancelResult> = {
  globs: string[],
  filesNr: number,
  upload: ( filePath: string ) => Promise<UploadResult>,
  cancel: ( filePath: string, asset: UploadResult ) => Promise<CancelResult>
};

/* EXPORT */

export {Bump, Commit, Options, UploaderOptions};
