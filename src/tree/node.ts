export type Node<T = string> = [
  part: string,

  store: T | null,
  children: Node[] | null,
  params: ParamNode<T> | null,

  wildcardStore: T | null
];

export type ParamNode<T = string> = [
  child: Node<T> | null,
  store: T | null
];

// Implementations
// eslint-disable-next-line
export const createNode = (part: string): Node => [part, null, null, null, null],
  // eslint-disable-next-line
  createParamNode = (nextNode: ParamNode[0]): ParamNode => [nextNode, null],
  // eslint-disable-next-line
  cloneNode = (node: Node, part: string): Node => [part, node[1], node[2], node[3], node[4]],
  // eslint-disable-next-line
  resetNode = (node: Node, part: string, children: Node[2]): void => {
    node[0] = part;
    node[2] = children;

    node[1] = null;
    node[3] = null;
    node[4] = null;
  },
  // Travel until the end of the node (path should not include end param or wildcard)
  // eslint-disable-next-line
  visitNode = (node: Node, path: string): Node => {
    // Split path by param separator
    for (let i = 0, parts = path.split('*'), l = parts.length; i < l; ++i) {
    // Set param node
      if (i !== 0) {
        if (node[3] === null) {
          const nextNode = createNode(parts[i]);
          node[3] = createParamNode(nextNode);
          node = nextNode;
        } else
          node = node[3][0] ??= createNode(parts[i]);
      }

      for (let j = 0, pathPart = parts[i]; ; ++j) {
        const nodePart = node[0];

        // Reach the end of the pathname but node still continues
        if (j === pathPart.length) {
          if (j < nodePart.length) {
            const children: Node[2] = [];
            children[nodePart.charCodeAt(j)] = cloneNode(node, nodePart.slice(j));
            resetNode(node, pathPart, children);
          }

          break;
        }

        // Add static child
        if (j === nodePart.length) {
          if (node[2] === null)
            node[2] = [];
          else {
            const nextNode = node[2][pathPart.charCodeAt(j)];

            // Re-run loop with existing static node
            if (typeof nextNode !== 'undefined') {
              node = nextNode;
              pathPart = pathPart.slice(j);
              j = 0;
              continue;
            }
          }

          // Create and add new node
          const nextNode = createNode(pathPart.slice(j));
          node[2][pathPart.charCodeAt(j)] = nextNode;
          node = nextNode;

          break;
        }

        // Split into two paths
        if (pathPart.charCodeAt(j) !== nodePart.charCodeAt(j)) {
        // Split the old path
          const children: Node[2] = [];
          children[nodePart.charCodeAt(j)] = cloneNode(node, nodePart.slice(j));

          const nextNode = createNode(pathPart.slice(j));
          children[pathPart.charCodeAt(j)] = nextNode;

          resetNode(node, nodePart.substring(0, j), children);

          node = nextNode;
          break;
        }
      }
    }

    return node;
  },
  // eslint-disable-next-line
  insertItem = (node: Node, path: string, item: string): void => {
    if (path.charCodeAt(path.length - 1) === 42) {
    // Ends with wildcard
      if (path.charCodeAt(path.length - 2) === 42)
        visitNode(node, path.substring(0, path.length - 2))[4] = item;
      // End with params
      else
        (visitNode(node, path.substring(0, path.length - 1))[3] ??= createParamNode(null))[1] = item;
    } else
      visitNode(node, path)[1] = item;
  };
