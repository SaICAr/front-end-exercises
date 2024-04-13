/**
 * 盗用构造函数继承：子类通过 call、apply 的方式继承父类的属性和方法
 * 优点：子类创建的实例有属于自己的属性，子类构造函数可以向父类传参
 * 缺点：
 * - 子类无法访问父类原型，同时共享的属性和方法需要在构造函数中定义，且方法无法被复用
 * - 无法通过 instanceOf 和 isPrototypeOf() 识别对象
 */
function SuperType(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}
function SubType() {
  // 继承SuperType
  SuperType.call(this, "xxname");
}
let instance1 = new SubType();
instance1.colors.push("black");
console.log(instance1.colors); // "red,blue,green,black"
let instance2 = new SubType();
console.log(instance2.colors); // "red,blue,green"
console.log(instance2.name);

console.log(instance1 instanceof SuperType);
