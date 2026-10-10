import type { Router } from './index.ts';
import { isEmptyNode } from '../tree/node.ts';
import { compile, shouldBoundCheck } from '../tree/compiler.ts';

let STR!: string,
  START_IDX!: 0 | 1,
  METHODS!: Router<string>[0],
  MAPS!: Router<string>[1],
  NODES!: Router<string>[2];

const each = (value: string, path: string) => {
  STR += `case"${START_IDX === 1 ? path : path.slice(1)}":{${value};break}`;
};

const compileSubrouter = (i: number): void => {
  const map = MAPS[i],
    node = NODES[i];

  if (map.size > 0) {
    STR += `switch(${constants.PATH}){`;
    map.forEach(each);
    STR += '}';
  }

  isEmptyNode(node) ||
    (STR +=
      map.has('/') || !shouldBoundCheck(node)
        ? `let ${constants.PATH_LEN}=${constants.PATH}.length;${compile(node, 0, START_IDX, '')}`
        : `let ${constants.PATH_LEN}=${constants.PATH}.length;if(${constants.PATH_LEN}>${START_IDX}){${compile(node, 0, START_IDX, '')}}`);
};

const swapIndices = (from: number, to: number) => {
  if (from !== to) {
    const oldMethod = METHODS[to],
      oldMap = MAPS[to],
      oldNodes = NODES[to];

    METHODS[to] = METHODS[from];
    METHODS[from] = oldMethod;

    MAPS[to] = MAPS[from];
    MAPS[from] = oldMap;

    NODES[to] = NODES[from];
    NODES[from] = oldNodes;
  }
};

export default (
  router: Router<string>,
  methodInput: string,
  start: 0 | 1,
  handleHeadCode: string,
): string => {
  STR = '';
  START_IDX = start;

  METHODS = router[0];
  MAPS = router[1];
  NODES = router[2];

  let i = 0,
    matchAllIdx = METHODS.indexOf('');

  if (matchAllIdx !== -1) {
    swapIndices(matchAllIdx, i);
    matchAllIdx = i++;
  }

  STR += `switch(${methodInput}){`;

  // Handle GET & HEAD
  {
    let getIdx = METHODS.indexOf('GET', i);
    if (getIdx !== -1) {
      swapIndices(getIdx, i);
      getIdx = i++;

      STR += 'case"HEAD":{' + handleHeadCode;
      {
        let headIdx = METHODS.indexOf('HEAD', i);
        if (headIdx !== -1) {
          swapIndices(headIdx, i);
          compileSubrouter((headIdx = i++));
        }
      }
      STR += '}case "GET":{';
      compileSubrouter(getIdx);
      STR += 'break}';
    }
  }

  for (; i < METHODS.length; i++) {
    STR += `case"${METHODS[i]}":{`;
    compileSubrouter(i);
    STR += 'break}';
  }
  STR += '}';

  matchAllIdx === -1 || compileSubrouter(matchAllIdx);
  return STR;
};
