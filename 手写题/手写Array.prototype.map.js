Array.prototype._map = function (cb) {
  let res = [];
  for (let i = 0; i < this.length; i++) {
    res[i] = cb(this[i], i, this);
  }

  return res;
};

const arr = [1, 2, 3];

console.log(arr.map((i) => i + 1));
console.log(arr._map((i) => i * 2));
