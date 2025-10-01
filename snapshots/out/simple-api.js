export default (m, p) => {
  if (m === 'GET') {
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
    if (l > 1) {
      switch (p.charCodeAt(1)) {
        case 101: {
          if (l > 7)
            if (p.startsWith('vent/', 2)) {
              let j = p.indexOf('/', 7);
              if (j === -1) {
                let q0 = p.slice(7);
                return 5;
              } else if (j > 7) {
                let q0 = p.slice(7, j);
                if (p.startsWith('comments', j + 1)) {
                  if (l === j + 9) {
                    return 6;
                  }
                }
              }
            }
        }
        case 109: {
          if (l > 5)
            if (p.startsWith('ap/', 2)) {
              let j = p.indexOf('/', 5);
              if (j > 5) {
                let q0 = p.slice(5, j);
                if (p.startsWith('events', j + 1)) {
                  if (l === j + 7) {
                    return 7;
                  }
                }
              }
            }
        }
        case 117: {
          if (l > 13)
            if (p.startsWith('ser/lookup/', 2)) {
              switch (p.charCodeAt(13)) {
                case 101: {
                  if (l > 19)
                    if (p.startsWith('mail/', 14)) {
                      if (p.indexOf('/', 19) === -1) {
                        let q0 = p.slice(19);
                        return 4;
                      }
                    }
                }
                case 117: {
                  if (l > 22)
                    if (p.startsWith('sername/', 14)) {
                      if (p.indexOf('/', 22) === -1) {
                        let q0 = p.slice(22);
                        return 3;
                      }
                    }
                }
              }
            }
        }
      }
    }
  } else if (m === 'POST') {
    let l = p.length;
    if (l > 1) {
      if (p.charCodeAt(1) === 101) {
        if (l > 7)
          if (p.startsWith('vent/', 2)) {
            let j = p.indexOf('/', 7);
            if (j > 7) {
              let q0 = p.slice(7, j);
              if (p.startsWith('comment', j + 1)) {
                if (l === j + 8) {
                  return 10;
                }
              }
            }
          }
      }
    }
  }
};
