import type { Node } from './node.js';

/**
 * Match a pathname and returns the result
 */
// eslint-disable-next-line
const f = (node: Node<unknown>, path: string, params: string[], start: number): unknown => {
  const part = node[0];
  let tmp: any = part.length;

  // Only check the part if its length is > 1 since the parent has
  // already checked that the url matches the first character
  if (tmp > 1 && (start + tmp > path.length || path.indexOf(part, start) !== start))
    return null;
  start += tmp;

  // Reached the end of the URL
  if (start === path.length)
    return node[1];

  // Check the next children node
  if (node[2] !== null) {
    tmp = node[2][path.charCodeAt(start)];
    if (typeof tmp !== 'undefined') {
      // eslint-disable-next-line
      tmp = f(tmp, path, params, start);
      if (tmp !== null) return tmp;
    }
  }

  // Check for parameters
  if (node[3] !== null) {
    tmp = path.indexOf('/', start);

    if (tmp === -1) {
      if (node[3][1] !== null) {
        params.push(path.substring(start));
        return node[3][1];
      }
    } else if (tmp !== start && node[3][0] !== null) {
      params.push(path.substring(start, tmp as number));

      tmp = f(node[3][0], path, params, tmp as number);
      if (tmp !== null)
        return tmp;

      params.pop();
    }
  }

  // Wildcard
  if (node[4] !== null) {
    params.push(path.substring(start));
    return node[4];
  }

  return null;
};

export default f;
