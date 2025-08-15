import type { Router } from './index.js';
import compilePath from '../path/compiler.js';

export default (
  router: Router<string>,
  methodInput: string,
  parsePath: string,
  startIndex: 0 | 1,
): string => {
  const allRouter = router[''];
  let str = '';

  for (const key in router)
    key !== '' &&
      (str +=
        (str === '' ? 'if(' : 'else if(') +
        methodInput +
        '==="' +
        key +
        '"){' +
        (allRouter == null ? parsePath : '') +
        compilePath(router[key]!, startIndex) +
        '}');
  return allRouter == null
    ? str
    : parsePath + str + compilePath(allRouter, startIndex);
};
