import { init, match as treeMatch } from '../tree/match.ts';
import type { Router } from './index.ts';

export { PARAMS } from '../tree/match.ts';

export const match = <T>(router: Router<T>, method: string, path: string): T | undefined => {
  init(path);

  let methodIdx = router[0].indexOf(method),
    matched: T | null | undefined;

  if (methodIdx !== -1) {
    matched = router[1][methodIdx].get(path);
    if (matched != null) return matched;

    matched = treeMatch(router[2][methodIdx], 1);
    if (matched != null) return matched;
  }

  // Continue matching GET method for HEAD requests
  if (method === 'HEAD') {
    methodIdx = router[0].indexOf('GET');

    if (methodIdx !== -1) {
      matched = router[1][methodIdx].get(path);
      if (matched != null) return matched;

      matched = treeMatch(router[2][methodIdx], 1);
      if (matched != null) return matched;
    }
  }

  // Match all methods
  methodIdx = router[0].indexOf('');

  if (methodIdx !== -1) {
    matched = router[1][methodIdx].get(path);
    if (matched != null) return matched;

    matched = treeMatch(router[2][methodIdx], 1);
    if (matched != null) return matched;
  }
};
