import type { Router } from './index.js';
import { isEmptyNode, type Node } from '../tree/node.js';
import { compile } from '../tree/compiler.js';

let STR!: string, START_IDX!: 0 | 1;

const each = (value: string, path: string) => {
  STR += `if(${constants.PATH}==="${START_IDX === 1 ? path : path.slice(1)}"){${value}}else `;
}

const compileSubrouter = (mp: Map<string, string>, node: Node<string>): void => {
  mp.forEach(each);

  isEmptyNode(node) ?
    STR += '{}' :
    (STR += `{}let ${constants.PATH_LEN}=${constants.PATH}.length;` +
      compile(node, 0, START_IDX, '')
    );
}

export default (
  router: Router<string>,
  methodInput: string,
  start: 0 | 1,
): string => {
  STR = '';
  START_IDX = start;

  const methods = router[0];

  if (methods.length > 0) {
    const nodes = router[1];
    const maps = router[2];

    methodInput = `if(${methodInput}==="`;

    for (let i = 0; i < methods.length; i++) {
      STR += methodInput + methods[i] + '"){';
      compileSubrouter(maps[i], nodes[i]);
      STR += '}else ';
    }

    STR += '{}';
  }

  router.length === 3 || compileSubrouter(router[4], router[3]);

  return STR;
};
