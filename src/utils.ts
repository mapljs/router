export const countParams = (path: string): number => {
  let cnt = 0;
  let i = path.lastIndexOf('*');

  while (i > 1) {
    cnt++;
    i = path.lastIndexOf('*', i - 2);
  }

  return i > -1 ? cnt + 1 : cnt;
};
