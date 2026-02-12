export default (p: string, method: string) => {
  if (method === 'GET') {
    if (p === '/user') {
      return 0;
    } else if (p === '/user/comments') {
      return 1;
    } else if (p === '/user/avatar') {
      return 2;
    } else if (p === '/status') {
      return 8;
    } else if (p === '/very/deeply/nested/route/hello/there') {
      return 9;
    }
    let l = p.length;
    if (l > 7 && p.startsWith('event/', 1)) {
      let j = p.indexOf('/', 7);
      if (j === -1) {
        let q0 = p.slice(7);
        return 5;
      } else if (j > 7) {
        let q0 = p.slice(7, j);
        if (l > j + 1) {
          if (p.startsWith('comments', j + 1)) {
            if (l === j + 9) {
              return 6;
            }
          }
        }
      }
    } else if (l > 5 && p.startsWith('map/', 1)) {
      let j = p.indexOf('/', 5);
      if (j > 5) {
        let q0 = p.slice(5, j);
        if (l > j + 1) {
          if (p.startsWith('events', j + 1)) {
            if (l === j + 7) {
              return 7;
            }
          }
        }
      }
    } else if (p.startsWith('user/lookup/', 1)) {
      if (l > 19 && p.startsWith('email/', 13)) {
        if (!p.includes('/', 19)) {
          let q0 = p.slice(19);
          return 4;
        }
      } else if (l > 22 && p.startsWith('username/', 13)) {
        if (!p.includes('/', 22)) {
          let q0 = p.slice(22);
          return 3;
        }
      }
    }
  } else if (method === 'POST') {
    let l = p.length;
    if (l > 7 && p.startsWith('event/', 1)) {
      let j = p.indexOf('/', 7);
      if (j > 7) {
        let q0 = p.slice(7, j);
        if (l > j + 1) {
          if (p.startsWith('comment', j + 1)) {
            if (l === j + 8) {
              return 10;
            }
          }
        }
      }
    }
  }
};
