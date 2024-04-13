const MyInstanceOf = (target, origin) => {
  // 判断是否是引用类型
  if (typeof target !== "object" && typeof target !== "function" && target !== null) {
    return false;
  }

  let proto = target.__proto__;

  while (proto) {
    if (proto === origin.prototype) {
      return true;
    }

    proto = proto.__proto__;
  }

  return false;
};

function People() {
  this.name = "james";
  this.age = 18;
}

const p1 = new People();

console.log(MyInstanceOf(p1, People));
console.log(MyInstanceOf({}, People));
