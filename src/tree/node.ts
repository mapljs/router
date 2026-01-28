export type Node<T = unknown> = [
  part: string,
  store: T | null,
  children: Node<T>[] | null,
  params: ParamNode<T> | null,
  wildcardStore: T | null,
];

export type ParamNode<T = unknown> = [child: Node<T> | null, store: T | null];

// Implementations
export const isEmptyNode = (node: Node<any>): boolean =>
  node[1] === null && node[2] === null && node[3] === null && node[4] === null;

export const createNode = <T>(part: string): Node<T> => [
  part,
  null,
  null,
  null,
  null,
];

export const createParamNode = (nextNode: ParamNode[0]): ParamNode => [
  nextNode,
  null,
];

export const cloneNode = (node: Node, part: string): Node => [
  part,
  node[1],
  node[2],
  node[3],
  node[4],
];

export const resetNode = (
  node: Node,
  part: string,
  children: Node[2],
): void => {
  node[0] = part;
  node[2] = children;

  node[1] = node[3] = node[4] = null;
};

// Travel until the end of a root node (path should not include end param or wildcard)
export const visitFromRoot = (root: Node, parts: string[]): Node => {
  // Split path by param separator
  for (let i = 0; i < parts.length; ++i) {
    let pathPart = parts[i];

    // visit param node only for parts[i > 0]
    // '/a/*/b/*/c' -> only visit param of '/b' and '/c'
    if (i !== 0) {
      if (root[3] == null) {
        const nextNode = createNode(pathPart);
        root[3] = createParamNode(nextNode);
        root = nextNode;
      } else root = root[3][0] ??= createNode(pathPart);
    }

    for (let j = 0; ; ++j) {
      const nodePart = root[0];

      // Reach the end of the pathname but node still continues
      if (j === pathPart.length) {
        if (j < nodePart.length) {
          const children: Node[2] = [];
          children[nodePart.charCodeAt(j)] = cloneNode(root, nodePart.slice(j));
          resetNode(root, pathPart, children);
        }

        break;
      }

      // Add static child
      if (j === nodePart.length) {
        if (root[2] == null) root[2] = [];
        else {
          const nextNode = root[2][pathPart.charCodeAt(j)] as
            | Node<any>
            | undefined;

          // Re-run loop with existing static node
          if (nextNode != null) {
            root = nextNode;
            pathPart = pathPart.slice(j);
            j = 0;
            continue;
          }
        }

        // Create and add new node
        const nextNode = createNode(pathPart.slice(j));
        root[2][pathPart.charCodeAt(j)] = nextNode;
        root = nextNode;

        break;
      }

      // Split into two paths
      if (pathPart[j] !== nodePart[j]) {
        // Split the old path
        const children: Node[2] = [];
        children[nodePart.charCodeAt(j)] = cloneNode(root, nodePart.slice(j));

        const nextNode = createNode(pathPart.slice(j));
        children[pathPart.charCodeAt(j)] = nextNode;

        resetNode(root, nodePart.slice(0, j), children);

        root = nextNode;
        break;
      }
    }
  }

  return root;
};

export const insertItem = <T>(node: Node<T>, path: string, item: T): void => {
  if (path[path.length - 1] === '*') {
    // Ends with wildcard
    if (path[path.length - 2] === '*')
      visitFromRoot(node, path.slice(0, -2).split('*'))[4] = item;
    // End with params
    else {
      const currentNode = visitFromRoot(node, path.slice(0, -1).split('*'));
      if (currentNode[3] === null)
        currentNode[3] = [null, item];
      else
        currentNode[3][1] = item;
    }
  } else visitFromRoot(node, path.split('*'))[1] = item;
};
