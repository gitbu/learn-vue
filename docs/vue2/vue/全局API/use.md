# Vue.use

vue.use的原理就是你在插件上定义好install方法，当你把插件传入vue.use时，就会调用你在插件上定义的install方法，

例如：

```js
MyComponent.install = (name) => {
  Vue.component('MyComponent', {})
}
```



*src/core/global-api/use.js*

```js
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    const args = toArray(arguments, 1)
    args.unshift(this)
    // 调用我们插件的install方法，第一个参数是Vue，剩余的参数我们传入use的第一参数后边的参数
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    // 最终我们插件都会存储在这个队列里
    installedPlugins.push(plugin)
    return this
  }
```

