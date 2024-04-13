/**
 * Promise 的基本原理：
 * - Promise 是一个类，执行类的时候会传入一个执行器，该执行器会立即执行
 * - Promise 有三种状态：
 * -- Pending 等待
 * -- Fulfilled 完成
 * -- Rejected 失败
 * - Promise 中使用 resolve 和 reject 两个回调函数来改变 Promise 的状态
 * - 状态只能由 Pending => Fulfilled 或 Pending => Rejected，且状态只能改变一次
 * - then 方法内部做的事情就是状态判断
 * -- Fulfilled 状态，调用成功的回调
 * -- Rejected 状态，调用失败的回调
 */

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

// function resolvePromise(promise2, x, resolve, reject) {
//   // 如果相等了，说明 return 的是自己，抛出类型错误并返回
//   if (promise2 === x) {
//     return reject(new TypeError("Chaining cycle detected for promise #<Promise>"));
//   }

//   // 判断 x 是否是 MyPromise 实例
//   if (x instanceof MyPromise) {
//     // 执行 x 的 then 方法，目的是将 promise2 的状态变为 fulfilled 或者 rejected
//     x.then(resolve, reject);
//   } else {
//     resolve(x);
//   }
// }

function resolvePromise(promise, x, resolve, reject) {
  // 如果相等了，说明return的是自己，抛出类型错误并返回
  if (promise === x) {
    return reject(new TypeError("The promise and the return value are the same"));
  }

  if (typeof x === "object" || typeof x === "function") {
    // x 为 null 直接返回，走后面的逻辑会报错
    if (x === null) {
      return resolve(x);
    }

    let then;
    try {
      // 把 x.then 赋值给 then
      then = x.then;
    } catch (error) {
      // 如果取 x.then 的值时抛出错误 error ，则以 error 为据因拒绝 promise
      return reject(error);
    }

    // 如果 then 是函数
    if (typeof then === "function") {
      let called = false;
      try {
        then.call(
          x, // this 指向 x
          // 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
          (y) => {
            // 如果 resolvePromise 和 rejectPromise 均被调用，
            // 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
            // 实现这条需要前面加一个变量 called
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          },
          // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } catch (error) {
        // 如果调用 then 方法抛出了异常 error：
        // 如果 resolvePromise 或 rejectPromise 已经被调用，直接返回
        if (called) return;

        // 否则以 error 为据因拒绝 promise
        reject(error);
      }
    } else {
      // 如果 then 不是函数，以 x 为参数执行 promise
      resolve(x);
    }
  } else {
    // 如果 x 不为对象或者函数，以 x 为参数执行 promise
    resolve(x);
  }
}

class MyPromise {
  state = PENDING;
  value = null;
  reason = null;
  // 存储成功的回调函数
  onFulfilledCallbacks = [];
  // 存储失败的回调函数
  onRejectedCallbacks = [];

  constructor(executor) {
    // resolve和reject为什么要用箭头函数？
    // 如果直接调用的话，普通函数this指向的是window或者undefined
    // 用箭头函数就可以让this指向当前实例对象

    // 变更为成功状态
    const resolve = (value) => {
      if (this.state === PENDING) {
        // 当 resolve() 传入一个 MyPromise 实例时，当前 MyPromise 对象的状态和值都由传入的实例决定
        if (value instanceof MyPromise) {
          return resolvePromise(this, value, resolve, reject);
        }

        this.state = FULFILLED;
        this.value = value;

        // 执行所有 fulfilled 回调
        this.onFulfilledCallbacks.forEach((cb) => {
          cb(this.value);
        });
      }
    };

    // 变更为失败状态
    const reject = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.reason = reason;

        // 执行所有 rejected 回调
        this.onRejectedCallbacks.forEach((cb) => {
          cb(this.reason);
        });
      }
    };

    try {
      // executor 是一个执行器，进入会立即执行
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    // 设置默认回调
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    // 返回新 MyPromise 对象是 then 链式调用的关键
    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledMicrotask = () => {
        // 放入微任务队列执行
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      };

      const rejectedMicrotask = () => {
        // 放入微任务队列执行
        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      };

      if (this.state === FULFILLED) {
        fulfilledMicrotask();
      } else if (this.state === REJECTED) {
        rejectedMicrotask();
      } else if (this.state === PENDING) {
        // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
        // 等到执行成功或失败函数的时候再传递
        // 这一步是可以多次调用 then 的关键
        this.onFulfilledCallbacks.push(fulfilledMicrotask);
        this.onRejectedCallbacks.push(rejectedMicrotask);
      }
    });

    return promise2;
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  finally(onFinally) {
    return this.then(onFinally, onFinally);
  }

  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }

    return new MyPromise((resolve) => {
      resolve(value);
    });
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }

  static race(iterable) {
    return new MyPromise((resolve, reject) => {
      iterable.forEach((item) => {
        // 通过 Promise.resolve() 将非 Promise 的值转为 Promise对象，防止拿不到 then 方法
        MyPromise.resolve(item).then(resolve, reject);
      });
    });
  }

  static any(iterable) {
    return new MyPromise((resolve, reject) => {
      // 保存所有错误原因
      const reasons = [];

      iterable.forEach((item) => {
        MyPromise.resolve(item).then(resolve, (err) => {
          reasons.push(err);

          // 当所有 promise 都为 rejected 时，抛出 AggregateError 错误
          if (reasons.length === iterable.length) {
            reject(new AggregateError(reasons, "All promises were rejected"));
          }
        });
      });
    });
  }

  static all(iterable) {
    return new MyPromise((resolve, reject) => {
      // 保存所有成功结果
      const values = [];

      iterable.forEach((item) => {
        MyPromise.resolve(item).then((res) => {
          values.push(res);
          // 当所有 promise 都为 fulfilled 时，返回 fulfill 状态的新 promise，且结果为所有成功 promise 结果的数组
          if (values.length === iterable.length) {
            resolve(values);
          }
        }, reject);
      });
    });
  }

  static allSettled(iterable) {
    return new MyPromise((resolve, reject) => {
      // 保存所有结果
      const results = [];

      iterable.forEach((item) => {
        MyPromise.resolve(item).then(
          (res) => {
            results.push({
              status: "fulfilled",
              value: res,
            });

            if (results.length === iterable.length) {
              resolve(results);
            }
          },
          (err) => {
            results.push({
              status: "rejected",
              reason: err,
            });

            if (results.length === iterable.length) {
              resolve(results);
            }
          }
        );
      });
    });
  }
}

