export const prettyString = (s, n = 2) => {
  if (!s.includes(".")) {
    return s;
  }

  const a = s.split(".")[0];
  const b = s.split(".")[1];

  return `${a}.${b.slice(0, n)}`;
};
