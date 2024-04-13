// 原型继承，缺点：原型中包含的引用值会被所有实例共享
function SuperType() {
  this.colors = ["red", "blue", "green"];
}
function SubType() {}
// 继承SuperType（superInstance.__proto__ = SuperType.prototype）
// superInstance = { colors: ["red", "blue", "green"] }
SubType.prototype = new SuperType(); // (SubType.prototype = superInstance).__proto__ = SuperType.prototype
let instance1 = new SubType(); // (instance1.__proto__ = SubType.prototype = superInstance).__proto__ = SuperType.prototype
instance1.colors.push("black");
console.log(instance1.colors); // "red,blue,green,black"
let instance2 = new SubType(); // (instance2.__proto__ = SubType.prototype = superInstance).__proto__ = SuperType.prototype
console.log(instance2.colors); // "red,blue,green,black"

SuperType.prototype.getColor = function () {
  console.log(this);
  console.log(this.colors, "colors");
};

instance1.getColor();
instance2.getColor();
