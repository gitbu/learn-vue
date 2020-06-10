# mapXXX原理解析



## 公共函数功能介绍

### normalizeNamespace

* 功能：规范命名空间，不管传不传入`namespace`，最终调用`fn`的时候都要传入`namespace`和`map`

```js
function normalizeNamespace (fn) {
  return (namespace, map) => {
    if (typeof namespace !== 'string') {
      map = namespace
      namespace = ''
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/'
    }
    return fn(namespace, map)
  }
}
```

* 例子：

```js
// 没有命名空间的用法
computed: mapState([
  // 映射 this.count 为 store.state.count
  'count'
])
// 有命名空间的用法
computed: {
  ...mapState('some/nested/module', {
    a: state => state.a,
    b: state => state.b
  })
},
```



### normalizeMap

* 功能： 规范Map,不管是数组还是对象，最后对外输出的就是一个`[{key: 'key', val: 'val'}, ...]`的结构

```js
function normalizeMap (map) {
  if (!isValidMap(map)) {
    return []
  }
  return Array.isArray(map)
    ? map.map(key => ({ key, val: key }))
    : Object.keys(map).map(key => ({ key, val: map[key] }))
}
```

* 例子：

```js
// 对象形式
computed: mapState({
    // 箭头函数可使代码更简练
    count: state => state.count,

    // 传字符串参数 'count' 等同于 `state => state.count`
    countAlias: 'count',

    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
})

// 数组形式
computed: mapState([
  // 映射 this.count 为 store.state.count
  'count'
])
```



### getModuleByNamespace

* 功能：通过namespace获取module

```js
function getModuleByNamespace (store, helper, namespace) {
  const module = store._modulesNamespaceMap[namespace]
  if (__DEV__ && !module) {
    console.error(`[vuex] module namespace not found in ${helper}(): ${namespace}`)
  }
  return module
}
```

