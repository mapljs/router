import type { Node } from './node.js';

export let PARAMS!: string[];
let PATH!: string;
let PATH_LEN!: number;

export const init = (path: string): void => {
  PATH = path;
  PATH_LEN = path.length;
  PARAMS = [];
}

export const match = <T>(node: Node<T>, start: number): T | null => {
  if (start === PATH_LEN) return node[1];

  // Check the next children node
  if (node[2].length > 0) {
    const childId = node[2].indexOf(PATH.charCodeAt(start));
    if (childId > -1) {
      const child = node[3][childId];
      const part = child[0];

      if (part.length === 1 || PATH.startsWith(part, start)) {
        const matched = match(child, start + part.length);
        if (matched !== null) return matched;
      }
    }
  }

  // Check for parameters
  if (node[4] !== null) {
    const paramNode = node[4];

    if (paramNode[0] === null) {
      if (!PATH.includes('/', start)) {
        PARAMS.push(PATH.slice(start));
        return paramNode[1];
      }
    } else {
      const endIdx = PATH.indexOf('/', start);

      if (endIdx === -1) {
        if (paramNode[1] !== null) {
          PARAMS.push(PATH.slice(start));
          return paramNode[1];
        }
      } else if (endIdx > start) {
        PARAMS.push(PATH.slice(start, endIdx));

        const matched = match(paramNode[0], endIdx + 1);
        if (matched !== null) return matched;

        PARAMS.pop();
      }
    }
  }

  // Wildcard
  if (node[5] !== null) {
    PARAMS.push(PATH.slice(start));
    return node[5];
  }

  return null;
};
