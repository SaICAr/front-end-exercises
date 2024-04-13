// flat 数组扁平化

const arr = [1, [2, [3, 4, [5]]], [6, 7]];

// 写法一
Array.prototype.IFlat = function (depth) {
  let newArr = [...this];
  let flatDepth = Number(depth) || 1;

  for (let i = 0; i < flatDepth; i++) {
    let tempArr = [];
    newArr.forEach((j) => {
      if (Array.isArray(j)) {
        tempArr = [...tempArr, ...j];
      } else {
        tempArr = [...tempArr, j];
      }
    });

    newArr = tempArr;
    if (newArr.some((j) => Array.isArray(j))) continue;
    else return newArr;
  }

  return newArr;
};

// 优化版本(递归)
Array.prototype._flat = function (depth) {
  let res = [];
  depth--;

  for (const i of this) {
    if (Array.isArray(i) && depth >= 0) {
      res = res.concat(i._flat(depth));
    } else {
      res.push(i);
    }
  }

  return res;
};

console.log(arr.flat(3));
console.log(arr.IFlat(Infinity));
console.log(arr._flat(2));
