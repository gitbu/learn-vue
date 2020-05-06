# 异步更新和$nextTick的实现原理

## 异步更新

在讲异步更新之前我们先看一个例子：

```js
<div id="app">
    <div class="people">
        {{name}}{{age}}
			
    </div>
</div>
new Vue({
    el: '#app',
    data: function(){
        return {
            name: ''
            age: ''
        }
    },
    mounted(){
        this.name = 'xm';
        this.age = 18;
        console.log(document.querySelector('.people').offsetHeight //0
    }
})
```

上面的高度是0，但在控制台获取是有值的，为什么，我们回顾一下`Watch`中的update

```javascript
 update () {
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this) // 就是这里的原因
    }
  }
```

就是因为，我们更改了数据，调用update的时候不是直接就更新dom，而是先把更新dom的`Watch`放到一个队列里，如果有重复的会去重。而这个队列里会被`flushSchedulerQueue`遍历调用，而`flushSchedulerQueue`是放在`nextTick`中执行，而`nextTick`的实现实际就是异步执行，下面会降到`nextTick`的实现原理

```javascript
export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
   
    if (!waiting) {
      waiting = true

      nextTick(flushSchedulerQueue)
    }
  }
}

function flushSchedulerQueue () {
  currentFlushTimestamp = getNow()
  flushing = true
  let watcher, id
  
  queue.sort((a, b) => a.id - b.id)
  
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    if (watcher.before) {
      watcher.before()
    }
    id = watcher.id
    has[id] = null
    watcher.run()
  }
```



## $nextTick原理

```js
const callbacks = []
let pending = false

export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    timerFunc()
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}



function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

let timerFunc


if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}



```

