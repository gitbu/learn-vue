# 订阅



## mutation的订阅

```js
  subscribe (fn, options) {
    return genericSubscribe(fn, this._subscribers, options)
  }
```



## action的订阅



```js
  subscribeAction (fn, options) {
    const subs = typeof fn === 'function' ? { before: fn } : fn
    return genericSubscribe(subs, this._actionSubscribers, options)
  }
```



添加对muation和action的订阅

```js
function genericSubscribe (fn, subs, options) {
  if (subs.indexOf(fn) < 0) {
    options && options.prepend
      ? subs.unshift(fn)
      : subs.push(fn)
  }
  return () => {
    const i = subs.indexOf(fn)
    if (i > -1) {
      subs.splice(i, 1)
    }
  }
}
```



## 总结

1. mutation的订阅，commit的时候都会触发
2. action的订阅，dispatch的时候会触发