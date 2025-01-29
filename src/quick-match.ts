export default (pattern: string, path: string): string[] | null => {
  const params = [];

  let offset = -1;

  for (let i = 1, tmp: number; i < pattern.length; i++) {
    tmp = pattern.charCodeAt(i);

    // Has a *
    if (pattern.charCodeAt(i) === 42) {
      // Last param
      if (i === pattern.length - 1) {
        if (path.includes('/', i + offset)) return null;
        params.push(path.slice(i + offset));
        return params;
      }

      // Has next part
      if (pattern.charCodeAt(i + 1) === 47) {
        tmp = path.indexOf('/', i + offset);
        if (tmp === -1) return null;

        params.push(path.slice(i + offset, tmp));
        offset += tmp - (i + offset) - 1;
        continue;
      }

      // Wildcard
      params.push(path.slice(i + offset));
      return params;
    }

    if (tmp !== path.charCodeAt(i + offset)) return null;
  }

  // Reach the end of the pattern
  return offset + pattern.length === path.length ? params : null;
};
