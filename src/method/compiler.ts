import type { Router } from './index.js';
import compilePath from '../path/compiler.js';

export default (
  router: Router<string>,
  methodInput: string,
  parsePath: string,
  startIdx: 0 | 1,
): string => {
  const pathRouters = router[1];
  const methods = router[0];

  const hasAllMethodHandler = router.length === 3;

  const parsePathStr = hasAllMethodHandler ? '"){' + parsePath : '"){';
  let str =
    (hasAllMethodHandler ? parsePath + 'if(' : 'if(') +
    methodInput +
    '==="' +
    methods[0] +
    parsePathStr +
    compilePath(pathRouters[0], startIdx) +
    '}';

  for (let i = 1; i < pathRouters.length; i++)
    str +=
      'else if(' +
      methodInput +
      '==="' +
      methods[i] +
      parsePathStr +
      compilePath(pathRouters[i], startIdx) +
      '}';

  return hasAllMethodHandler ? str + compilePath(router[2], startIdx) : str;
};
