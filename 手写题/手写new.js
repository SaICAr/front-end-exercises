function _new(constructor, ...args) {
  const obj = {};
  obj.__proto__ = constructor.prototype;
  const res = constructor.apply(obj, args);
  return res instanceof Object ? res : obj;
}

function Person() {
  this.name = "xiaoming";
  this.hobby = "lanqiu";

  return null;
}

const person = _new(Person);
console.log(person instanceof Person, person);

const p2 = new Person();
console.log(p2 instanceof Person, person);
