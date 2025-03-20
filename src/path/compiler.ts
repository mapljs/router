import type { Router } from './index.js';
import type { Compiler } from '../tree/compiler.js';

export default (
  router: Router<string>,
  compile: Compiler,
  startIndex: 0 | 1
): string => router[0]
  .map((pair) => 'if(' + compilerConstants.PATH + '==="' + pair[0].slice(startIndex) + '"){' + pair[1] + '}')
  .join('') + (router[1] === null
  ? ''
  : 'let ' + compilerConstants.PATH_LEN + '=' + compilerConstants.PATH + '.length;' + compile(router[1], 0, -startIndex, ''));
