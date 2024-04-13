function fn(...args) {
  console.log(args);
  console.log(this.age);

  return this;
}

Function.prototype.ICall = function (_this, ...args) {
  const fn = this;

  thisArg = _this !== undefined && _this !== null ? Object(_this) : globalThis;
  thisArg.fn = fn;
  const res = thisArg.fn(...args);
  delete thisArg.fn;

  return res;
};

Function.prototype.IApply = function (_this, args = []) {
  const fn = this;

  return fn.ICall(_this, ...args);
};

Function.prototype.IBind = function (_this, ...args) {
  const fn = this;
  return function (...args2) {
    return fn.ICall(_this, ...args, ...args2);
  };
};

const obj = { age: 123 };

// console.log(fn.call(obj));
// console.log(fn.ICall(obj));

// console.log(fn.apply(obj));
// console.log(fn.IApply(obj));

console.log(fn.bind(null, 1, 2)(2));
console.log(fn.IBind(null, "test", 2)(3));

// fn.call(obj, 123);
// fn.ICall(obj, 321);

// fn.apply(obj, ["test"]);
// fn.IApply(obj, ["test2"]);
