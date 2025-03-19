import { Glob } from 'bun';
import { exec } from './utils';

const cmd = process.argv.includes('--node') ? 'bun tsx' : 'bun';

Bun.$.cwd('./bench');
for (const path of new Glob('**/*.bench.ts').scanSync('./bench')) {
  console.log('Running benchmark:', path);
  await exec`${{ raw: cmd }} ./${path}`;
}
