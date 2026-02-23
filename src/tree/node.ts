export type Node<T = unknown> = [
  part: string,
  store: T | null,
  childrenFirstChar: number[],
  children: Node<T>[],
  params: ParamNode<T> | null,
  wildcardStore: T | null,
];

export type ParamNode<T = unknown> = [child: Node<T> | null, store: T | null];

// Implementations
export const isEmptyNode = (node: Node<any>): boolean =>
  node[1] === null &&
  node[2].length === 0 &&
  node[4] === null &&
  node[5] === null;

export const insertNewParam = <T>(root: Node<T>, path: string, currentIdx: number, value: T): void => {
  // ends with **
  if (
    currentIdx + 2 === path.length &&
    path.charCodeAt(currentIdx + 1) === 42
  ) {
    root[5] = value;
    return;
  }

  // ends with *
  if (currentIdx + 1 === path.length) {
    root[4] = [null, value];
    return;
  }

  // */other/part
  const nextNode: Node<T> = ['/', null, [], [], null, null];
  root[4] = [nextNode, null];
  root = nextNode;

  // Skip `*/`
  insertNewBranch(root, path, currentIdx + 2, value);
}

// Fast path for inserting new branch
export const insertNewBranch = <T>(
  root: Node<T>,
  path: string,
  currentIdx: number,
  value: T,
): void => {
  let startIdx = currentIdx;
  currentIdx = path.indexOf('*', startIdx);

  if (currentIdx > -1) {
    // Add previous path part
    if (startIdx < currentIdx) {
      const nextNode: Node<T> = [
        path.slice(startIdx, currentIdx),
        null,
        [],
        [],
        null,
        null,
      ];

      root[2].push(path.charCodeAt(startIdx));
      root[3].push(nextNode);

      root = nextNode;
    }

    insertNewParam(root, path, currentIdx, value);
  } else {
    // Add the rest of the path
    root[2].push(path.charCodeAt(startIdx));
    root[3].push([path.slice(startIdx), value, [], [], null, null]);
  }
};

// insertToRoot(root, 1 path, 1, value)
// always start checking from index 1 instead of 0
export const insert = <T>(
  root: Node<T>,
  nodePartIdx: number,
  path: string,
  pathIdx: number,
  value: T,
): void => {
  let nodePart = root[0];

  while (pathIdx < path.length) {
    // (path) is longer than (currentPart)
    if (nodePartIdx === nodePart.length) {
      // * or **
      if (path.charCodeAt(pathIdx) === 42) {
        // .../**
        if (
          pathIdx + 2 === path.length &&
          path.charCodeAt(pathIdx + 1) === 42
        ) {
          root[5] = value;
          return;
        }

        if (root[4] === null) {
          insertNewParam(root, path, pathIdx, value);
          return;
        }

        // .../*
        if (pathIdx + 1 === path.length) {
          root[4]![1] = value;
          return;
        }

        // .../*/...
        root = root[4]![0] ??= ['/', null, [], [], null, null];

        nodePartIdx = 1;
        // Always a root node
        nodePart = '/';

        pathIdx += 2;
      } else {
        const childrenFirstChar = root[2];

        // Add new children
        const nextNodeId = childrenFirstChar.indexOf(path.charCodeAt(pathIdx));
        if (nextNodeId === -1) {
          insertNewBranch(root, path, pathIdx, value);
          return;
        }

        // Move to next child node
        root = root[3][nextNodeId];

        nodePartIdx = 1;
        nodePart = root[0];

        pathIdx++;
      }
    }

    // Split the node
    else if (path.charCodeAt(pathIdx) !== nodePart.charCodeAt(nodePartIdx)) {
      // Split the old path
      root[3] = [
        [
          nodePart.slice(nodePartIdx),
          root[1],
          root[2],
          root[3],
          root[4],
          root[5],
        ],
      ];
      root[2] = [nodePart.charCodeAt(nodePartIdx)];

      root[0] = nodePart.slice(0, nodePartIdx);
      root[1] = root[4] = root[5] = null;

      insertNewBranch(root, path, pathIdx, value);
      return;
    }

    // Check next char
    else {
      nodePartIdx++;
      pathIdx++;
    }
  }

  // End of path string but not node part string
  if (nodePartIdx < nodePart.length) {
    // Split the old path
    root[3] = [
      [
        nodePart.slice(nodePartIdx),
        root[1],
        root[2],
        root[3],
        root[4],
        root[5],
      ],
    ];
    root[2] = [nodePart.charCodeAt(nodePartIdx)];

    root[0] = nodePart.slice(0, nodePartIdx);
    root[4] = root[5] = null; // Doesnt need to set root[1] to null bcuz it will later be set
  }

  root[1] = value;
};
