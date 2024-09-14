// Implements a quick matcher for when routes change
import type { Node } from './node';

export function matchItem(node: Node, path: string, params: string[], startIdx: number): unknown {
  const part = node[0];
  const pathPartLen = part.length;

  const pathLen = path.length;

  // Only check the pathPart if its length is > 1 since the parent has
  // already checked that the url matches the first character
  startIdx++;
  if (pathPartLen > 1) {
    if (startIdx + pathPartLen > pathLen) return null;

    for (let i = 1; i < pathPartLen; i++, startIdx++) {
      if (part.charCodeAt(i) !== path.charCodeAt(startIdx))
        return null;
    }
  }

  // Wildcard does not match here
  if (startIdx === pathLen)
    return node[1];

  if (node[2] !== null) {
    const child = node[2][path.charCodeAt(startIdx)];

    if (typeof child !== 'undefined') {
      const matchResult = matchItem(child, path, params, startIdx);
      if (matchResult !== null)
        return matchResult;
    }
  }

  if (node[3] !== null) {
    const paramsNode = node[3];
    const slashIdx = path.indexOf('/', startIdx);

    if (slashIdx === -1) {
      // Reach the end of the string
      if (paramsNode[1] !== null) {
        params.push(path.slice(startIdx));
        return paramsNode[1];
      }
    } else if (slashIdx !== startIdx && paramsNode[0] !== null) {
      // Parameter should not be empty
      params.push(path.substring(startIdx, slashIdx));

      const matchResult = matchItem(paramsNode[0], path, params, slashIdx);
      if (matchResult !== null)
        return matchResult;

      params.pop();
    }
  }

  if (node[4] !== null) {
    params.push(path.slice(startIdx));
    return node[4];
  }

  return null;
}
