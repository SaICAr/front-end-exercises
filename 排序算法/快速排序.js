/**
 * 算法过程：
 * - 选定Pivot中心轴（可以选择最左边的值）
 * - 使用两个指针L、R：分别指向区间最左侧和最右侧
 * - 双指针交替比较，当有符合的情况时，将符合的值放到对应指针下标上，并置换操作指针，例如： 比较R与Pivot值大小
 * -- 若R大于Pivot，则不做操作，往左继续移动
 * -- 若R小于Pivot，则将R值放到L的位置，交替移动L下标
 * - 当双指针重合时，表示该轮排序完毕，将Pivot值放到重合位
 * - 重复以上过程，对左右区间进行排序
 */

const arr = [5, 2, 3, 1, 5, 7, 6, 8];

const quickSort = (arr, L, R) => {
  if (L >= R) return;
  let left = L;
  let right = R;
  let pivot = arr[left];

  while (left < right) {
    // 当大于中心轴时，不做操作，R指针向中间移动
    while (left < right && arr[right] >= pivot) {
      right--;
    }

    // 此时R指向的值小于Pivot，将R值放到L下标上
    if (left < right) {
      arr[left] = arr[right];
    }

    // 指针交替
    // 当小于中心轴时，不做操作，L指针向中间移动
    while (left < right && arr[left] <= pivot) {
      left++;
    }

    // 此时L指向的值大于Pivot，将L值放到R下标上
    if (left < right) {
      arr[right] = arr[left];
    }

    // 双指针下标重合，表示该轮排序结束
    if (left >= right) {
      arr[right] = pivot;
    }
  }

  // 左区间排序
  quickSort(arr, L, right - 1);
  // 右区间排序
  quickSort(arr, right + 1, R);
};

quickSort(arr, 0, arr.length - 1);

console.log(arr);
