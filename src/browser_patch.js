// 点击日期时间选择器里边的日期的时候浏览器控制台会报错：
// Unable to preventDefault inside passive event listener invocation.
// 修复 Chrome 被动事件警告

(function () {
  if (typeof EventTarget !== "undefined") {
    let func = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, fn, capture) {
      this.func = func;
      if (typeof capture !== "boolean") {
        capture = capture || {};
        capture.passive = false;
      }
      this.func(type, fn, capture);
    };
  }
})();
