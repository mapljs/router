export default (p: string, method: string) => {
  if (method === 'GET') {
    let l = p.length;
    if (l > 6 && p.startsWith('user/', 1)) {
      let j = p.indexOf('/', 6);
      if (j > 6) {
        let q0 = p.slice(6, j);
        if (p.startsWith('acc', j + 1)) {
          if (p.startsWith('ess', j + 4)) {
            if (l === j + 7) {
              return 2;
            }
          } else if (p.startsWith('ount', j + 4)) {
            if (l === j + 8) {
              return 1;
            }
          }
        } else if (p.startsWith('dashboard', j + 1)) {
          if (l === j + 10) {
            return 0;
          }
        }
      }
    }
  }
};
