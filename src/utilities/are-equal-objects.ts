export function areEqualObjects(obj1?: object, obj2?: object): boolean {
  if (!(obj1 || obj2)) throw new Error('At least one object must be defined.');
  // console.log(JSON.stringify(obj1 || {}), JSON.stringify(obj2 || {}));
  return JSON.stringify(obj1 || {}) === JSON.stringify(obj2 || {});
}
