# Vue.extend

下面就是`extend`的源码,我们逐行分析一下

```js
  Vue.extend = function (extendOptions: Object): Function {
    // 这个就是我们平时写的option
    extendOptions = extendOptions || {}
    // 这个呢其实就是Vue了
    const Super = this
    const SuperId = Super.cid
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
    // 如果该组件已经被用过了，那么就不需要重新创建了，直接从缓存里取走
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    const name = extendOptions.name || Super.options.name
    if (process.env.NODE_ENV !== 'production' && name) {
      validateComponentName(name)
    }

    // 这里就是创建了一个Vue的子类
    const Sub = function VueComponent (options) {
      // 实例化的时候初始化
      this._init(options)
    }
    // 子类的原型指向了Vue的原型
    Sub.prototype = Object.create(Super.prototype)
    // 因为子类的原型重新赋值了，所以这里要把原型的构造函数重新指向Sub
    Sub.prototype.constructor = Sub
    Sub.cid = cid++
    // 父类和子类的option的合并
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )
    Sub['super'] = Super

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    // 把这些属性放在原型上就是要避免每次实例化是去掉用Object.defineProperty
    if (Sub.options.props) {
      initProps(Sub)
    }
    if (Sub.options.computed) {
      initComputed(Sub)
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend
    Sub.mixin = Super.mixin
    Sub.use = Super.use

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type]
    })
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options
    Sub.extendOptions = extendOptions
    Sub.sealedOptions = extend({}, Sub.options)

    // cache constructor
    cachedCtors[SuperId] = Sub
    return Sub
  }

  function initProps (Comp) {
    const props = Comp.options.props
    for (const key in props) {
      proxy(Comp.prototype, `_props`, key)
    }
  }

  function initComputed (Comp) {
    const computed = Comp.options.computed
    for (const key in computed) {
      defineComputed(Comp.prototype, key, computed[key])
    }
  }
```

