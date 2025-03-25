import type { Compiler } from '../tree/compiler.js';
import { ALL, type Router } from './index.js';
import compilePath from '../path/compiler.js';

export default (
  router: Router<string>,
  compile: Compiler,
  methodInput: string,
  parsePath: string,
  startIndex: 0 | 1
): string => {
  let str = 'switch(' + methodInput + '){';
  for (const key in router) str += 'case"' + key + '":{' + parsePath + compilePath(router[key]!, compile, startIndex) + 'break}';
  str += '}';

  const all = router[ALL];
  if (all != null) str += parsePath + compilePath(all, compile, startIndex);

  return str;
};
