/**
 * 函数柯里化，将能传入多个参数的函数转为能够分批次传入的函数
 * 例如：fn(a,b,c,d) => fn(a)(b)(c)(d)
 */

function ICurry(fn) {
  if (fn.length <= 1) return fn;

  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (...args1) {
        return curried.apply(this, [...args, ...args1]);
      };
    }
  };
}

function fn(a, b, c, d) {
  return a + b + c + d;
}

let fn1 = ICurry(fn);
console.log(fn1(1)(2)(3)(4)); // 10
