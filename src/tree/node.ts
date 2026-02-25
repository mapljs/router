export interface Node<out T = unknown> {
  /**
   * Part
   */
  0: string;

  /**
   * Store
   */
  1: T | null;

  /**
   * Children first chars
   */
  2: number[];

  /**
   * Children nodes
   */
  3: Node<T>[];

  /**
   * Parameter node
   */
  4: ParamNode<T> | null;

  /**
   * Wildcard store
   */
  5: T | null;
}

export interface ParamNode<out T = unknown> {
  /**
   * Child node
   */
  0: Node<T> | null;

  /**
   * Store
   */
  1: T | null;
}

// Implementations
export const isEmptyNode = (node: Node<any>): boolean =>
  node[1] == null && node[2].length === 0 && node[4] == null && node[5] == null;

export const createRoot = <T>(): Node<T> => ['/', null, [], [], null, null];

// Fast path for inserting new branch
export const insertNewBranch = <T>(
  root: Node<T>,
  path: string,
  startIdx: number,
  nextParamIdx: number,
  value: T,
): void => {
  while (nextParamIdx > -1) {
    // Add previous path part
    if (startIdx < nextParamIdx) {
      const nextNode: Node<T> = [
        path.slice(startIdx, nextParamIdx),
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

    // ends with **
    if (
      nextParamIdx + 2 === path.length &&
      path.charCodeAt(nextParamIdx + 1) === 42
    ) {
      root[5] = value;
      return;
    }

    // ends with *
    if (nextParamIdx + 1 === path.length) {
      root[4] = [null, value];
      return;
    }

    // */other/part
    const nextNode: Node<T> = createRoot();
    root[4] = [nextNode, null];
    root = nextNode;

    startIdx = nextParamIdx + 2;
    nextParamIdx = path.indexOf('*', startIdx);
  }

  // Add the rest of the path
  root[2].push(path.charCodeAt(startIdx));
  root[3].push([path.slice(startIdx), value, [], [], null, null]);
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
          insertNewBranch(root, path, pathIdx, pathIdx, value);
          return;
        }

        // .../*
        if (pathIdx + 1 === path.length) {
          root[4]![1] = value;
          return;
        }

        // .../*/...
        root = root[4]![0] ??= createRoot();

        nodePartIdx = 1;
        // Always a root node
        nodePart = '/';

        pathIdx += 2;
      } else {
        // Add new children
        const nextNodeId = root[2].indexOf(path.charCodeAt(pathIdx));
        if (nextNodeId === -1) {
          insertNewBranch(
            root,
            path,
            pathIdx,
            path.indexOf('*', pathIdx + 1),
            value,
          );
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

      insertNewBranch(root, path, pathIdx, path.indexOf('*', pathIdx), value);
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
