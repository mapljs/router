const d: (path: string, method: string) => number = (p, m) => {
  if (m === 'POST') {
    if (p === '/auth/register') {
      return 0;
    } else if (p === '/auth/login') {
      return 1;
    } else if (p === '/auth/logout') {
      return 2;
    } else if (p === '/auth/refresh') {
      return 3;
    } else if (p === '/auth/password/forgot') {
      return 4;
    } else if (p === '/auth/password/reset') {
      return 5;
    } else if (p === '/auth/sso') {
      return 6;
    } else if (p === '/user') {
      return 8;
    } else if (p === '/user/me') {
      return 17;
    } else if (p === '/user/notifications/read-all') {
      return 23;
    } else if (p === '/org') {
      return 25;
    } else if (p === '/files/upload') {
      return 92;
    } else if (p === '/search/filters') {
      return 97;
    } else if (p === '/tags') {
      return 101;
    } else if (p === '/admin/impersonate') {
      return 112;
    } else if (p === '/admin/exports') {
      return 113;
    } else {
    }
    let l = p.length;
    switch (p.charCodeAt(1)) {
      case 117:
        if (l > 6)
          if (p.startsWith('ser/', 2)) {
            if (l > 20)
              if (p.startsWith('notifications/', 6)) {
                let j = p.indexOf('/', 20);
                if (j > 20) {
                  let q0 = p.slice(20, j);
                  if (p.startsWith('read', j + 1)) {
                    if (l === j + 5) {
                      return 24;
                    }
                  }
                }
              }
            let j = p.indexOf('/', 6);
            if (j > 6) {
              let q0 = p.slice(6, j);
              if (p.startsWith('invites', j + 1)) {
                if (l === j + 8) {
                  return 12;
                }
                if (l > j + 9)
                  if (p.charCodeAt(j + 8) === 47) {
                    let i = j + 9;
                    j = p.indexOf('/', i);
                    if (j > i) {
                      if (l > j + 1) {
                        let q1 = p.slice(i, j);
                        switch (p.charCodeAt(j + 1)) {
                          case 97:
                            if (p.startsWith('ccept', j + 2)) {
                              if (l === j + 7) {
                                return 14;
                              }
                            }
                          case 114:
                            if (p.startsWith('esend', j + 2)) {
                              if (l === j + 7) {
                                return 15;
                              }
                            }
                        }
                      }
                    }
                  }
              }
            } else if (j === -1) {
              let q0 = p.slice(6);
              return 10;
            }
          }
      case 111:
        if (l > 5)
          if (p.startsWith('rg/', 2)) {
            let j = p.indexOf('/', 5);
            if (j > 5) {
              if (l > j + 1) {
                let q0 = p.slice(5, j);
                switch (p.charCodeAt(j + 1)) {
                  case 109:
                    if (p.startsWith('embers', j + 2)) {
                      if (l === j + 8) {
                        return 30;
                      }
                      if (l > j + 9)
                        if (p.charCodeAt(j + 8) === 47) {
                          if (!p.includes('/', j + 9)) {
                            let q1 = p.slice(j + 9);
                            return 31;
                          }
                        }
                    }
                  case 114:
                    if (p.startsWith('oles', j + 2)) {
                      if (l === j + 6) {
                        return 33;
                      }
                      if (l > j + 7)
                        if (p.charCodeAt(j + 6) === 47) {
                          if (!p.includes('/', j + 7)) {
                            let q1 = p.slice(j + 7);
                            return 34;
                          }
                        }
                    }
                  case 100:
                    if (p.startsWith('omains', j + 2)) {
                      if (l === j + 8) {
                        return 36;
                      }
                      if (l > j + 9)
                        if (p.charCodeAt(j + 8) === 47) {
                          if (!p.includes('/', j + 9)) {
                            let q1 = p.slice(j + 9);
                            return 37;
                          }
                        }
                    }
                  case 112:
                    if (p.startsWith('rojects', j + 2)) {
                      if (l === j + 9) {
                        return 38;
                      }
                      if (l > j + 10)
                        if (p.charCodeAt(j + 9) === 47) {
                          let i = j + 10;
                          j = p.indexOf('/', i);
                          if (j > i) {
                            if (l > j + 1) {
                              let q1 = p.slice(i, j);
                              switch (p.charCodeAt(j + 1)) {
                                case 109:
                                  if (p.startsWith('embers', j + 2)) {
                                    if (l === j + 8) {
                                      return 43;
                                    }
                                  }
                                case 116:
                                  if (p.startsWith('asks', j + 2)) {
                                    if (l === j + 6) {
                                      return 46;
                                    }
                                    if (l > j + 7)
                                      if (p.charCodeAt(j + 6) === 47) {
                                        switch (p.charCodeAt(j + 7)) {
                                          case 116:
                                            if (l > j + 8) {
                                              switch (p.charCodeAt(j + 8)) {
                                                case 105:
                                                  if (
                                                    p.startsWith(
                                                      'me-entries',
                                                      j + 9,
                                                    )
                                                  ) {
                                                    if (l === j + 19) {
                                                      return 48;
                                                    }
                                                    if (l > j + 20)
                                                      if (
                                                        p.charCodeAt(j + 19) ===
                                                        47
                                                      ) {
                                                        let i = j + 20;
                                                        j = p.indexOf('/', i);
                                                        if (j > i) {
                                                          let q2 = p.slice(
                                                            i,
                                                            j,
                                                          );
                                                          if (
                                                            p.startsWith(
                                                              'stop',
                                                              j + 1,
                                                            )
                                                          ) {
                                                            if (l === j + 5) {
                                                              return 49;
                                                            }
                                                          }
                                                        }
                                                      }
                                                  }
                                                case 97:
                                                  if (
                                                    p.startsWith('gs', j + 9)
                                                  ) {
                                                    if (l === j + 11) {
                                                      return 52;
                                                    }
                                                  }
                                              }
                                            }
                                          case 97:
                                            if (
                                              p.startsWith('ttachments', j + 8)
                                            ) {
                                              if (l === j + 18) {
                                                return 51;
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
                  case 116:
                    if (l > j + 7)
                      if (p.startsWith('asks/', j + 2)) {
                        let i = j + 7;
                        j = p.indexOf('/', i);
                        if (j > i) {
                          if (l > j + 1) {
                            let q1 = p.slice(i, j);
                            switch (p.charCodeAt(j + 1)) {
                              case 97:
                                if (l > j + 2) {
                                  switch (p.charCodeAt(j + 2)) {
                                    case 115:
                                      if (p.startsWith('sign', j + 3)) {
                                        if (l === j + 7) {
                                          return 60;
                                        }
                                      }
                                    case 116:
                                      if (p.startsWith('tachments', j + 3)) {
                                        if (l === j + 12) {
                                          return 68;
                                        }
                                      }
                                  }
                                }
                              case 115:
                                if (p.startsWith('tatus', j + 2)) {
                                  if (l === j + 7) {
                                    return 61;
                                  }
                                }
                              case 99:
                                if (p.startsWith('omments', j + 2)) {
                                  if (l === j + 9) {
                                    return 63;
                                  }
                                }
                              case 116:
                                if (l > j + 2) {
                                  switch (p.charCodeAt(j + 2)) {
                                    case 105:
                                      if (p.startsWith('me-entries', j + 3)) {
                                        if (l === j + 13) {
                                          return 65;
                                        }
                                        if (l > j + 14)
                                          if (p.charCodeAt(j + 13) === 47) {
                                            let i = j + 14;
                                            j = p.indexOf('/', i);
                                            if (j > i) {
                                              let q2 = p.slice(i, j);
                                              if (p.startsWith('stop', j + 1)) {
                                                if (l === j + 5) {
                                                  return 66;
                                                }
                                              }
                                            }
                                          }
                                      }
                                    case 97:
                                      if (p.startsWith('gs', j + 3)) {
                                        if (l === j + 5) {
                                          return 69;
                                        }
                                      }
                                  }
                                }
                            }
                          }
                        }
                      }
                  case 98:
                    if (l > j + 9)
                      if (p.startsWith('illing/', j + 2)) {
                        switch (p.charCodeAt(j + 9)) {
                          case 115:
                            if (p.startsWith('ubscription', j + 10)) {
                              if (l === j + 21) {
                                return 75;
                              }
                              if (p.startsWith('/cancel', j + 21)) {
                                if (l === j + 28) {
                                  return 76;
                                }
                              }
                            }
                          case 105:
                            if (l > j + 18)
                              if (p.startsWith('nvoices/', j + 10)) {
                                if (!p.includes('/', j + 18)) {
                                  let q1 = p.slice(j + 18);
                                  return 79;
                                }
                              }
                          case 112:
                            if (p.startsWith('ayment-methods', j + 10)) {
                              if (l === j + 24) {
                                return 81;
                              }
                            }
                        }
                      }
                  case 97:
                    if (p.startsWith('pi-keys', j + 2)) {
                      if (l === j + 9) {
                        return 84;
                      }
                    }
                  case 119:
                    if (p.startsWith('ebhooks', j + 2)) {
                      if (l === j + 9) {
                        return 87;
                      }
                    }
                }
              }
            }
          }
      case 97:
        if (l > 15)
          if (p.startsWith('dmin/exports/', 2)) {
            let j = p.indexOf('/', 15);
            if (j > 15) {
              let q0 = p.slice(15, j);
              if (p.startsWith('cancel', j + 1)) {
                if (l === j + 7) {
                  return 115;
                }
              }
            }
          }
    }
  } else if (m === 'GET') {
    if (p === '/auth/sso/providers') {
      return 7;
    } else if (p === '/user/me') {
      return 16;
    } else if (p === '/user/me/preferences') {
      return 18;
    } else if (p === '/user/me/sessions') {
      return 20;
    } else if (p === '/user/notifications') {
      return 22;
    } else if (p === '/search') {
      return 95;
    } else if (p === '/search/filters') {
      return 96;
    } else if (p === '/tags') {
      return 100;
    } else if (p === '/status') {
      return 104;
    } else if (p === '/admin/reports/time') {
      return 105;
    } else if (p === '/admin/users') {
      return 108;
    } else if (p === '/admin/projects') {
      return 109;
    } else if (p === '/admin/audit-logs') {
      return 110;
    } else if (p === '/admin/stats') {
      return 111;
    } else {
    }
    let l = p.length;
    switch (p.charCodeAt(1)) {
      case 117:
        if (l > 6)
          if (p.startsWith('ser/', 2)) {
            let j = p.indexOf('/', 6);
            if (j > 6) {
              if (l > j + 1) {
                let q0 = p.slice(6, j);
                switch (p.charCodeAt(j + 1)) {
                  case 110:
                    if (p.startsWith('otifications', j + 2)) {
                      if (l === j + 14) {
                        return 11;
                      }
                    }
                  case 105:
                    if (l > j + 9)
                      if (p.startsWith('nvites/', j + 2)) {
                        if (!p.includes('/', j + 9)) {
                          let q1 = p.slice(j + 9);
                          return 13;
                        }
                      }
                }
              }
            } else if (j === -1) {
              let q0 = p.slice(6);
              return 9;
            }
          }
      case 111:
        if (l > 5)
          if (p.startsWith('rg/', 2)) {
            let j = p.indexOf('/', 5);
            if (j > 5) {
              if (l > j + 1) {
                let q0 = p.slice(5, j);
                switch (p.charCodeAt(j + 1)) {
                  case 109:
                    if (p.startsWith('embers', j + 2)) {
                      if (l === j + 8) {
                        return 29;
                      }
                    }
                  case 114:
                    if (p.startsWith('oles', j + 2)) {
                      if (l === j + 6) {
                        return 32;
                      }
                    }
                  case 100:
                    if (p.startsWith('omains', j + 2)) {
                      if (l === j + 8) {
                        return 35;
                      }
                    }
                  case 112:
                    if (l > j + 10)
                      if (p.startsWith('rojects/', j + 2)) {
                        let i = j + 10;
                        j = p.indexOf('/', i);
                        if (j > i) {
                          if (l > j + 1) {
                            let q1 = p.slice(i, j);
                            switch (p.charCodeAt(j + 1)) {
                              case 109:
                                if (p.startsWith('embers', j + 2)) {
                                  if (l === j + 8) {
                                    return 42;
                                  }
                                }
                              case 97:
                                if (p.startsWith('ctivity', j + 2)) {
                                  if (l === j + 9) {
                                    return 44;
                                  }
                                }
                              case 116:
                                if (p.startsWith('asks', j + 2)) {
                                  if (l === j + 6) {
                                    return 45;
                                  }
                                  if (l > j + 7)
                                    if (p.charCodeAt(j + 6) === 47) {
                                      switch (p.charCodeAt(j + 7)) {
                                        case 116:
                                          if (
                                            p.startsWith('ime-entries', j + 8)
                                          ) {
                                            if (l === j + 19) {
                                              return 47;
                                            }
                                          }
                                        case 97:
                                          if (
                                            p.startsWith('ttachments', j + 8)
                                          ) {
                                            if (l === j + 18) {
                                              return 50;
                                            }
                                          }
                                      }
                                    }
                                }
                            }
                          }
                        } else if (j === -1) {
                          let q1 = p.slice(i);
                          return 39;
                        }
                      }
                  case 116:
                    if (p.startsWith('asks', j + 2)) {
                      if (l === j + 6) {
                        return 56;
                      }
                      if (l > j + 7)
                        if (p.charCodeAt(j + 6) === 47) {
                          let i = j + 7;
                          j = p.indexOf('/', i);
                          if (j > i) {
                            if (l > j + 1) {
                              let q1 = p.slice(i, j);
                              switch (p.charCodeAt(j + 1)) {
                                case 99:
                                  if (p.startsWith('omments', j + 2)) {
                                    if (l === j + 9) {
                                      return 62;
                                    }
                                  }
                                case 116:
                                  if (p.startsWith('ime-entries', j + 2)) {
                                    if (l === j + 13) {
                                      return 64;
                                    }
                                  }
                                case 97:
                                  if (p.startsWith('ttachments', j + 2)) {
                                    if (l === j + 12) {
                                      return 67;
                                    }
                                  }
                              }
                            }
                          } else if (j === -1) {
                            let q1 = p.slice(i);
                            return 57;
                          }
                        }
                    }
                  case 98:
                    if (l > j + 9)
                      if (p.startsWith('illing/', j + 2)) {
                        switch (p.charCodeAt(j + 9)) {
                          case 112:
                            if (l > j + 10) {
                              switch (p.charCodeAt(j + 10)) {
                                case 108:
                                  if (p.startsWith('ans', j + 11)) {
                                    if (l === j + 14) {
                                      return 73;
                                    }
                                  }
                                case 97:
                                  if (p.startsWith('yment-methods', j + 11)) {
                                    if (l === j + 24) {
                                      return 80;
                                    }
                                  }
                              }
                            }
                          case 115:
                            if (p.startsWith('ubscription', j + 10)) {
                              if (l === j + 21) {
                                return 74;
                              }
                            }
                          case 105:
                            if (p.startsWith('nvoices', j + 10)) {
                              if (l === j + 17) {
                                return 77;
                              }
                              if (l > j + 18)
                                if (p.charCodeAt(j + 17) === 47) {
                                  if (!p.includes('/', j + 18)) {
                                    let q1 = p.slice(j + 18);
                                    return 78;
                                  }
                                }
                            }
                        }
                      }
                  case 97:
                    if (p.startsWith('pi-keys', j + 2)) {
                      if (l === j + 9) {
                        return 83;
                      }
                    }
                  case 119:
                    if (p.startsWith('ebhooks', j + 2)) {
                      if (l === j + 9) {
                        return 86;
                      }
                      if (l > j + 10)
                        if (p.charCodeAt(j + 9) === 47) {
                          let i = j + 10;
                          j = p.indexOf('/', i);
                          if (j > i) {
                            let q1 = p.slice(i, j);
                            if (p.startsWith('deliveries', j + 1)) {
                              if (l === j + 11) {
                                return 90;
                              }
                              if (l > j + 12)
                                if (p.charCodeAt(j + 11) === 47) {
                                  if (!p.includes('/', j + 12)) {
                                    let q2 = p.slice(j + 12);
                                    return 91;
                                  }
                                }
                            }
                          }
                        }
                    }
                }
              }
            } else if (j === -1) {
              let q0 = p.slice(5);
              return 26;
            }
          }
      case 102:
        if (l > 7)
          if (p.startsWith('iles/', 2)) {
            if (!p.includes('/', 7)) {
              let q0 = p.slice(7);
              return 93;
            }
          }
      case 97:
        if (l > 7)
          if (p.startsWith('dmin/', 2)) {
            switch (p.charCodeAt(7)) {
              case 114:
                if (l > 15)
                  if (p.startsWith('eports/', 8)) {
                    switch (p.charCodeAt(15)) {
                      case 112:
                        if (l > 24)
                          if (p.startsWith('rojects/', 16)) {
                            let j = p.indexOf('/', 24);
                            if (j > 24) {
                              let q0 = p.slice(24, j);
                              if (p.startsWith('summary', j + 1)) {
                                if (l === j + 8) {
                                  return 106;
                                }
                              }
                            }
                          }
                      case 117:
                        if (l > 21)
                          if (p.startsWith('sers/', 16)) {
                            let j = p.indexOf('/', 21);
                            if (j > 21) {
                              let q0 = p.slice(21, j);
                              if (p.startsWith('activity', j + 1)) {
                                if (l === j + 9) {
                                  return 107;
                                }
                              }
                            }
                          }
                    }
                  }
              case 101:
                if (l > 15)
                  if (p.startsWith('xports/', 8)) {
                    if (!p.includes('/', 15)) {
                      let q0 = p.slice(15);
                      return 114;
                    }
                  }
            }
          }
    }
  } else if (m === 'PATCH') {
    if (p === '/user/me/preferences') {
      return 19;
    } else {
    }
    let l = p.length;
    switch (p.charCodeAt(1)) {
      case 111:
        if (l > 5)
          if (p.startsWith('rg/', 2)) {
            let j = p.indexOf('/', 5);
            if (j > 5) {
              if (l > j + 1) {
                let q0 = p.slice(5, j);
                switch (p.charCodeAt(j + 1)) {
                  case 112:
                    if (l > j + 10)
                      if (p.startsWith('rojects/', j + 2)) {
                        if (!p.includes('/', j + 10)) {
                          let q1 = p.slice(j + 10);
                          return 40;
                        }
                      }
                  case 116:
                    if (l > j + 7)
                      if (p.startsWith('asks/', j + 2)) {
                        if (!p.includes('/', j + 7)) {
                          let q1 = p.slice(j + 7);
                          return 58;
                        }
                      }
                  case 119:
                    if (l > j + 10)
                      if (p.startsWith('ebhooks/', j + 2)) {
                        if (!p.includes('/', j + 10)) {
                          let q1 = p.slice(j + 10);
                          return 88;
                        }
                      }
                }
              }
            } else if (j === -1) {
              let q0 = p.slice(5);
              return 27;
            }
          }
      case 115:
        if (l > 16)
          if (p.startsWith('earch/filters/', 2)) {
            if (!p.includes('/', 16)) {
              let q0 = p.slice(16);
              return 98;
            }
          }
      case 116:
        if (l > 6)
          if (p.startsWith('ags/', 2)) {
            if (!p.includes('/', 6)) {
              let q0 = p.slice(6);
              return 102;
            }
          }
    }
  } else if (m === 'DELETE') {
    {
    }
    let l = p.length;
    switch (p.charCodeAt(1)) {
      case 117:
        if (l > 18)
          if (p.startsWith('ser/me/sessions/', 2)) {
            if (!p.includes('/', 18)) {
              let q0 = p.slice(18);
              return 21;
            }
          }
      case 111:
        if (l > 5)
          if (p.startsWith('rg/', 2)) {
            let j = p.indexOf('/', 5);
            if (j > 5) {
              if (l > j + 1) {
                let q0 = p.slice(5, j);
                switch (p.charCodeAt(j + 1)) {
                  case 112:
                    if (l > j + 10)
                      if (p.startsWith('rojects/', j + 2)) {
                        let i = j + 10;
                        j = p.indexOf('/', i);
                        if (j > i) {
                          let q1 = p.slice(i, j);
                          if (l > j + 7)
                            if (p.startsWith('tasks/', j + 1)) {
                              switch (p.charCodeAt(j + 7)) {
                                case 116:
                                  if (p.startsWith('ags', j + 8)) {
                                    if (l === j + 11) {
                                      return 53;
                                    }
                                  }
                                case 99:
                                  if (l > j + 21)
                                    if (p.startsWith('ustom-fields/', j + 8)) {
                                      if (!p.includes('/', j + 21)) {
                                        let q2 = p.slice(j + 21);
                                        return 55;
                                      }
                                    }
                              }
                            }
                        } else if (j === -1) {
                          let q1 = p.slice(i);
                          return 41;
                        }
                      }
                  case 116:
                    if (l > j + 7)
                      if (p.startsWith('asks/', j + 2)) {
                        let i = j + 7;
                        j = p.indexOf('/', i);
                        if (j > i) {
                          if (l > j + 1) {
                            let q1 = p.slice(i, j);
                            switch (p.charCodeAt(j + 1)) {
                              case 116:
                                if (p.startsWith('ags', j + 2)) {
                                  if (l === j + 5) {
                                    return 70;
                                  }
                                }
                              case 99:
                                if (l > j + 15)
                                  if (p.startsWith('ustom-fields/', j + 2)) {
                                    if (!p.includes('/', j + 15)) {
                                      let q2 = p.slice(j + 15);
                                      return 72;
                                    }
                                  }
                            }
                          }
                        } else if (j === -1) {
                          let q1 = p.slice(i);
                          return 59;
                        }
                      }
                  case 98:
                    if (l > j + 25)
                      if (p.startsWith('illing/payment-methods/', j + 2)) {
                        if (!p.includes('/', j + 25)) {
                          let q1 = p.slice(j + 25);
                          return 82;
                        }
                      }
                  case 97:
                    if (l > j + 10)
                      if (p.startsWith('pi-keys/', j + 2)) {
                        if (!p.includes('/', j + 10)) {
                          let q1 = p.slice(j + 10);
                          return 85;
                        }
                      }
                  case 119:
                    if (l > j + 10)
                      if (p.startsWith('ebhooks/', j + 2)) {
                        if (!p.includes('/', j + 10)) {
                          let q1 = p.slice(j + 10);
                          return 89;
                        }
                      }
                }
              }
            } else if (j === -1) {
              let q0 = p.slice(5);
              return 28;
            }
          }
      case 102:
        if (l > 7)
          if (p.startsWith('iles/', 2)) {
            if (!p.includes('/', 7)) {
              let q0 = p.slice(7);
              return 94;
            }
          }
      case 115:
        if (l > 16)
          if (p.startsWith('earch/filters/', 2)) {
            if (!p.includes('/', 16)) {
              let q0 = p.slice(16);
              return 99;
            }
          }
      case 116:
        if (l > 6)
          if (p.startsWith('ags/', 2)) {
            if (!p.includes('/', 6)) {
              let q0 = p.slice(6);
              return 103;
            }
          }
    }
  } else if (m === 'PUT') {
    {
    }
    let l = p.length;
    if (l > 5)
      if (p.startsWith('org/', 1)) {
        let j = p.indexOf('/', 5);
        if (j > 5) {
          if (l > j + 1) {
            let q0 = p.slice(5, j);
            switch (p.charCodeAt(j + 1)) {
              case 112:
                if (l > j + 10)
                  if (p.startsWith('rojects/', j + 2)) {
                    let i = j + 10;
                    j = p.indexOf('/', i);
                    if (j > i) {
                      let q1 = p.slice(i, j);
                      if (l > j + 21)
                        if (p.startsWith('tasks/custom-fields/', j + 1)) {
                          if (!p.includes('/', j + 21)) {
                            let q2 = p.slice(j + 21);
                            return 54;
                          }
                        }
                    }
                  }
              case 116:
                if (l > j + 7)
                  if (p.startsWith('asks/', j + 2)) {
                    let i = j + 7;
                    j = p.indexOf('/', i);
                    if (j > i) {
                      let q1 = p.slice(i, j);
                      if (l > j + 15)
                        if (p.startsWith('custom-fields/', j + 1)) {
                          if (!p.includes('/', j + 15)) {
                            let q2 = p.slice(j + 15);
                            return 71;
                          }
                        }
                    }
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
