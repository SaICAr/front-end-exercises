const arr = [5, 2, 3, 1, 5, 7, 6, 8];

const selectionSort = (arr) => {
  // 外循环：排序进行多少轮
  for (let i = 0; i < arr.length - 1; i++) {
    let k = i;
    // 内循环：找到 [i + 1, len - 1] 区间最小值
    for (let j = i + 1; j < arr.length; j++) {
      // 寻找最小值
      if (arr[j] < arr[k]) {
        k = j; // 记录最小值索引
      }
    }

    // 如果最小值索引不是当前头部，则两两交换
    if (k !== i) {
      [arr[i], arr[k]] = [arr[k], arr[i]];
    }
  }
};

selectionSort(arr);
console.log(arr);
