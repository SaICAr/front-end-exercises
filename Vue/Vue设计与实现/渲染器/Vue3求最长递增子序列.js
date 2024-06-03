function getSequence(arr) {
  const p = arr.slice(); // 前驱索引数组
  const result = [0]; // 保存最长递增子序列的索引
  const len = arr.length; // 输入数组的长度
  let i, j, u, v, c; // 临时变量

  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      // 跳过值为0的元素
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        // 如果当前元素大于LIS中的最后一个元素
        p[i] = j; // 记录前驱
        result.push(i); // 将当前元素添加到LIS末尾
        continue;
      }

      // 二分查找当前元素应该插入的位置
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = ((u + v) / 2) | 0; // 取中间位置
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }

      // 用当前元素替换result中合适位置的元素
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1]; // 记录前驱
        }
        result[u] = i; // 替换元素
      }
    }
  }

  // 重构LIS
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p[v]; // 回溯前驱
  }

  return result;
}

console.log(getSequence([2, 4, 3, 5, 1, 7, 9]));
