export const getKey = <T extends MixObject>(item: T, matchKeys: (keyof T)[]): string =>
  matchKeys.map(key => (item as any)[key]).join(",");

export const filterDuplicate = <T extends MixObject>(arr: T[], matchKeys: keyof T | (keyof T)[] = "id"): T[] => {
  const seen: { [key: string]: any } = {};
  return arr.filter(item => {
    if (typeof matchKeys !== "object") {
      if (seen[(item as any)[matchKeys]]) return false;
      seen[(item as any)[matchKeys]] = true;
      return true;
    }
    const key = getKey(item, matchKeys);
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });
};

export const mergeArray = <T extends MixObject>(
  oldData: T[],
  newData: T[],
  matchKeys: keyof T | (keyof T)[] = "id"
): T[] => {
  const data = filterDuplicate([...newData, ...oldData], matchKeys);
  // if (oldData.length === data.length) return oldData;
  return data;
};
