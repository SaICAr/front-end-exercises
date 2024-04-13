/**
 * 寄生式组合继承：通过盗用构造函数继承父类属性，使用混合式原型继承方法
 * 过程：
 * - 通过盗用构造函数继承父类属性
 * - 使用寄生式继承继承父类原型，创建新对象
 * - 指定新对象的 constructor 为子类构造函数
 * - 将新对象设置为子类的原型
 * 优势：解决了组合继承存在的问题
 * - 只调用一次父类构造函数，避免子类原型上添加不必要的属性
 * - 解决重写原型导致默认 constructor 丢失的问题
 */

function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

function inheritPrototype(subType, superType) {
  let prototype = object(superType.prototype); // 创建子类原型对象，继承父类原型
  prototype.constructor = subType; // 增强对象，子类原型的 constructor 属性，指回子类构造函数
  subType.prototype = prototype; // 赋值对象
}

function SuperType(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function () {
  console.log(this.name);
};

function SubType(name, age) {
  SuperType.call(this, name); // 通过盗用构造函数继承属性

  this.age = age;
}

inheritPrototype(SubType, SuperType); // 通过混合式原型链继承方法（原型）

SubType.prototype.sayAge = function () {
  console.log(this.age);
};

const instance1 = new SubType("testName", 18);

instance1.sayName(); // testName
instance1.sayAge(); // 18
console.log(instance1.colors); // [ 'red', 'blue', 'green' ]
