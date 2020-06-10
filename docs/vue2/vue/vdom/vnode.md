# vnode

实际`vnode`的实现并没有多复杂，看下面`vnode`的实现就可以知道

```js
/* @flow */

export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  fnContext: Component | void; // real context vm for functional nodes
  fnOptions: ?ComponentOptions; // for SSR caching
  devtoolsMeta: ?Object; // used to store functional render context for devtools
  fnScopeId: ?string; // functional scope id support

  constructor (
    tag?: string, //节点的标签名
    data?: VNodeData, // 节点的数据，实际就是createElement的第二个参数
    children?: ?Array<VNode>, // 
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child (): Component | void {
    return this.componentInstance
  }
}

export const createEmptyVNode = (text: string = '') => {
  const node = new VNode()
  node.text = text
  node.isComment = true
  return node
}

export function createTextVNode (val: string | number) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
export function cloneVNode (vnode: VNode): VNode {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  )
  cloned.ns = vnode.ns
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isComment = vnode.isComment
  cloned.fnContext = vnode.fnContext
  cloned.fnOptions = vnode.fnOptions
  cloned.fnScopeId = vnode.fnScopeId
  cloned.asyncMeta = vnode.asyncMeta
  cloned.isCloned = true
  return cloned
}
```



1. data参数,实际就是createElement的第二个参数，这个参数的内容vue官网有说明

   ```js
   {
     // 与 `v-bind:class` 的 API 相同，
     // 接受一个字符串、对象或字符串和对象组成的数组
     'class': {
       foo: true,
       bar: false
     },
     // 与 `v-bind:style` 的 API 相同，
     // 接受一个字符串、对象，或对象组成的数组
     style: {
       color: 'red',
       fontSize: '14px'
     },
     // 普通的 HTML attribute
     attrs: {
       id: 'foo'
     },
     // 组件 prop
     props: {
       myProp: 'bar'
     },
     // DOM property
     domProps: {
       innerHTML: 'baz'
     },
     // 事件监听器在 `on` 内，
     // 但不再支持如 `v-on:keyup.enter` 这样的修饰器。
     // 需要在处理函数中手动检查 keyCode。
     on: {
       click: this.clickHandler
     },
     // 仅用于组件，用于监听原生事件，而不是组件内部使用
     // `vm.$emit` 触发的事件。
     nativeOn: {
       click: this.nativeClickHandler
     },
     // 自定义指令。注意，你无法对 `binding` 中的 `oldValue`
     // 赋值，因为 Vue 已经自动为你进行了同步。
     directives: [
       {
         name: 'my-custom-directive',
         value: '2',
         expression: '1 + 1',
         arg: 'foo',
         modifiers: {
           bar: true
         }
       }
     ],
     // 作用域插槽的格式为
     // { name: props => VNode | Array<VNode> }
     scopedSlots: {
       default: props => createElement('span', props.text)
     },
     // 如果组件是其它组件的子组件，需为插槽指定名称
     slot: 'name-of-slot',
     // 其它特殊顶层 property
     key: 'myKey',
     ref: 'myRef',
     // 如果你在渲染函数中给多个元素都应用了相同的 ref 名，
     // 那么 `$refs.myRef` 会变成一个数组。
     refInFor: true
   }
   ```

   

