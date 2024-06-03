/**
 * sleep函数的作用：延迟n秒后再执行
 */

// 时间戳
function sleep1(fn, delay) {
  const time = new Date().getTime();
  while (new Date().getTime() - time <= delay) {
    continue;
  }

  fn();
}

// 定时器
function sleep2(fn, delay) {
  setTimeout(fn, delay);
}

// promise + 定时器
function sleep3(fn, delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fn());
    }, delay);
  });
}

// async + await + 定时器
async function sleep4(fn, delay) {
  await new Promise((resolve) => {
    setTimeout(resolve, delay);
  });

  fn();
}

function fn() {
  console.log("fn call");
}

sleep1(fn, 2000);
sleep2(fn, 2000);
sleep3(fn, 2000);
sleep4(fn, 2000);
