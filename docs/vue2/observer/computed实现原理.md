# computed 的实现过程

说一下我对`computed`使用过程的真实感受，我在用的过程中有两个疑问:

1. 为什么`this`上能访问到计算属性
2. 为什么计算属性会缓存计算属性的值，而普通的`methods`方法不会呢

然后我带着这两个问题去看源码，原来是这个样子的啊



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
    // 这个很重要，这个是让计算属性依赖的data数据去收集RenderWatch
    // 当依赖的data数据修改时，会先更新视图，更新视图时就会访问计算属性
    if （Dep.Target) {
      watch.depend();
    }

    return watch.value;
  }
```

注意：这里这个dirty相当重要，表示计算属性的值是否被污染了，需要重新计算，默认是true