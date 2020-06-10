

# Vue.observable

*src/core/global-api/index.js*

```js
  Vue.observable = <T>(obj: T): T => {
    observe(obj)
    return obj
    
  }
```

这个observe就是响应式里面observe，就是让数据变得可观察，是一种跨组件存储数据的好办法（这个数据在全局不共享，只在小范围共享）

*src/core/observer/index.js*

```js
export function observe (value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
```

