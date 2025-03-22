export type PathTransformResult = [
  params: string[],
  parts: string[],
  flag: 0 | 1 | 2
];

export type PathTransformer = (path: string) => PathTransformResult;

export type InferNormalRoute<T extends string> = T extends `${string}*${infer Next}`
  ? Next extends '*' ? [string] : [...InferNormalRoute<Next>, string]
  : [];

export type InferFSRoute<T extends string> = T extends `${string}[${infer Current}]${infer Rest}`
  ? Current extends `...${string}`
    ? [string]
    : [...InferFSRoute<Rest>, string]
  : [];

export const transformFSRoute: PathTransformer = (path) => {
  let idx = path.indexOf('[', 1);
  if (idx === -1) return [[], [path], 0];

  const params: string[] = [];
  const parts: string[] = [];

  let endIdx = -1;
  do {
    parts.push(path.substring(endIdx + 1, idx));
    // This must not be < 0
    endIdx = path.indexOf(']', idx + 1);

    // ...param
    if (path.charCodeAt(idx + 1) === 46) {
      params.push(path.substring(idx + 4, endIdx));
      return [params, parts, 2];
    }

    params.push(path.substring(idx + 1, endIdx));
    idx = path.indexOf('[', endIdx + 1);
  } while (idx !== -1);

  if (endIdx + 1 !== path.length)
    parts.push(path.slice(endIdx + 1));

  return [params, parts, 1];
};

export type InferRoute<T extends string> = T extends `${string}:${infer Current}`
  ? Current extends `${string}/${infer Rest}`
    ? [...InferRoute<Rest>, string]
    : [string]
  : T extends `${string}*` ? [string] : [];

export const transformRoute: PathTransformer = (path) => {
  let idx = path.indexOf(':', 1);
  if (idx === -1) {
    return path.endsWith('*')
      ? [['*'], [path.slice(0, -1)], 2]
      : [[], [path], 0];
  }

  const params: string[] = [];
  const parts: string[] = [];

  let endIdx = 0;
  do {
    parts.push(path.substring(endIdx, idx));
    // This must not be < 0
    endIdx = path.indexOf('/', idx + 1);

    if (endIdx === -1) {
      params.push(path.slice(idx + 1));
      return [params, parts, 1];
    }

    params.push(path.substring(idx + 1, endIdx));
    idx = path.indexOf(':', endIdx + 1);
  } while (idx !== -1);

  if (path.endsWith('*')) {
    parts.push(path.slice(endIdx, -1));
    params.push('*');
    return [params, parts, 2];
  }

  parts.push(path.slice(endIdx));
  return [params, parts, 1];
};
