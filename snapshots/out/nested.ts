const d: (path: string, method: string) => number = (p, m) => {
  if (m === 'GET') {
    if (p === '/user') {
      return 0;
    } else {
    }
    let l = p.length;
    if (l > 6)
      if (p.startsWith('user/', 1)) {
        let j = p.indexOf('/', 6);
        if (j > 6) {
          let q0 = p.slice(6, j);
          if (p.startsWith('dashboard', j + 1)) {
            if (l === j + 10) {
              return 1;
            }
            if (p.startsWith('/edit', j + 10)) {
              if (l === j + 15) {
                return 2;
              }
            }
          }
        }
      }
  } else {
  }
  return -1;
};
export default d;