// const promise = MyPromise.reject("err");
// const p1 = new MyPromise((resolve) => {
//   setTimeout(() => {
//     resolve(1111);
//   }, 1000);
// });
// const p2 = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     reject(2222);
//   }, 2000);
// });
// const p3 = new MyPromise((resolve) => {
//   setTimeout(() => {
//     resolve(3333);
//   }, 3000);
// });
// const promise1 = MyPromise.race([p1, p2, p3]);

// promise1.then(
//   (res) => {
//     console.log(res);
//   },
//   (err) => {
//     console.log(err);
//   }
// );

// const failure = new MyPromise((resolve, reject) => {
//   reject("总是失败");
// });

// MyPromise.allSettled([p1, p2, p3]).then(
//   (res) => console.log(res),
//   (err) => console.log("err", err)
// );

// const promise = Promise.reject("err");
// const promise1 = Promise.resolve(promise);

// promise1
//   .then(
//     (res) => {
//       console.log("res", res);
//     },
//     (err) => {
//       console.log("err1", err);
//       return promise;
//     }
//   )
//   .then(
//     (res) => {
//       console.log("res2", res);
//     },
//     (err) => {
//       console.log("err2", err);
//     }
//   );

try {
  // const p = Promise.reject("errhhhh");
  new MyPromise((resolve, reject) => {
    throw new Error("err");
  });
} catch (err) {
  console.log("err2333", err);
}

console.log("test");
