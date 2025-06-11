import type { Router } from './index.js';
import compilePath from '../path/compiler.js';

export default (
  router: Router<string>,
  methodInput: string,
  parsePath: string,
  startIndex: 0 | 1
): string => {
  let str = 'switch(' + methodInput + '){';

  let all = '';
  for (const key in router) {
    if (key === '')
      all = parsePath + compilePath(router['']!, startIndex);
    else
      str += 'case"' + key + '":{' + parsePath + compilePath(router[key]!, startIndex) + 'break}';
  }
  return str + '}' + all;
};
