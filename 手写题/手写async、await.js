const generatorToAsync = (genFn) => {
  return function (...args) {
    const gen = genFn.apply(this, args);

    // async 返回的是一个 Promise 对象
    return new Promise((resolve, reject) => {
      const exec = (key, arg) => {
        let res;

        // 使用 try...catch 包裹，如果报错就把 Promise 给 reject 掉，外部可以通过 .catch 捕获
        try {
          // 当执行 gen.throw 时
          // 如果外部 yield 被 try...catch 包裹，那么它会被外部 try...catch 捕获，并且会恢复生成器，返回 { value, done }
          // 如果没有被 try...catch 捕获，那么会从生成器中抛出一个错误
          res = gen[key](arg); // 这里有可能会执行返回 reject 状态的 Promise
        } catch (err) {
          return reject(err); // 报错的话会走 catch，直接 reject
        }

        // gen.next() 得到的结果是一个 { value, done } 的结构
        const { done, value } = res;

        if (done) {
          return resolve(value);
        } else {
          // value 有可能是：常量\Promise，保证返回值是一个 Promise
          // Promise有可能是成功或者失败
          return Promise.resolve(value)
            .then((res) => exec("next", res))
            .catch((err) => exec("throw", err));
        }
      };

      exec("next");
    });
  };
};

// 1秒后打印data1 再过一秒打印data2 最后打印success
const getData = () => new Promise((resolve) => setTimeout(() => resolve("data"), 1000));
var test = generatorToAsync(function* () {
  // await被编译成了yield
  const data = yield getData();
  console.log("data1: ", data);
  let data2;
  try {
    data2 = yield Promise.reject("errhhhh");
    console.log("data2,xxc", data2);
  } catch (error) {
    console.log("err2333", error);
  }

  // throw new Error('error !!!')
  console.log("data2: ", data2);
  const data3 = yield getData();
  console.log("data3: ", data3);
  return "success";
});

test().then(
  (res) => console.log(res)
  // (err) => console.log("err", err)
);
