export default (p: string, method: string) => {
  if (method === 'GET') {
    if (p === '/user') {
      return 2;
    }
    let l = p.length;
    if (l > 6)
      if (p.startsWith('user/', 1)) {
        let j = p.indexOf('/', 6);
        if (j === -1) {
          let q0 = p.slice(6);
          return 1;
        } else if (j > 6) {
          let q0 = p.slice(6, j);
          if (p.startsWith('dashboard', j + 1)) {
            if (l === j + 10) {
              return 0;
            }
            if (p.startsWith('/edit', j + 10)) {
              if (l === j + 15) {
                return 3;
              }
            }
          }
        }
      }
  }
};
