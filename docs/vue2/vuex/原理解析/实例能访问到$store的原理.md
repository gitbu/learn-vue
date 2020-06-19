# 实例能访问到$store的原理

大家看代码的几个高亮部分,核心原理就是，**应用了`Vue.mixin`这个Api的功能**



```javascript {25,47-49}
// 如果Vue在window上，直接install
if (!Vue && typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (__DEV__) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    }
    return
  }
  Vue = _Vue
  // 调用Vue
  applyMixin(Vue)
}

export default function (Vue) {
  const version = Number(Vue.version.split('.')[0])

  if (version >= 2) {
    // 把vueInit混入beforeCreate的生命周期，这里的意思就是后面每个Vue的实例创建都会调用vueInit
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      // 这里就解释了为什么我们通过this.$store能访问到传入到Vue的store
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}
```

