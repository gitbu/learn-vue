# patch

*src/platforms/web/runtime/index.js*

```js
Vue.prototype.__patch__ = inBrowser ? patch : noop
```

这个实际核心两个点：一个是获取操作Dom的Api，还要一个是元素上的一些属性和方法的设置

*src/platforms/web/runtime/patch.js*

```js
import * as nodeOps from 'web/runtime/node-ops'
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index'
import platformModules from 'web/runtime/modules/index'
const modules = platformModules.concat(baseModules)

export const patch: Function = createPatchFunction({ nodeOps, modules })
```



modules就是对正式dom的各种操作，一些样式、类、属性、事件的处理

*src/platforms/web/runtime/modules/index.js*

```js
import attrs from './attrs'
import klass from './class'
import events from './events'
import domProps from './dom-props'
import style from './style'
import transition from './transition'

export default [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
]

```



这个就是接受两个参数，modules和nodeOps，这个`createPatchFunction`太大了，我们拆开一块一块讲，我们先讲这个函数的return部分

*src/core/vdom/patch.js*

```js
export function createPatchFunction (backend) {
  let i, j
  const cbs = {}

  const { modules, nodeOps } = backend

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = []
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]])
      }
    }
  } 
  // 这个oldVnode就是老的Vnode,Vnode就是新的Vnode
  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    	// 如果新的Vnode不存在就删除老的
      if (isUndef(vnode)) {
        if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
        return
      }

      let isInitialPatch = false
      const insertedVnodeQueue = []

      // 如果老的不在，那么就直接创建新的
      if (isUndef(oldVnode)) {
        // empty mount (likely as component), create new root element
        isInitialPatch = true
        createElm(vnode, insertedVnodeQueue)
      } else {
        const isRealElement = isDef(oldVnode.nodeType)
        // 如果老的Vnode不是一个原生的元素的话,并且新老的key和名字都相同，直接去pathVnode
        if (!isRealElement && sameVnode(oldVnode, vnode)) {
          // patch existing root node
          patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
        } else {
          if (isRealElement) {
            // mounting to a real element
            // check if this is server-rendered content and if we can perform
            // a successful hydration.
            if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
              oldVnode.removeAttribute(SSR_ATTR)
              hydrating = true
            }
            if (isTrue(hydrating)) {
              if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                invokeInsertHook(vnode, insertedVnodeQueue, true)
                return oldVnode
              } else if (process.env.NODE_ENV !== 'production') {
                warn(
                  'The client-side rendered virtual DOM tree is not matching ' +
                  'server-rendered content. This is likely caused by incorrect ' +
                  'HTML markup, for example nesting block-level elements inside ' +
                  '<p>, or missing <tbody>. Bailing hydration and performing ' +
                  'full client-side render.'
                )
              }
            }
            // either not server-rendered, or hydration failed.
            // create an empty node and replace it
            oldVnode = emptyNodeAt(oldVnode)
          }

          // replacing existing element
          const oldElm = oldVnode.elm
          const parentElm = nodeOps.parentNode(oldElm)

          // create new node
          // 创建一个新的元素
          createElm(
            vnode,
            insertedVnodeQueue,
            // extremely rare edge case: do not insert if old element is in a
            // leaving transition. Only happens when combining transition +
            // keep-alive + HOCs. (#4590)
            oldElm._leaveCb ? null : parentElm,
            nodeOps.nextSibling(oldElm)
          )

          // update parent placeholder node element, recursively
          if (isDef(vnode.parent)) {
            let ancestor = vnode.parent
            const patchable = isPatchable(vnode)
            while (ancestor) {
              for (let i = 0; i < cbs.destroy.length; ++i) {
                cbs.destroy[i](ancestor)
              }
              ancestor.elm = vnode.elm
              if (patchable) {
                for (let i = 0; i < cbs.create.length; ++i) {
                  cbs.create[i](emptyNode, ancestor)
                }
                // #6513
                // invoke insert hooks that may have been merged by create hooks.
                // e.g. for directives that uses the "inserted" hook.
                const insert = ancestor.data.hook.insert
                if (insert.merged) {
                  // start at index 1 to avoid re-invoking component mounted hook
                  for (let i = 1; i < insert.fns.length; i++) {
                    insert.fns[i]()
                  }
                }
              } else {
                registerRef(ancestor)
              }
              ancestor = ancestor.parent
            }
          }

          // destroy old node
          if (isDef(parentElm)) {
            removeVnodes([oldVnode], 0, 0)
          } else if (isDef(oldVnode.tag)) {
            invokeDestroyHook(oldVnode)
          }
        }
      }

      invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
      return vnode.elm
    }
}
```

