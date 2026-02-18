import { summary, run, bench, do_not_optimize } from 'mitata';

summary(() => {
  const paths = [
    'abc',
    'bca',
    'aab',
    'aac',
    'cix',
    'bicop',
    'detod',
    'duei',
    'ckahb',
  ];

  const register = (name: string, fn: (paths: string[]) => void) => {
    bench('add-children - ' + name, function* () {
      yield {
        [0]: () => paths,
        bench: fn,
      };
    });
  };

  {
    register('array with holes', (paths) => {
      const arr: any[] = [];
      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const c = path.charCodeAt(0);

        if (arr[c] == null) arr[c] = path;
        else arr[c] += path;
      }
      do_not_optimize(arr);
    });
  }

  {
    register('arrays', (paths) => {
      const arr: [number[], string[]] = [[], []];
      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const c = path.charCodeAt(0);

        const id = arr[0].indexOf(c);

        if (id > 1) arr[1][id] += path;
        else {
          arr[0].push(id);
          arr[1].push(path);
        }
      }
      do_not_optimize(arr);
    });

    register('array without idx store', (paths) => {
      const arr: string[] = [];
      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        for (let i = 0, c = path.charCodeAt(0); i < arr.length; i++)
          if (arr[i].charCodeAt(0) === c) {
            arr[i] += path;
            continue;
          }

        arr.push(path);
      }
      do_not_optimize(arr);
    });
  }
});

run();
