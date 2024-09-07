export interface Node {
  part: string;

  store: any;
  children: Record<number, Node> | null;
  params: ParamNode | null;

  wildcardStore: unknown;
}

export interface ParamNode {
  child: Node | null;
  store: unknown;
}

// Implementations
export function createNode(part: string): Node {
  return {
    part,
    store: null,
    children: null,
    params: null,
    wildcardStore: null
  };
}

export function createParamNode(node: Node, nextNode: ParamNode['child']): ParamNode {
  // eslint-disable-next-line
  return node.params = {
    child: nextNode,
    store: null
  };
}

export function cloneNode(node: Node, part: string): Node {
  return {
    part,
    // eslint-disable-next-line
    store: node.store,
    children: node.children,
    params: node.params,
    wildcardStore: node.wildcardStore
  };
}

export function resetNode(node: Node, part: string, children: Node['children']): void {
  node.part = part;
  node.children = children;

  node.store = null;
  node.params = null;
  node.wildcardStore = null;
}

// Travel until the end of the node (path should not include end param or wildcard)
export function visitNode(node: Node, path: string): Node {
  // Split path by param separator
  const parts = path.split('*');

  for (let i = 0, { length } = parts; i < length; ++i) {
    // Set param node
    if (i !== 0) {
      if (node.params === null) {
        const nextNode = createNode(parts[i]);
        node.params = createParamNode(node, nextNode);
        node = nextNode;
      } else
        node = node.params.child ??= createNode(parts[i]);
    }

    for (let j = 0, pathPart = parts[i]; ; ++j) {
      const nodePart = node.part;

      // Reach the end of the pathname but node still continues
      if (j === pathPart.length) {
        if (j < nodePart.length) {
          const children: Node['children'] = {};
          children[nodePart.charCodeAt(j)] = cloneNode(node, nodePart.slice(j));
          resetNode(node, pathPart, children);
        }

        break;
      }

      // Add static child
      if (j === nodePart.length) {
        if (node.children === null)
          node.children = {};
        else {
          const nextNode = node.children[pathPart.charCodeAt(j)];

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
        node.children[pathPart.charCodeAt(j)] = nextNode;
        node = nextNode;

        break;
      }

      // Split into two paths
      if (pathPart.charCodeAt(j) !== nodePart.charCodeAt(j)) {
        // Split the old path
        const children: Node['children'] = {};
        children[nodePart.charCodeAt(j)] = cloneNode(node, nodePart.slice(j));

        const nextNode = createNode(pathPart.slice(j));
        children[pathPart.charCodeAt(j)] = createNode(pathPart.slice(j));

        resetNode(node, nodePart.substring(0, j), children);

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
      visitNode(node, path.substring(0, path.length - 2)).wildcardStore = item;
    // End with params
    else
      createParamNode(visitNode(node, path.substring(0, path.length - 1)), null).store = item;
  } else
    visitNode(node, path).store = item;
}
