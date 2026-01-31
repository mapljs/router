import { summary, run, bench } from 'mitata';

summary(() => {
  const register = (
    name: string,
    fn: (str: string, startIdx: number) => boolean,
  ) => {
    bench(name, function* () {
      yield {
        [0]: () =>
          'a' +
          (Math.random() < 0.5 ? 'abcdefgh' : 'abcdefghakfaj').slice(1, -1),
        [1]: () => 1,
        bench: fn,
      };
    });
  };

  register(
    '4 char - startsWith',
    (s, i) => s.length > i + 4 && s.startsWith('bcde', i),
  );
  register(
    '4 char - indexOf',
    (s, i) => s.length > i + 4 && s.indexOf('bcde', i) === i,
  );
  register(
    '4 char - charCodeAt',
    (s, i) =>
      s.length > i + 4 &&
      s.charCodeAt(i) === 98 &&
      s.charCodeAt(i + 1) === 99 &&
      s.charCodeAt(i + 2) === 100 &&
      s.charCodeAt(i + 3) === 101,
  );
  register(
    '4 char - string compare',
    (s, i) =>
      s.length > i + 4 &&
      s[i] === 'b' &&
      s[i + 1] === 'c' &&
      s[i + 2] === 'd' &&
      s[i + 3] === 'e',
  );
});

run();
