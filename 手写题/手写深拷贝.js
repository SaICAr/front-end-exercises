const deepClone = (target, map = new WeakMap()) => {
  if (!isObject(target)) return target;
  if (map.has(target)) return map.get(target);
  // 兼容数组和对象
  const newObj = Array.isArray(target) ? [] : {};
  // 使用 map 存储已拷贝过的对象，避免循环拷贝和重复拷贝
  map.set(target, newObj);
  // 仅拷贝自身属性
  for (const key of Object.keys(target)) {
    newObj[key] = deepClone(target[key], map);
  }

  return newObj;
};

const isObject = (target) => {
  return typeof target === "object" && target !== null;
};

// 示例
let info = { item: 1 };

let obj = {
  key1: info,
  key2: info,
  list: [1, 2],
};

// 循环引用深拷贝示例
obj.key3 = obj;
let val = deepClone(obj);
console.log(val);
console.log(obj.key1 === obj.key2);
