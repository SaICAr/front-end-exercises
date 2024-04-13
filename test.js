const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const processInput = async (rl, question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

const prompt2Input = async (prompt) => {
  return processInput(rl, prompt);
};

const inOrderExecPromise = async (promises) => {
  const results = [];
  if (promises.length < 1) return results;

  for (let i = 0; i < promises.length; i++) {
    results[i] = await promises[i];
  }

  return results;
};

const test = async () => {
  const prompts = ["请输入小说类别：", "请输入小说代码：", "请输入小说章节代码：", "请输入小说名称："];
  const promiseFns = prompts.map((prompt) => () => prompt2Input(prompt));
  const inputs = await inOrderExecPromise(promiseFns);
  console.log(inputs);
};

test();
