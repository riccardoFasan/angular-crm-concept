export function areEqualObjects(obj1?: Object, obj2?: Object): boolean {
  if (!(obj1 || obj2)) throw new Error('At least one object must be defined.');
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
