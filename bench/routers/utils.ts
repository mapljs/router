import pc from 'picocolors';

const charset =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$';

export const list = <T>(n: number, fn: (i: number) => T): T[] =>
  new Array(n).fill(null).map((_, i) => fn(i));
export const malformPathActions: ((path: string) => string)[] = [
  // Delete one part
  (path) => {
    const parts = path.split('/');
    return parts.splice(rand.int(1, parts.length - 1), 1).join('/');
  },
];

export const rand = {
  string: (len: number) => {
    let res = '';
    for (let i = 0; i < len; i++) res += rand.item(charset);
    return res;
  },
  bool: () => Math.random() > 0.5,
  float: (min: number, max: number) => min + Math.random() * (max - min),
  int: (min: number, max: number) => Math.round(rand.float(min, max)),
  item: <T = string>(arr: T[] | string): T =>
    arr[rand.int(0, arr.length - 1)] as any,

  path: (pattern: string): { path: string; params: string[] } => {
    if (pattern.endsWith('**'))
      pattern =
        pattern.slice(0, -2) +
        list(rand.int(1, 3), () => rand.string(rand.int(3, 5))).join('/');

    const params: string[] = [];
    pattern = pattern.replace(/\*/g, () => {
      const item = rand.string(rand.int(2, 10));
      params.push(item);
      return item;
    });
    return { path: pattern, params };
  },

  invalid: <T>(items: T[], invalidCases: T[]): T[] => {
    for (
      let i = items.length - 1, cnt = invalidCases.length - 1;
      cnt >= 0 && i >= 0;
      i++
    ) {
      if (rand.bool()) items[i] = invalidCases[cnt--];
    }

    return items;
  },
};

const createUnitFormat = (units: string[]) => (n: number) => {
  let i = 0;
  while (n >= 1000 && i < units.length - 1) {
    i++;
    n /= 1000;
  }
  return pc.yellowBright(n.toFixed(2) + units[i]);
};

export const format = {
  time: createUnitFormat(['ns', 'us', 'ms', 's']),
  name: (name: string) => pc.bold(pc.cyan(name)),
  multiplier: (t: number) => pc.greenBright(t.toFixed(2) + 'x'),
  header: pc.bold,
  success: pc.greenBright,
  error: pc.redBright,
};

export const RUNTIME = globalThis.Bun
  ? 'bun_' + process.versions.bun
  : 'node_' + process.versions.node;
