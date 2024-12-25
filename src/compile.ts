import type { Router } from './index.js';
import compileNode from './tree/compiler.js';

export default (router: Router): string => {
  const builder = router[0].length === 0
    ? ''
    : `${router[0].map((pair) => `if(${compilerConstants.PATH}==="${pair[0].slice(1).replace(/"/g, '\\"')}"){${pair[1]}}`).join('')}}`;

  return router[1] === null
    ? builder
    : `${builder}let ${compilerConstants.PATH_LEN}=${compilerConstants.PATH}.length;${compileNode(router[1], false, false, -1, '')}`;
};
