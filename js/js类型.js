/**
 * js类型分为原始值和引用值
 * 原始值有：undefined、null、boolean、number、string、bigint、symbol
 * 引用值有：object、array、function等
 * 区别：原始值储存在栈内存中，引用值储存在堆内存中；
 * 比较明显的例子：将原始值赋值给一个变量时，是将栈内存中的值赋值给变量，两个变量之间不会相互影响；而将引用值赋值给一个变量时，是将指向堆内存的引用赋值给变量，
 * 两个变量指向的对象是同一个，当修改其中一个变量的对象值时，另一个变量也会被修改被影响
 * 判断方式：
 * * 使用typeof判断原始值
 * * 使用instanceof、Object.prototype.toString.call()、constructor判断引用值
 */

const num = 1;
console.log(typeof num);

// 特殊
console.log(typeof null);
console.log(typeof function () {});

const obj = {
  age: 18,
  name: "小明",
};

console.log(obj instanceof Object);
console.log(Object.prototype.toString.call(obj).slice(8, -1));
console.log(obj.__proto__.constructor === Object);
