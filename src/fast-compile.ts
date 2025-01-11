import type { Router } from './index.js';
import type { Node } from './tree/node.js';

import matcher from './tree/matcher.js';

// Modify the route tree to list numbers
// eslint-disable-next-line
const f = (node: Node<unknown>, fns: string[]) => {
  if (node[1] !== null)
    node[1] = fns.push(node[1] as string);

  if (node[2] !== null) {
    const children = node[2];
    // eslint-disable-next-line
    for (const key in children) f(children[key as unknown as number], fns);
  }

  if (node[3] !== null) {
    const params = node[3];

    if (params[1] !== null)
      params[1] = fns.push(params[1] as string);
    if (params[0] !== null)
      f(params[0], fns);
  }

  if (node[4] !== null)
    node[4] = fns.push(node[4] as string);
};

// eslint-disable-next-line
export const injectMatcher = (deps: any[]) => deps.push(matcher);
// eslint-disable-next-line
export const injectRouter = (deps: any[], router: Router) => deps.push(router[1]);

/**
 * Compile the router but with no pattern matching code
 */
export default (router: Router, decls: string[], routerId: number, matcherId: number, captures: string): string => {
  const builder = router[0].length === 0
    ? ''
    : router[0].map((pair) => `if(${compilerConstants.PATH}==="${pair[0].slice(1).replace(/"/g, '\\"')}"){${pair[1]}}`).join('');

  if (router[1] === null)
    return builder;

  // Load all handler body
  const fns: string[] = [];
  f(router[1], fns);

  const args = `(${compilerConstants.TMP},${compilerConstants.PARAMS}${captures})`;

  return `${builder}let ${compilerConstants.PARAMS}=[],${compilerConstants.TMP}=f${matcherId}(f${routerId},${compilerConstants.PATH},${compilerConstants.PARAMS},-1,${compilerConstants.PATH}.length);if(${compilerConstants.TMP}!==null)return d${
    // Create a function that combines other function bodies
    decls.push(`${args}=>{${
      fns.map((fn, i) => `if(${compilerConstants.TMP}===${i + 1}){${fn}}`).join('')
    }}`)
  }${args};`;
};
