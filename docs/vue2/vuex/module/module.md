# module



```js
export default class Module {
  constructor (rawModule, runtime) {
    this.runtime = runtime
    // Store some children item
    this._children = Object.create(null)
    // Store the origin module object which passed by programmer
    this._rawModule = rawModule
    const rawState = rawModule.state

    // Store the origin module's state
    this.state = (typeof rawState === 'function' ? rawState() : rawState) || {}
  }

  // 获取命名空间
  get namespaced () {
    return !!this._rawModule.namespaced
  }

  // 添加子module
  addChild (key, module) {
    this._children[key] = module
  }

  // 移除子module
  removeChild (key) {
    delete this._children[key]
  }

  // 获取子module
  getChild (key) {
    return this._children[key]
  }

  // 是否存在子module
  hasChild (key) {
    return key in this._children
  }

  // 更新module
  update (rawModule) {
    this._rawModule.namespaced = rawModule.namespaced
    if (rawModule.actions) {
      this._rawModule.actions = rawModule.actions
    }
    if (rawModule.mutations) {
      this._rawModule.mutations = rawModule.mutations
    }
    if (rawModule.getters) {
      this._rawModule.getters = rawModule.getters
    }
  }

  // 遍历子module节点
  forEachChild (fn) {
    forEachValue(this._children, fn)
  }

  // 遍历getter
  forEachGetter (fn) {
    if (this._rawModule.getters) {
      forEachValue(this._rawModule.getters, fn)
    }
  }

  // 遍历action
  forEachAction (fn) {
    if (this._rawModule.actions) {
      forEachValue(this._rawModule.actions, fn)
    }
  }

  // 遍历mutation
  forEachMutation (fn) {
    if (this._rawModule.mutations) {
      forEachValue(this._rawModule.mutations, fn)
    }
  }
}
```



`forEachValue`:遍历对象，把value和key作为参数传入fn中

```js
export function forEachValue (obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}
```

