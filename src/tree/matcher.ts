// Implements a quick matcher for when routes change
import type { Node } from './node';

export function matchItem(node: Node, path: string, params: string[], startIdx: number): unknown {
  const part = node.part;
  const pathPartLen = part.length;
  const pathPartEndIdx = startIdx + pathPartLen;

  const pathLen = path.length;

  // Only check the pathPart if its length is > 1 since the parent has
  // already checked that the url matches the first character
  if (pathPartLen > 1) {
    if (pathPartEndIdx > pathLen) return false;

    for (let i = 1; i < pathPartLen; i++) {
      if (part.charCodeAt(i) !== path.charCodeAt(startIdx + i))
        return null;
    }
  }

  // Wildcard does not match here
  if (pathPartEndIdx === pathLen)
    return node.store;

  if (node.children !== null) {
    const child = node.children[path.charCodeAt(pathPartEndIdx)];

    if (typeof child !== 'undefined') {
      const matchResult = matchItem(child, path, params, pathPartEndIdx);
      if (matchResult !== null)
        return matchResult;
    }
  }

  if (node.params !== null) {
    const paramsNode = node.params;
    const slashIdx = path.indexOf('/', pathPartEndIdx);

    if (slashIdx === -1) {
      // Reach the end of the string
      if (paramsNode.store !== null) {
        params.push(path.slice(pathPartEndIdx));
        return paramsNode.store;
      }
    } else if (slashIdx !== pathPartEndIdx && paramsNode.child !== null) {
      // Parameter should not be empty
      params.push(path.substring(pathPartEndIdx, slashIdx));

      const matchResult = matchItem(node, path, params, slashIdx);
      if (matchResult !== null)
        return matchResult;

      params.pop();
    }
  }

  if (node.wildcardStore !== null) {
    params.push(path.slice(pathPartEndIdx));
    return node.wildcardStore;
  }

  return null;
}
