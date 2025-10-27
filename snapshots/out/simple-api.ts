export default (r: Request) => {
  if (r.method === 'GET') {
    let p = r.url,
      s = p.indexOf('/', 12) + 1,
      e = p.indexOf('?', s),
      l = e === -1 ? p.length : e;
    if (l > s + 1) {
      switch (p.charCodeAt(s + 1)) {
        case 101: {
          if (l > s + 7)
            if (p.startsWith('vent/', s + 2)) {
              let j = p.indexOf('/', s + 7);
              if (j === -1) {
                let q0 = p.slice(s + 7);
                return 5;
              } else if (j > s + 7) {
                let q0 = p.slice(s + 7, j);
                if (p.startsWith('comments', j + 1)) {
                  if (l === j + 9) {
                    return 6;
                  }
                }
              }
            }
        }
        case 109: {
          if (l > s + 5)
            if (p.startsWith('ap/', s + 2)) {
              let j = p.indexOf('/', s + 5);
              if (j > s + 5) {
                let q0 = p.slice(s + 5, j);
                if (p.startsWith('events', j + 1)) {
                  if (l === j + 7) {
                    return 7;
                  }
                }
              }
            }
        }
        case 115: {
          if (p.startsWith('tatus', s + 2)) {
            if (l === s + 7) {
              return 8;
            }
          }
        }
        case 117: {
          if (p.startsWith('ser', s + 2)) {
            if (l === s + 5) {
              return 0;
            }
            if (p.charCodeAt(s + 5) === 47) {
              if (l > s + 6) {
                switch (p.charCodeAt(s + 6)) {
                  case 97: {
                    if (p.startsWith('vatar', s + 7)) {
                      if (l === s + 12) {
                        return 2;
                      }
                    }
                  }
                  case 99: {
                    if (p.startsWith('omments', s + 7)) {
                      if (l === s + 14) {
                        return 1;
                      }
                    }
                  }
                  case 108: {
                    if (l > s + 13)
                      if (p.startsWith('ookup/', s + 7)) {
                        switch (p.charCodeAt(s + 13)) {
                          case 101: {
                            if (l > s + 19)
                              if (p.startsWith('mail/', s + 14)) {
                                if (p.indexOf('/', s + 19) === -1) {
                                  let q0 = p.slice(s + 19);
                                  return 4;
                                }
                              }
                          }
                          case 117: {
                            if (l > s + 22)
                              if (p.startsWith('sername/', s + 14)) {
                                if (p.indexOf('/', s + 22) === -1) {
                                  let q0 = p.slice(s + 22);
                                  return 3;
                                }
                              }
                          }
                        }
                      }
                  }
                }
              }
            }
          }
        }
        case 118: {
          if (p.startsWith('ery/deeply/nested/route/hello/there', s + 2)) {
            if (l === s + 37) {
              return 9;
            }
          }
        }
      }
    }
  } else if (r.method === 'POST') {
    let p = r.url,
      s = p.indexOf('/', 12) + 1,
      e = p.indexOf('?', s),
      l = e === -1 ? p.length : e;
    if (l > s + 1) {
      if (p.charCodeAt(s + 1) === 101) {
        if (l > s + 7)
          if (p.startsWith('vent/', s + 2)) {
            let j = p.indexOf('/', s + 7);
            if (j > s + 7) {
              let q0 = p.slice(s + 7, j);
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
