(m, p) => {
  switch (m) {
    case 'GET':
      switch (p) {
        case '/user': {
          return 'GET /user';
        }
        case '/user/comments': {
          return 'GET /user/comments';
        }
        case '/user/avatar': {
          return 'GET /user/avatar';
        }
        case '/status': {
          return 'GET /status';
        }
        case '/very/deeply/nested/route/hello/there': {
          return 'GET /very/deeply/nested/route/hello/there';
        }
      }
      {
        let l = p.length;
        if (l > 1) {
          switch (p.charCodeAt(1)) {
            case 117:
              if (l > 13)
                if (p.startsWith('ser/lookup/', 2)) {
                  switch (p.charCodeAt(13)) {
                    case 117:
                      if (l > 22)
                        if (p.startsWith('sername/', 14)) {
                          if (!p.includes('/', 22)) {
                            let q0 = p.slice(22);
                            return 'GET /user/lookup/username/*';
                          }
                        }
                    case 101:
                      if (l > 19)
                        if (p.startsWith('mail/', 14)) {
                          if (!p.includes('/', 19)) {
                            let q0 = p.slice(19);
                            return 'GET /user/lookup/email/*';
                          }
                        }
                  }
                }
            case 101:
              if (l > 7)
                if (p.startsWith('vent/', 2)) {
                  let j = p.indexOf('/', 7);
                  if (j > 7) {
                    let q0 = p.slice(7, j);
                    if (p.startsWith('comments', j + 1)) {
                      if (l === j + 9) {
                        return 'GET /event/*/comments';
                      }
                    }
                  } else if (j === -1) {
                    let q0 = p.slice(7);
                    return 'GET /event/*';
                  }
                }
            case 109:
              if (l > 5)
                if (p.startsWith('ap/', 2)) {
                  let j = p.indexOf('/', 5);
                  if (j > 5) {
                    let q0 = p.slice(5, j);
                    if (p.startsWith('events', j + 1)) {
                      if (l === j + 7) {
                        return 'GET /map/*/events';
                      }
                    }
                  }
                }
            case 115:
              if (l > 8)
                if (p.startsWith('tatic/', 2)) {
                  let q0 = p.slice(8);
                  return 'GET /static/**';
                }
          }
        }
      }
    case 'POST': {
      let l = p.length;
      if (l > 7)
        if (p.startsWith('event/', 1)) {
          let j = p.indexOf('/', 7);
          if (j > 7) {
            let q0 = p.slice(7, j);
            if (p.startsWith('comment', j + 1)) {
              if (l === j + 8) {
                return 'POST /event/*/comment';
              }
            }
          }
        }
    }
  }
  return '';
};
