export type Node = [
  part: string,

  store: any,
  children: Record<number, Node> | null,
  params: ParamNode | null,

  wildcardStore: unknown
];

export type ParamNode = [child: Node | null, store: unknown];

// Implementations
export function createNode(part: string): Node {
  return [part, null, null, null, null];
}

export function createRootNode(): Node {
  return ['/', null, null, null, null];
}

export function createParamNode(node: Node): ParamNode {
  // eslint-disable-next-line
  return node[3] = [null, null];
}

export function cloneNode(node: Node, part: string): Node {
  return [part, node[1], node[2], node[3], node[4]];
}

export function resetNode(node: Node, part: string): void {
  node[0] = part;
  node[1] = null;
  node[2] = null;
  node[3] = null;
  node[4] = null;
}

export function splitNodePath(node: Node, idx: number): void {
  const oldPath = node[0];

  const nextNode = cloneNode(node, oldPath.slice(idx));
  resetNode(node, oldPath.substring(0, idx));

  // Set the nextNode as children
  const children: Node[2] = {};
  children[oldPath.charCodeAt(idx)] = nextNode;
  node[2] = children;
}

// Travel until the end of the node (path should not include end param or wildcard)
export function visitNode(node: Node, path: string): Node {
  // Split path by param separator
  const parts = path.split('*');

  for (let i = 0, { length } = parts; i < length; ++i) {
    // Set param node
    if (i !== 0) {
      const params: ParamNode = node[3] ?? createParamNode(node);

      if (params[0] === null) {
        node = params[0] = createNode(parts[i]);
        continue;
      }

      node = params[0];
    }

    for (let j = 0, pathPart = parts[i]; ; ++j) {
      const nodePart = node[0];

      // Reach the end of the pathname but node still continues
      if (j === pathPart.length) {
        if (j < nodePart.length) {
          const nextNode = cloneNode(node, nodePart.slice(j));
          resetNode(node, pathPart);

          // Set the nextNode as children
          const children: Node[2] = {};
          children[nodePart.charCodeAt(j)] = nextNode;
          node[2] = children;
        }

        break;
      }

      // Add static child
      if (j === nodePart.length) {
        if (node[2] === null)
          node[2] = {};
        else {
          const nextNode = node[2][pathPart.charCodeAt(j)];

          // Re-run loop with existing static node
          if (typeof nextNode !== 'undefined') {
            node = nextNode;
            pathPart = pathPart.substring(j);
            j = 0;
            continue;
          }
        }

        // Create and add new node
        const nextNode = createNode(pathPart.substring(j));
        node[2][pathPart.charCodeAt(j)] = nextNode;
        node = nextNode;

        break;
      }

      // Split the node if the two paths don't match
      if (pathPart[j] !== nodePart[j]) {
        const nextNode = createNode(pathPart.substring(j));

        splitNodePath(node, j);

        const children: Node[2] = {};
        children[pathPart.charCodeAt(j)] = nextNode;
        node[2] = children;

        node = nextNode;
        break;
      }
    }
  }

  return node;
}

export function insertItem(node: Node, path: string, item: unknown): void {
  if (path.charCodeAt(path.length - 1) === 42) {
    // Ends with wildcard
    if (path.charCodeAt(path.length - 2) === 42)
      visitNode(node, path.substring(0, path.length - 2))[4] = item;
    // End with params
    else
      createParamNode(visitNode(node, path.substring(0, path.length - 1)))[1] = item;
  } else
    visitNode(node, path)[1] = item;
}
