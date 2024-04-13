/**
 * 组合继承：保留了原型链继承和盗用构造函数继承的优点，
 * 通过原型链继承父类的属性和方法，同时通过盗用构造函数使实例拥有自己的属性
 * 组合继承保留了 instanceOf 和 isPrototypeOf() 方法识别对象的能力
 * 缺点：父类构造函数会被调用两次
 */

function SuperType(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}
SuperType.prototype.sayName = function () {
  console.log(this.name);
};
function SubType(name, age) {
  // 继承属性
  SuperType.call(this, name); // 第二次调用 SuperType 继承属性
  this.age = age;
}
// 继承方法
SubType.prototype = new SuperType(); // 第一次调用 SuperType 继承原型
SubType.prototype.sayAge = function () {
  console.log(this.age);
};

let instance1 = new SubType("Nicholas", 29);
instance1.colors.push("black");
console.log(instance1.colors); // "red,blue,green,black"
instance1.sayName(); // "Nicholas";
instance1.sayAge(); // 29
let instance2 = new SubType("Greg", 27);
console.log(instance2.colors); // "red,blue,green"
instance2.sayName(); // "Greg
