# createElement的实现

下面这段文字是引用vue官网的，对render函数的一个说明，我们看一个看到有一个`createElement`的参数，那这个`createElement`又是怎么实现的呢

> render
> 类型**：`(createElement: () => VNode) => VNode`
>
> **详细**：
>
> 字符串模板的代替方案，允许你发挥 JavaScript 最大的编程能力。该渲染函数接收一个 `createElement` 方法作为第一个参数用来创建 `VNode`。
>
> 如果组件是一个函数组件，渲染函数还会接收一个额外的 `context` 参数，为没有实例的函数组件提供上下文信息。
>
> Vue 选项中的 `render` 函数若存在，则 Vue 构造函数不会从 `template` 选项或通过 `el` 选项指定的挂载元素中提取出的 HTML 模板编译渲染函数。



通过上一节组件更新概览我们就可以知道render函数的这个参数`createElement`就是下面的`vm.$createElement`

```js

vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
```



那我们就看一下`createElement`的具体实现

```js
export function createElement (
  context: Component, // 上下文，实际就是指当前vue的实例
  tag: any, // 一个 HTML 标签名、组件选项对象，或者 resolve 了上述任何一种的一个 async 函数。必填项。
  data: any, // 模板中 attribute 对应的数据对象
  children: any, // 子级虚拟节点 (VNodes)，由 `createElement()` 构建而成
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  // 如果data不是个对象的话，那么说明data就是children
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE
  }
  return _createElement(context, tag, data, children, normalizationType)
}

export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
  if (isDef(data) && isDef((data: any).__ob__)) {
    return createEmptyVNode()
  }
  // 动态组件的判断 <component v-bind:is="currentTabComponent"></component>
  if (isDef(data) && isDef(data.is)) {
    tag = data.is
  }
  // 如果没有了就创建一个空的vnode
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // 
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {}
    data.scopedSlots = { default: children[0] }
    children.length = 0
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children)
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children)
  }
  let vnode, ns
  // 如果是html标签元素的话直接创建vnode
  if (typeof tag === 'string') {
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    if (config.isReservedTag(tag)) {
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      )
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      )
    }
  } else {
    // 如果是组件的话就需要先创建
    vnode = createComponent(tag, data, context, children)
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) applyNS(vnode, ns)
    if (isDef(data)) registerDeepBindings(data)
    return vnode
  } else {
    return createEmptyVNode()
  }
}
```

