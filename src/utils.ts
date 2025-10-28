export const countParams = (path: string): number => {
  let cnt = path.endsWith('**') ? 2 : 0;
  for (
    let i = path.length - cnt;
    (i = path.lastIndexOf('*', i - 1)) !== -1;
    cnt++
  );
  return cnt;
};

// Cache args
declare const _: unique symbol;
export type ArgsCache = string[] & { [_]: '' };

export const paramsCache = (paramCnt: number): ArgsCache => {
  const arr: ArgsCache = ['', constants.PARAMS + 1] as any;
  for (let i = 2; i <= paramCnt; i++)
    arr.push(arr[i - 1] + ',' + constants.PARAMS + i);
  return arr;
};

export const addArg = (name: string, cache: ArgsCache): ArgsCache => {
  const arr: ArgsCache = [cache[0] === '' ? name : cache[0] + ',' + name] as any;
  for (let i = 1; i < cache.length; i++) arr.push(cache[i] + ',' + name);
  return arr;
};
