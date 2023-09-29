export const getQueryString = (query: Query) => {
  const stringQuery: StringObject = {};
  for (let key in query) {
    const value = query[key];
    if (typeof value === "string") stringQuery[key] = value;
    else if (typeof value === "number") stringQuery[key] = value.toString();
    else if (typeof value === "boolean") stringQuery[key] = value ? "true" : "false";
  }
  return stringQuery;
};

export const getUrlSearchParams = (query: Query) => {
  const params = new URLSearchParams();
  for (let key in query) {
    const value = query[key];
    if (key === "category_ids" && typeof value === "string" && value) {
      const ids = (value as string).split(",");
      ids.forEach(item => {
        params.append(key, item.toString());
      });
    } else if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      params.append(key, value.toString());
    }
  }
  return params;
};
