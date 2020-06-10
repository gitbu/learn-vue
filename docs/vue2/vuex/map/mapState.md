# mapState

上节我们已经学习了`normalizeNamespace`和`normalizeMap`

```js
export const mapState = normalizeNamespace((namespace, states) => {
  const res = {}
  if (__DEV__ && !isValidMap(states)) {
    console.error('[vuex] mapState: mapper parameter must be either an Array or an Object')
  }
  normalizeMap(states).forEach(({ key, val }) => {
    res[key] = function mappedState () {
      // 这里本质上还是调用this.$store.state，然后返回一个函数，
      // 只不过这里他帮我们做了这样重复的事情
      let state = this.$store.state
      let getters = this.$store.getters
      // 如果有namespace,要先取到module
      if (namespace) {
        const module = getModuleByNamespace(this.$store, 'mapState', namespace)
        if (!module) {
          return
        }
        state = module.context.state
        getters = module.context.getters
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    }
    // mark vuex getter for devtools
    res[key].vuex = true
  })
  return res
})
```

