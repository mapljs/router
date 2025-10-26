import type { Router } from './index.js';
import { compile } from '../tree/compiler.js';

/**
 * Faster string comparisons for frameworks as most request URL strings are not optimized for slice & comparison.
 *
 * @example
 * // Example path parser
 * let $PATH = req.url,
 *   $PATH_START = p.indexOf('/', 12) + 1,
 *   $PATH_END = p.indexOf('?', s),
 *   $PATH_LEN = e === -1 ? p.length : e;
 */
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
        compile(router[key]!, 0, -startIndex, constants.PATH_START + '+') +
        '}');
  return allRouter == null
    ? str
    : parsePath +
        str +
        compile(allRouter, 0, -startIndex, constants.PATH_START + '+');
};
