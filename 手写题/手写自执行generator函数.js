const requestData = (params) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(params);
    }, 1000);
  });
};

function* getData() {
  const res1 = yield requestData("res1");
  const res2 = yield requestData(res1 + "xxx");
  const res3 = yield requestData(res2 + "ccc");
  const res4 = yield requestData(res3 + "ffff");
  console.log(res4);
}

// 自执行 generator 函数
const execGenerator = (genFn) => {
  const gen = genFn();

  const exec = (res) => {
    const result = gen.next(res);
    if (result.done) {
      return result.value;
    }

    result.value.then(exec);
  };

  exec();
};

execGenerator(getData);
