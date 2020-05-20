# component和filter和directive

`Vue.component`、`Vue.filter`、`Vue.directive`这三个都是定义在Vue.options上

*src/shared/constants.js*

```js
export const ASSET_TYPES = [
  'component',
  'directive',
  'filter'
]
```

src/core/global-api/assets.js

```js
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
    		// 这块就是Vue.component的实现
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          definition = this.options._base.extend(definition)
        }
    		// 这个是指令
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
    		// 这个是过滤器
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
```



