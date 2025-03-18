import type { Router } from './index.js';
import compileNode from './tree/compiler.js';

export default (
  router: Router,
  startIndex: number
): string => router[0]
  .map((pair) => 'if(' + compilerConstants.PATH + '==="' + pair[0].slice(-startIndex) + '"){' + pair[1] + '}')
  .join('') + (router[1] === null
  ? ''
  : 'let ' + compilerConstants.PATH_LEN + '=' + compilerConstants.PATH + '.length;' + compileNode(router[1], 0, startIndex, ''));
