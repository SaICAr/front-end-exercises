class EventBus {
  constructor() {
    this.subscriptions = {};
  }

  // 订阅事件
  on(eventName, cb) {
    if (!this.subscriptions[eventName]) {
      this.subscriptions[eventName] = [];
    }

    this.subscriptions[eventName].push(cb);
  }

  // 发布事件
  emit(eventName, ...args) {
    if (this.subscriptions[eventName]) {
      this.subscriptions[eventName].forEach((cb) => {
        cb(...args);
      });
    }
  }

  // 取消订阅事件
  off(eventName, cb) {
    const eventCbs = this.subscriptions[eventName];
    if (eventCbs) {
      this.subscriptions[eventName] = eventCbs.filter((eventCb) => eventCb !== cb);
    }
  }

  // 只订阅一次事件
  once(eventName, cb) {
    const onceCb = (...args) => {
      cb(...args);
      // 执行一次后取消订阅
      this.off(eventName, onceCb);
    };

    this.on(eventName, onceCb);
  }
}

// 示例用法
const eventBus = new EventBus();

// 仅订阅一次事件
eventBus.once("executeOnce", () => {
  console.log("executeOnce!!");
});

const test = (b) => {
  console.log("hello world", b);
};

eventBus.on("test", test);
eventBus.on("test2", (a) => {
  console.log("test2", a);
});

// 发布事件
eventBus.emit("executeOnce"); // 输出：executeOnce!!
eventBus.emit("executeOnce"); // 什么都不会发生
// eventBus.emit("test");
// eventBus.off("test", test);
// eventBus.emit("test");
eventBus.once("test2", test);
