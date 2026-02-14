import type { Router } from './index.js';
import { compile } from '../tree/compiler.js';
import { isEmptyNode } from '../tree/node.js';

/**
 * If `startIndex === 1`, input path should start with `/`.
 * If `startIndex === 0`, input path should have sliced first `/`.
 */
export default (router: Router<string>, startIndex: 0 | 1): string => {
  let str = '';

  if (router.length > 1) {
    str =
      'if(' +
      constants.PATH +
      '==="' +
      (startIndex === 1 ? router[1] : router[1].slice(1)) +
      '"){' +
      router[2] +
      '}';

    for (let i = 3; i < router.length; i += 2)
      str +=
        'else if(' +
        constants.PATH +
        '==="' +
        (startIndex === 1 ? router[i] : router[i].slice(1)) +
        '"){' +
        router[i + 1] +
        '}';
  }

  return isEmptyNode(router[0])
    ? str
    : str +
        'let ' +
        constants.PATH_LEN +
        '=' +
        constants.PATH +
        '.length;' +
        compile(router[0], 0, startIndex, '');
};
