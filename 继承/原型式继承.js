/**
 * 原型式继承：通过创建临时构造函数，将传入的对象作为构造函数的原型，并返回临时实例，以达到继承对象属性的效果
 * 适用场景：以一个现有对象作为原型，创建一个新对象
 * 缺点：与原型链继承一样，实例中的引用对象会被共享
 * 补充：原型式继承是 Object.create() 方法实现原理，Object.create() 可以通过第二个参数为新创建的对象添加具有对应属性名称的属性描述符
 */

// 本质上，object() 对传入对象做了一次浅拷贝
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

let person = {
  name: "Nicholas",
  friends: ["Shelby", "Court", "Van"],
};
let anotherPerson = object(person);
anotherPerson.name = "Greg";
anotherPerson.friends.push("Rob");
let yetAnotherPerson = object(person);
yetAnotherPerson.name = "Linda";
yetAnotherPerson.friends.push("Barbie");
console.log(person.friends); // "Shelby,Court,Van,Rob,Barbie"
