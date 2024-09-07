import { group, run, bench } from 'mitata';

// Warmup (de-optimize `bench()` calls)
bench('noop', () => { });
bench('noop2', () => { });

group('Cloning', () => {
  const randomString = () => String.fromCharCode(...new Array(15 + (Math.round(Math.random() * 12))).fill(null).map(() => 97 + Math.round(Math.random() * 25)));

  interface User {
    name: string,
    age: number,
    id: number,
    pwd: string
  }

  const data: [User, string][] = new Array(100000).fill(null).map(() => [{
    name: randomString(),
    age: 15 + Math.round(Math.random() * 30),
    id: Math.round(Math.random() * 1e9),
    pwd: randomString()
  }, randomString()]);

  const cloneFn1 = (user: User, name: string) => ({
    name,
    age: user.age,
    id: user.id,
    pwd: user.pwd
  });

  const cloneFn2 = (user: User, name: string) => ({
    ...user, name
  });

  bench('Manual', () => data.map((stuff) => cloneFn1(...stuff)));
  bench('Spread', () => data.map((stuff) => cloneFn2(...stuff)));
});

// Start the benchmark
run();
