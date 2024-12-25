import { PATH } from '@mapl/router/constants';
import buildRouter from '@mapl/router/fast-compile';

import type { Router } from '@mapl/router/index';

// eslint-disable-next-line
export default (root: Router): (path: string) => any => {
  const decls: string[] = [];
  const deps: string[] = [];

  const body = buildRouter(root, decls, deps, '');
  const result = `${decls.map((str, idx) => 'var d' + (idx + 1) + '=' + str + ';').join('')}return (${PATH})=>{${body}return null;}`;

  // eslint-disable-next-line
  return Function(...deps.map((_, idx) => 'f' + (idx + 1)), result)(...deps);
}
