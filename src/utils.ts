export const countParams = (path: string): number => {
  let cnt = path.endsWith('**') ? 2 : 0;
  for (
    let i = path.length - cnt;
    (i = path.lastIndexOf('*', i - 1)) !== -1;
    cnt++
  );
  return cnt;
};
