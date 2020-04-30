# $set实现原理

我们知道当修改数组某一项的值，或者给一个对象添加一个属性并赋值时，要调用`$set`方法，那我们看一下vue中是怎么实现的

```javascript
// 数组的实现很简单，实际就是调用splice方法 
if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) 
    return val
  }
  if (!ob) {
    target[key] = val
    return val
  }
  // 让数据变得可观察
  defineReactive(ob.value, key, val)
  // 调用更新
  ob.dep.notify()
  return val
```

