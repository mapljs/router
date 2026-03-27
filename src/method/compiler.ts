import type { Router } from './index.ts';
import { isEmptyNode, type Node } from '../tree/node.ts';
import { compile, shouldBoundCheck } from '../tree/compiler.ts';

let STR!: string, START_IDX!: 0 | 1;

const each = (value: string, path: string) => {
  STR += `case"${START_IDX === 1 ? path : path.slice(1)}":{${value}}`;
};

const compileSubrouter = (mp: Map<string, string>, node: Node<string>): void => {
  if (mp.size > 0) {
    STR += `switch(${constants.PATH}){`;
    mp.forEach(each);
    STR += '}';
  }

  isEmptyNode(node) ||
    (STR +=
      mp.has('/') || !shouldBoundCheck(node)
        ? `{let ${constants.PATH_LEN}=${constants.PATH}.length;${compile(node, 0, START_IDX, '')}}`
        : `{let ${constants.PATH_LEN}=${constants.PATH}.length;if(${constants.PATH_LEN}>${START_IDX}){${compile(node, 0, START_IDX, '')}}}`);
};

export default (router: Router<string>, methodInput: string, start: 0 | 1): string => {
  STR = '';
  START_IDX = start;

  const methods = router[0];

  if (methods.length > 0) {
    const nodes = router[1];
    const maps = router[2];

    STR += `switch(${methodInput}){`;
    for (let i = 0; i < methods.length; i++) {
      STR += `case"${methods[i]}":`;
      compileSubrouter(maps[i], nodes[i]);
    }
    STR += '}';
  }

  router.length > 3 && compileSubrouter(router[4]!, router[3]!);

  return STR;
};
