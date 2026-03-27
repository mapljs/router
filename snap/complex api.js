(m, p) => {
  switch (m) {
    case 'POST':
      switch (p) {
        case '/auth/register': {
          return 'POST /auth/register';
        }
        case '/auth/login': {
          return 'POST /auth/login';
        }
        case '/auth/logout': {
          return 'POST /auth/logout';
        }
        case '/auth/refresh': {
          return 'POST /auth/refresh';
        }
        case '/auth/password/forgot': {
          return 'POST /auth/password/forgot';
        }
        case '/auth/password/reset': {
          return 'POST /auth/password/reset';
        }
        case '/auth/sso': {
          return 'POST /auth/sso';
        }
        case '/user': {
          return 'POST /user';
        }
        case '/user/me': {
          return 'POST /user/me';
        }
        case '/user/notifications/read-all': {
          return 'POST /user/notifications/read-all';
        }
        case '/org': {
          return 'POST /org';
        }
        case '/files/upload': {
          return 'POST /files/upload';
        }
        case '/search/filters': {
          return 'POST /search/filters';
        }
        case '/tags': {
          return 'POST /tags';
        }
        case '/admin/impersonate': {
          return 'POST /admin/impersonate';
        }
        case '/admin/exports': {
          return 'POST /admin/exports';
        }
      }
      {
        let l = p.length;
        if (l > 1) {
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
                            return 'POST /user/notifications/*/read';
                          }
                        }
                      }
                    }
                  let j = p.indexOf('/', 6);
                  if (j > 6) {
                    let q0 = p.slice(6, j);
                    if (p.startsWith('invites', j + 1)) {
                      if (l === j + 8) {
                        return 'POST /user/*/invites';
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
                                      return 'POST /user/*/invites/*/accept';
                                    }
                                  }
                                case 114:
                                  if (p.startsWith('esend', j + 2)) {
                                    if (l === j + 7) {
                                      return 'POST /user/*/invites/*/resend';
                                    }
                                  }
                              }
                            }
                          }
                        }
                    }
                  } else if (j === -1) {
                    let q0 = p.slice(6);
                    return 'POST /user/*';
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
                              return 'POST /org/*/members';
                            }
                            if (l > j + 9)
                              if (p.charCodeAt(j + 8) === 47) {
                                if (!p.includes('/', j + 9)) {
                                  let q1 = p.slice(j + 9);
                                  return 'POST /org/*/members/*';
                                }
                              }
                          }
                        case 114:
                          if (p.startsWith('oles', j + 2)) {
                            if (l === j + 6) {
                              return 'POST /org/*/roles';
                            }
                            if (l > j + 7)
                              if (p.charCodeAt(j + 6) === 47) {
                                if (!p.includes('/', j + 7)) {
                                  let q1 = p.slice(j + 7);
                                  return 'POST /org/*/roles/*';
                                }
                              }
                          }
                        case 100:
                          if (p.startsWith('omains', j + 2)) {
                            if (l === j + 8) {
                              return 'POST /org/*/domains';
                            }
                            if (l > j + 9)
                              if (p.charCodeAt(j + 8) === 47) {
                                if (!p.includes('/', j + 9)) {
                                  let q1 = p.slice(j + 9);
                                  return 'POST /org/*/domains/*';
                                }
                              }
                          }
                        case 112:
                          if (p.startsWith('rojects', j + 2)) {
                            if (l === j + 9) {
                              return 'POST /org/*/projects';
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
                                            return 'POST /org/*/projects/*/members';
                                          }
                                        }
                                      case 116:
                                        if (p.startsWith('asks', j + 2)) {
                                          if (l === j + 6) {
                                            return 'POST /org/*/projects/*/tasks';
                                          }
                                          if (l > j + 7)
                                            if (p.charCodeAt(j + 6) === 47) {
                                              switch (p.charCodeAt(j + 7)) {
                                                case 116:
                                                  if (l > j + 8) {
                                                    switch (p.charCodeAt(j + 8)) {
                                                      case 105:
                                                        if (p.startsWith('me-entries', j + 9)) {
                                                          if (l === j + 19) {
                                                            return 'POST /org/*/projects/*/tasks/time-entries';
                                                          }
                                                          if (l > j + 20)
                                                            if (p.charCodeAt(j + 19) === 47) {
                                                              let i = j + 20;
                                                              j = p.indexOf('/', i);
                                                              if (j > i) {
                                                                let q2 = p.slice(i, j);
                                                                if (p.startsWith('stop', j + 1)) {
                                                                  if (l === j + 5) {
                                                                    return 'POST /org/*/projects/*/tasks/time-entries/*/stop';
                                                                  }
                                                                }
                                                              }
                                                            }
                                                        }
                                                      case 97:
                                                        if (p.startsWith('gs', j + 9)) {
                                                          if (l === j + 11) {
                                                            return 'POST /org/*/projects/*/tasks/tags';
                                                          }
                                                        }
                                                    }
                                                  }
                                                case 97:
                                                  if (p.startsWith('ttachments', j + 8)) {
                                                    if (l === j + 18) {
                                                      return 'POST /org/*/projects/*/tasks/attachments';
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
                                                return 'POST /org/*/tasks/*/assign';
                                              }
                                            }
                                          case 116:
                                            if (p.startsWith('tachments', j + 3)) {
                                              if (l === j + 12) {
                                                return 'POST /org/*/tasks/*/attachments';
                                              }
                                            }
                                        }
                                      }
                                    case 115:
                                      if (p.startsWith('tatus', j + 2)) {
                                        if (l === j + 7) {
                                          return 'POST /org/*/tasks/*/status';
                                        }
                                      }
                                    case 99:
                                      if (p.startsWith('omments', j + 2)) {
                                        if (l === j + 9) {
                                          return 'POST /org/*/tasks/*/comments';
                                        }
                                      }
                                    case 116:
                                      if (l > j + 2) {
                                        switch (p.charCodeAt(j + 2)) {
                                          case 105:
                                            if (p.startsWith('me-entries', j + 3)) {
                                              if (l === j + 13) {
                                                return 'POST /org/*/tasks/*/time-entries';
                                              }
                                              if (l > j + 14)
                                                if (p.charCodeAt(j + 13) === 47) {
                                                  let i = j + 14;
                                                  j = p.indexOf('/', i);
                                                  if (j > i) {
                                                    let q2 = p.slice(i, j);
                                                    if (p.startsWith('stop', j + 1)) {
                                                      if (l === j + 5) {
                                                        return 'POST /org/*/tasks/*/time-entries/*/stop';
                                                      }
                                                    }
                                                  }
                                                }
                                            }
                                          case 97:
                                            if (p.startsWith('gs', j + 3)) {
                                              if (l === j + 5) {
                                                return 'POST /org/*/tasks/*/tags';
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
                                      return 'POST /org/*/billing/subscription';
                                    }
                                    if (p.startsWith('/cancel', j + 21)) {
                                      if (l === j + 28) {
                                        return 'POST /org/*/billing/subscription/cancel';
                                      }
                                    }
                                  }
                                case 105:
                                  if (l > j + 18)
                                    if (p.startsWith('nvoices/', j + 10)) {
                                      if (!p.includes('/', j + 18)) {
                                        let q1 = p.slice(j + 18);
                                        return 'POST /org/*/billing/invoices/*';
                                      }
                                    }
                                case 112:
                                  if (p.startsWith('ayment-methods', j + 10)) {
                                    if (l === j + 24) {
                                      return 'POST /org/*/billing/payment-methods';
                                    }
                                  }
                              }
                            }
                        case 97:
                          if (p.startsWith('pi-keys', j + 2)) {
                            if (l === j + 9) {
                              return 'POST /org/*/api-keys';
                            }
                          }
                        case 119:
                          if (p.startsWith('ebhooks', j + 2)) {
                            if (l === j + 9) {
                              return 'POST /org/*/webhooks';
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
                        return 'POST /admin/exports/*/cancel';
                      }
                    }
                  }
                }
          }
        }
      }
    case 'GET':
      switch (p) {
        case '/auth/sso/providers': {
          return 'GET /auth/sso/providers';
        }
        case '/user/me': {
          return 'GET /user/me';
        }
        case '/user/me/preferences': {
          return 'GET /user/me/preferences';
        }
        case '/user/me/sessions': {
          return 'GET /user/me/sessions';
        }
        case '/user/notifications': {
          return 'GET /user/notifications';
        }
        case '/search': {
          return 'GET /search';
        }
        case '/search/filters': {
          return 'GET /search/filters';
        }
        case '/tags': {
          return 'GET /tags';
        }
        case '/status': {
          return 'GET /status';
        }
        case '/admin/reports/time': {
          return 'GET /admin/reports/time';
        }
        case '/admin/users': {
          return 'GET /admin/users';
        }
        case '/admin/projects': {
          return 'GET /admin/projects';
        }
        case '/admin/audit-logs': {
          return 'GET /admin/audit-logs';
        }
        case '/admin/stats': {
          return 'GET /admin/stats';
        }
      }
      {
        let l = p.length;
        if (l > 1) {
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
                              return 'GET /user/*/notifications';
                            }
                          }
                        case 105:
                          if (l > j + 9)
                            if (p.startsWith('nvites/', j + 2)) {
                              if (!p.includes('/', j + 9)) {
                                let q1 = p.slice(j + 9);
                                return 'GET /user/*/invites/*';
                              }
                            }
                      }
                    }
                  } else if (j === -1) {
                    let q0 = p.slice(6);
                    return 'GET /user/*';
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
                              return 'GET /org/*/members';
                            }
                          }
                        case 114:
                          if (p.startsWith('oles', j + 2)) {
                            if (l === j + 6) {
                              return 'GET /org/*/roles';
                            }
                          }
                        case 100:
                          if (p.startsWith('omains', j + 2)) {
                            if (l === j + 8) {
                              return 'GET /org/*/domains';
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
                                          return 'GET /org/*/projects/*/members';
                                        }
                                      }
                                    case 97:
                                      if (p.startsWith('ctivity', j + 2)) {
                                        if (l === j + 9) {
                                          return 'GET /org/*/projects/*/activity';
                                        }
                                      }
                                    case 116:
                                      if (p.startsWith('asks', j + 2)) {
                                        if (l === j + 6) {
                                          return 'GET /org/*/projects/*/tasks';
                                        }
                                        if (l > j + 7)
                                          if (p.charCodeAt(j + 6) === 47) {
                                            switch (p.charCodeAt(j + 7)) {
                                              case 116:
                                                if (p.startsWith('ime-entries', j + 8)) {
                                                  if (l === j + 19) {
                                                    return 'GET /org/*/projects/*/tasks/time-entries';
                                                  }
                                                }
                                              case 97:
                                                if (p.startsWith('ttachments', j + 8)) {
                                                  if (l === j + 18) {
                                                    return 'GET /org/*/projects/*/tasks/attachments';
                                                  }
                                                }
                                            }
                                          }
                                      }
                                  }
                                }
                              } else if (j === -1) {
                                let q1 = p.slice(i);
                                return 'GET /org/*/projects/*';
                              }
                            }
                        case 116:
                          if (p.startsWith('asks', j + 2)) {
                            if (l === j + 6) {
                              return 'GET /org/*/tasks';
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
                                            return 'GET /org/*/tasks/*/comments';
                                          }
                                        }
                                      case 116:
                                        if (p.startsWith('ime-entries', j + 2)) {
                                          if (l === j + 13) {
                                            return 'GET /org/*/tasks/*/time-entries';
                                          }
                                        }
                                      case 97:
                                        if (p.startsWith('ttachments', j + 2)) {
                                          if (l === j + 12) {
                                            return 'GET /org/*/tasks/*/attachments';
                                          }
                                        }
                                    }
                                  }
                                } else if (j === -1) {
                                  let q1 = p.slice(i);
                                  return 'GET /org/*/tasks/*';
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
                                            return 'GET /org/*/billing/plans';
                                          }
                                        }
                                      case 97:
                                        if (p.startsWith('yment-methods', j + 11)) {
                                          if (l === j + 24) {
                                            return 'GET /org/*/billing/payment-methods';
                                          }
                                        }
                                    }
                                  }
                                case 115:
                                  if (p.startsWith('ubscription', j + 10)) {
                                    if (l === j + 21) {
                                      return 'GET /org/*/billing/subscription';
                                    }
                                  }
                                case 105:
                                  if (p.startsWith('nvoices', j + 10)) {
                                    if (l === j + 17) {
                                      return 'GET /org/*/billing/invoices';
                                    }
                                    if (l > j + 18)
                                      if (p.charCodeAt(j + 17) === 47) {
                                        if (!p.includes('/', j + 18)) {
                                          let q1 = p.slice(j + 18);
                                          return 'GET /org/*/billing/invoices/*';
                                        }
                                      }
                                  }
                              }
                            }
                        case 97:
                          if (p.startsWith('pi-keys', j + 2)) {
                            if (l === j + 9) {
                              return 'GET /org/*/api-keys';
                            }
                          }
                        case 119:
                          if (p.startsWith('ebhooks', j + 2)) {
                            if (l === j + 9) {
                              return 'GET /org/*/webhooks';
                            }
                            if (l > j + 10)
                              if (p.charCodeAt(j + 9) === 47) {
                                let i = j + 10;
                                j = p.indexOf('/', i);
                                if (j > i) {
                                  let q1 = p.slice(i, j);
                                  if (p.startsWith('deliveries', j + 1)) {
                                    if (l === j + 11) {
                                      return 'GET /org/*/webhooks/*/deliveries';
                                    }
                                    if (l > j + 12)
                                      if (p.charCodeAt(j + 11) === 47) {
                                        if (!p.includes('/', j + 12)) {
                                          let q2 = p.slice(j + 12);
                                          return 'GET /org/*/webhooks/*/deliveries/*';
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
                    return 'GET /org/*';
                  }
                }
            case 102:
              if (l > 7)
                if (p.startsWith('iles/', 2)) {
                  if (!p.includes('/', 7)) {
                    let q0 = p.slice(7);
                    return 'GET /files/*';
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
                                        return 'GET /admin/reports/projects/*/summary';
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
                                        return 'GET /admin/reports/users/*/activity';
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
                            return 'GET /admin/exports/*';
                          }
                        }
                  }
                }
          }
        }
      }
    case 'PATCH':
      switch (p) {
        case '/user/me/preferences': {
          return 'PATCH /user/me/preferences';
        }
      }
      {
        let l = p.length;
        if (l > 1) {
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
                                return 'PATCH /org/*/projects/*';
                              }
                            }
                        case 116:
                          if (l > j + 7)
                            if (p.startsWith('asks/', j + 2)) {
                              if (!p.includes('/', j + 7)) {
                                let q1 = p.slice(j + 7);
                                return 'PATCH /org/*/tasks/*';
                              }
                            }
                        case 119:
                          if (l > j + 10)
                            if (p.startsWith('ebhooks/', j + 2)) {
                              if (!p.includes('/', j + 10)) {
                                let q1 = p.slice(j + 10);
                                return 'PATCH /org/*/webhooks/*';
                              }
                            }
                      }
                    }
                  } else if (j === -1) {
                    let q0 = p.slice(5);
                    return 'PATCH /org/*';
                  }
                }
            case 115:
              if (l > 16)
                if (p.startsWith('earch/filters/', 2)) {
                  if (!p.includes('/', 16)) {
                    let q0 = p.slice(16);
                    return 'PATCH /search/filters/*';
                  }
                }
            case 116:
              if (l > 6)
                if (p.startsWith('ags/', 2)) {
                  if (!p.includes('/', 6)) {
                    let q0 = p.slice(6);
                    return 'PATCH /tags/*';
                  }
                }
          }
        }
      }
    case 'DELETE': {
      let l = p.length;
      if (l > 1) {
        switch (p.charCodeAt(1)) {
          case 117:
            if (l > 18)
              if (p.startsWith('ser/me/sessions/', 2)) {
                if (!p.includes('/', 18)) {
                  let q0 = p.slice(18);
                  return 'DELETE /user/me/sessions/*';
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
                                          return 'DELETE /org/*/projects/*/tasks/tags';
                                        }
                                      }
                                    case 99:
                                      if (l > j + 21)
                                        if (p.startsWith('ustom-fields/', j + 8)) {
                                          if (!p.includes('/', j + 21)) {
                                            let q2 = p.slice(j + 21);
                                            return 'DELETE /org/*/projects/*/tasks/custom-fields/*';
                                          }
                                        }
                                  }
                                }
                            } else if (j === -1) {
                              let q1 = p.slice(i);
                              return 'DELETE /org/*/projects/*';
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
                                        return 'DELETE /org/*/tasks/*/tags';
                                      }
                                    }
                                  case 99:
                                    if (l > j + 15)
                                      if (p.startsWith('ustom-fields/', j + 2)) {
                                        if (!p.includes('/', j + 15)) {
                                          let q2 = p.slice(j + 15);
                                          return 'DELETE /org/*/tasks/*/custom-fields/*';
                                        }
                                      }
                                }
                              }
                            } else if (j === -1) {
                              let q1 = p.slice(i);
                              return 'DELETE /org/*/tasks/*';
                            }
                          }
                      case 98:
                        if (l > j + 25)
                          if (p.startsWith('illing/payment-methods/', j + 2)) {
                            if (!p.includes('/', j + 25)) {
                              let q1 = p.slice(j + 25);
                              return 'DELETE /org/*/billing/payment-methods/*';
                            }
                          }
                      case 97:
                        if (l > j + 10)
                          if (p.startsWith('pi-keys/', j + 2)) {
                            if (!p.includes('/', j + 10)) {
                              let q1 = p.slice(j + 10);
                              return 'DELETE /org/*/api-keys/*';
                            }
                          }
                      case 119:
                        if (l > j + 10)
                          if (p.startsWith('ebhooks/', j + 2)) {
                            if (!p.includes('/', j + 10)) {
                              let q1 = p.slice(j + 10);
                              return 'DELETE /org/*/webhooks/*';
                            }
                          }
                    }
                  }
                } else if (j === -1) {
                  let q0 = p.slice(5);
                  return 'DELETE /org/*';
                }
              }
          case 102:
            if (l > 7)
              if (p.startsWith('iles/', 2)) {
                if (!p.includes('/', 7)) {
                  let q0 = p.slice(7);
                  return 'DELETE /files/*';
                }
              }
          case 115:
            if (l > 16)
              if (p.startsWith('earch/filters/', 2)) {
                if (!p.includes('/', 16)) {
                  let q0 = p.slice(16);
                  return 'DELETE /search/filters/*';
                }
              }
          case 116:
            if (l > 6)
              if (p.startsWith('ags/', 2)) {
                if (!p.includes('/', 6)) {
                  let q0 = p.slice(6);
                  return 'DELETE /tags/*';
                }
              }
        }
      }
    }
    case 'PUT': {
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
                              return 'PUT /org/*/projects/*/tasks/custom-fields/*';
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
                              return 'PUT /org/*/tasks/*/custom-fields/*';
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
  return '';
};
