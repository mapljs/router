import { join } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';

import { format } from 'oxfmt';
import oxfmtrc from '../../.oxfmtrc.jsonc';

import { createRouter, insertItem } from '#self/method/index';
import compile from '#self/method/compiler';
import { PATH } from '#self/constants';

import { SNAPSHOTS } from '../lib/constants.ts';

import { routesList } from '../../tests/routes.ts';

const writeFormatted = async (pathFromSnap: string, content: string) => {
  pathFromSnap = join(SNAPSHOTS, pathFromSnap);
  writeFileSync(pathFromSnap, (await format(pathFromSnap, content, oxfmtrc)).code);
};

{
  //
  // MAIN
  //
  try {
    mkdirSync(SNAPSHOTS);
  } catch {}

  const promises = [];
  for (const [name, routeList] of Object.entries(routesList)) {
    const router = createRouter<string>();
    for (let i = 0; i < routeList.length; i++) {
      const [method, path, id] = routeList[i];
      insertItem(router, method, path, `return "${id}"`);
    }

    promises.push(
      writeFormatted(name + '.js', `(m,${PATH})=>{${compile(router, 'm', 1)}return ''}`),
      writeFormatted(name + '.json', JSON.stringify(router)),
    );
  }
  await Promise.all(promises);
}
