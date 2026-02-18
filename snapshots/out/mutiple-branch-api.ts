export default (p: string, method: string) => {
  if (method === 'GET') {
    let l = p.length;
    if (l > 6)
      if (p.startsWith('user/', 1)) {
        let j = p.indexOf('/', 6);
        if (j > 6) {
          let q0 = p.slice(6, j);
          if (l > j + 1) {
            switch (p.charCodeAt(j + 1)) {
              case 100:
                if (p.startsWith('ashboard', j + 2)) {
                  if (l === j + 10) {
                    return 0;
                  }
                }
              case 97:
                if (l > j + 4)
                  if (p.startsWith('cc', j + 2)) {
                    switch (p.charCodeAt(j + 4)) {
                      case 111:
                        if (p.startsWith('unt', j + 5)) {
                          if (l === j + 8) {
                            return 1;
                          }
                        }
                      case 101:
                        if (p.startsWith('ss', j + 5)) {
                          if (l === j + 7) {
                            return 2;
                          }
                        }
                    }
                  }
            }
          }
        }
      }
  }
};
