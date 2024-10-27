export const samplePaths = [
  '/',
  '/about',

  '/*',
  '/*/navigate',
  '/**',

  '/user/*',
  '/user/*/dashboard/**',

  '/category/*',
  '/category/*/filter/*',
  '/category/*/filter/*/exclude'
], samplePathsLen = samplePaths.length;

export const resultPaths = samplePaths.map((pattern) => pattern.endsWith('**') ? pattern.substring(1, pattern.length - 2) + '1/2/3' : pattern.slice(1));
