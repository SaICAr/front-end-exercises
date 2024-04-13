/**
 * 冒泡排序：左右两两比较
 */

const arr = [5, 2, 3, 1, 5, 7, 6, 8];

const bubbleSort = (arr) => {
  // 外层循环：未排序的区间 [0, i]
  for (let i = arr.length - 1; i > 0; i--) {
    // 内层循环：两两比较，较大数放在右侧
    for (let j = 0; j < i; j++) {
      if (arr[j] > arr[j + 1]) {
        // 常规 swap 写法
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        // es6 swap 写法
        // [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
};

// 优化，如果某轮冒泡没有任何交换操作，则表示数组已完成排序，可以直接返回，利用 flag 来标识
function bubbleSortWithFlag(arr) {
  for (let i = arr.length - 1; i > 0; i++) {
    let flag = false;
    for (let j = 0; j < i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        flag = true;
      }
    }
    if (!flag) return;
  }
}

// bubbleSort(arr);
bubbleSortWithFlag(arr);

console.log(arr);
