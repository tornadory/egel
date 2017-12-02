export function flatten(arr: any) {
  return arr.reduce((a, b) => {
    return a.concat(b);
  }, []);
}
