# computed 的实现过程

## 第一步：给每个computed计算属性创建一个watch实例

```javascript
  const watchs = vm._computedWatchers = {},
  for(let key in computed) {
    watchs[key] = new Watch({
      vm,
      computed[key],
      noop,
      { lazy: true }
    })
  }
```

## 第二步：把computed计算属性设置到vm上

```javascript
  Object.defineProperty(vm, key, {
    enumerable: true,
    configuable: true,
    get: getter(key)
    set: () => {}
  })
```

## 第三步：设置getter函数

```javascript
  getter = (key) => () => {
    const watch = vm._computedWatchers[key]
    if (watch.dirty) {
      watch.evalute;
    }

    return watch.value;
  }
```

注意：这里这个dirty相当重要，表示计算属性的值是否被污染了，需要重新计算，默认是true