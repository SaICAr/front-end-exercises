/**
 * 寄生式继承：寄生构造函数和工厂模式，创建一个实现继承的函数，以某种方式增强这个对象，然后返回这个对象
 * 适用场景：适合主要关注对象，而不在乎类型和构造函数的场景
 * 缺点：通过寄生式继承给对象添加函数会导致函数难以重用，与构造函数模式类似
 */

function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

function createAnother(original) {
  // clone.__proto__ === original
  let clone = object(original); // 通过调用函数创建一个新对象，继承传入对象的属性

  console.log(clone.__proto__ === original); // true

  // 以某种方式增强这个对象
  clone.sayHi = function () {
    console.log("hi");
  };
  return clone; // 返回这个对象
}

let person = {
  name: "Nicholas",
  friends: ["Shelby", "Court", "Van"],
};
let anotherPerson = createAnother(person);
let anotherPerson1 = createAnother(person);
anotherPerson.sayHi(); // "hi"

console.log(anotherPerson.sayHi === anotherPerson1.sayHi); // false 方法无法复用

console.log(anotherPerson.__proto__);
