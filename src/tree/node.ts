export type Node<T = unknown> = [
  part: string,
  store: T | undefined,
  children: Node<T>[] | undefined,
  params: ParamNode<T> | undefined,
  wildcardStore: T | undefined,
];

export type ParamNode<T = unknown> = [
  child: Node<T> | undefined,
  store: T | undefined,
];

// Implementations
export const createNode = <T>(part: string): Node<T> => [part, , , , ,];
export const createParamNode = (nextNode: ParamNode[0]): ParamNode => [
  nextNode,
  ,
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

  node[1] = node[3] = node[4] = undefined;
};

// Travel until the end of the node (path should not include end param or wildcard)
export const visitNode = (node: Node, parts: string[]): Node => {
  // Split path by param separator
  for (let i = 0; i < parts.length; ++i) {
    let pathPart = parts[i];

    // Set param node
    if (i !== 0) {
      if (node[3] == null) {
        const nextNode = createNode(pathPart);
        node[3] = createParamNode(nextNode);
        node = nextNode;
      } else node = node[3][0] ??= createNode(pathPart);
    }

    for (let j = 0; ; ++j) {
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
        if (node[2] == null) node[2] = [];
        else {
          const nextNode = node[2][pathPart.charCodeAt(j)] as
            | Node<any>
            | undefined;

          // Re-run loop with existing static node
          if (nextNode != null) {
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
      if (pathPart[j] !== nodePart[j]) {
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
};

export const insertItem = <T>(node: Node<T>, path: string, item: T): void => {
  if (path.endsWith('*')) {
    // Ends with wildcard
    if (path[path.length - 2] === '*')
      visitNode(node, path.slice(0, -2).split('*'))[4] = item;
    // End with params
    else (visitNode(node, path.slice(0, -1).split('*'))[3] ??= [, ,])[1] = item;
  } else visitNode(node, path.split('*'))[1] = item;
};
