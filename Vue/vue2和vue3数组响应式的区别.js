// vue3 对数组响应式的处理

// proxy
function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      console.log("get track", key);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      console.log("set trigger", key);
      return Reflect.set(target, key, value, receiver);
    },
  });
}

const arr = [1, 2, 3];
// const arrProxy = reactive(arr);

// arrProxy[0];

// arrProxy[0] = 2;

// arrProxy.pop();

// console.log(arr);

// vue2 Object.defineProperty() 实现数组元素的依赖收集
// 重写 Array 原型上的方法 比如：pop，push... 来实现响应式

for (let i = 0; i < arr.length; i++) {
  let value = arr[i];
  Object.defineProperty(arr, i, {
    get() {
      console.log("get track", i);
      return value;
    },
    set(newValue) {
      if (value !== newValue) {
        console.log("set trigger", i);
        value = newValue;
      }
    },
  });
}

// arr[1];
// arr[1] = 3;

// arr[3] = 5;
arr.push(4, 5);

// console.log(arr.map((i) => i));

console.log(arr);

// 重写 Array.prototype.push 方法，使其能够处理响应式

// const originalPush = Array.prototype.push;

Array.prototype.push = function (...args) {
  const result = originalPush.apply(this, args);

  //  dep.notify()触发依赖

  return result;
};
