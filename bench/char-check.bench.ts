import { group, run, bench } from 'mitata';

// Warmup (de-optimize `bench()` calls)
bench('noop', () => { });
bench('noop2', () => { });

group('Cloning', () => {
  const randomString = () => String.fromCharCode(...new Array(10 + (Math.round(Math.random() * 5))).fill(null).map(() => 97 + Math.round(Math.random() * 25)));

  const data = new Array(10000).fill(null).map(() => [randomString(), randomString()] as const);

  const compareChar = (str1: string, str2: string) => {
    for (let i = 0; i < str1.length; i++)
      if (str1[i] !== str2[i])
        return false;
    return true;
  }

  const compareCharCode = (str1: string, str2: string) => {
    for (let i = 0; i < str1.length; i++)
      if (str1.charCodeAt(i) !== str2.charCodeAt(i))
        return false;
    return true;
  }

  bench('Char check', () => data.map((stuff) => compareChar(...stuff)));
  bench('Char code check', () => data.map((stuff) => compareCharCode(...stuff)));
});

// Start the benchmark
run();
