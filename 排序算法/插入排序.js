const arr = [5, 2, 3, 1, 5, 7, 6, 8];

const insertSort = (arr) => {
  for (let i = 1; i < arr.length; i++) {
    // 记录基准值
    const base = arr[i];
    let j = i - 1;
    // 循环判断左侧的值是否大于基准值
    // 若大于，则向右移
    while (j >= 0 && arr[j] > base) {
      arr[j + 1] = arr[j]; // 向右移动一位
      j--;
    }

    // 将 base 赋值到正确位置
    // 至于为什么要 +1 因为循环多减了一次
    arr[j + 1] = base;
  }
};

insertSort(arr);
console.log(arr);
