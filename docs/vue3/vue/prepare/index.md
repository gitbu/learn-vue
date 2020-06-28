1，压缩包体积更小
当前最小化并被压缩的 Vue 运行时大小约为 20kB（2.6.10 版为 22.8kB）。Vue 3.0捆绑包的大小大约会减少一半，即只有10kB！

2，Object.defineProperty -> Proxy
Object.defineProperty是一个相对比较昂贵的操作，因为它直接操作对象的属性，颗粒度比较小。将它替换为es6的Proxy，在目标对象之上架了一层拦截，代理的是对象而不是对象的属性。这样可以将原本对对象属性的操作变为对整个对象的操作，颗粒度变大。

javascript引擎在解析的时候希望对象的结构越稳定越好，如果对象一直在变，可优化性降低，proxy不需要对原始对象做太多操作。

3，Virtual DOM 重构
vdom的本质是一个抽象层，用javascript描述界面渲染成什么样子。react用jsx，没办法检测出可以优化的动态代码，所以做时间分片，vue中足够快的话可以不用时间分片。

传统vdom的性能瓶颈：

虽然 Vue 能够保证触发更新的组件最小化，但在单个组件内部依然需要遍历该组件的整个 vdom 树。
传统 vdom 的性能跟模版大小正相关，跟动态节点的数量无关。在一些组件整个模版内只有少量动态节点的情况下，这些遍历都是性能的浪费。
JSX 和手写的 render function 是完全动态的，过度的灵活性导致运行时可以用于优化的信息不足
那为什么不直接抛弃vdom呢？

高级场景下手写 render function 获得更强的表达力
生成的代码更简洁
兼容2.x
vue的特点是底层为Virtual DOM，上层包含有大量静态信息的模版。为了兼容手写 render function，最大化利用模版静态信息，vue3.0采用了动静结合的解决方案，将vdom的操作颗粒度变小，每次触发更新不再以组件为单位进行遍历，主要更改如下

将模版基于动态节点指令切割为嵌套的区块
每个区块内部的节点结构是固定的
每个区块只需要以一个 Array 追踪自身包含的动态节点
vue3.0将 vdom 更新性能由与模版整体大小相关提升为与动态内容的数量相关

4, 更多编译时优化
Slot 默认编译为函数：父子之间不存在强耦合，提升性能
Monomorphic vnode factory：参数一致化，给它children信息，
Compiler-generated flags for vnode/children types
5，选用Function_based API
为什么撤销 Class API ?

1，更好地支持TypeScript

Props 和其它需要注入到 this 的属性导致类型声明依然存在问题
Decorators 提案的严重不稳定使得依赖它的方案具有重大风险
2，除了类型支持以外 Class API 并不带来任何新的优势

3，vue中的UI组件很少用到继承，一般都是组合，可以用Function-based API

Function_based API示例如下


1，vue3.0将组件的逻辑都写在了函数内部，setup()会取代vue2.x的data()函数，返回一个对象，暴露给模板，而且只在初始化的时候调用一次，因为值可以被跟踪。

2，新的函数api：const count = value(0)

value是一个wrapper，是一个包装对象，会包含数字0，可以用count.value来获取这个值。在函数返回的时候会关心是value wrapper，一旦返回给模版，就不用关心了。

优点：即使count包含的是基本类型，例如数字和字符串，也可以在函数之间来回传递，当用count.value取值的时候会触发依赖，改值的时候会触发更新。

3，计算属性返回的也是这个值的包装。

4，onMounted生命周期函数直接注入。

Function-based API 对比Class-based API有以下优点

1，对typescript更加友好，typescript对函数的参数和返回值都非常好，写Function-based API既是javascript又是typescript，不需要任何的类型声明，typescript可以自己做类型推导。

2，静态的import和export是treeshaking的前提，Function-based API中的方法都是从全局的vue中import进来的。

3，函数内部的变量名和函数名都可以被压缩为单个字母，但是对象和类的属性和方法名默认不被压缩（为了防止引用出错）。

4，更灵活的逻辑复用。

目前如果我们要在组件之间共享一些代码，则有两个可用的选择：mixins 和作用域插槽（ scoped slots），但是它们都存在一些缺陷：

1，mixins 的最大缺点在于我们对它实际上添加到组件中的行为一无所知。这不仅使代码变得难以理解，而且还可能导致名称与现有属性和函数发生冲突。

2，通过使用作用域插槽，我们确切地知道可以通过 v-slot 属性访问了哪些属性，因此代码更容易理解。这种方法的缺点是我们只能在模板中访问它，并且只能在组件作用域内使用。

高阶组件在vue中比较少，在react中引入是作为mixins的替代品，但是比mixins更糟糕，高阶组件可以将多个组件进行包装，子组件通过props接收数据，多个高阶组件一起使用，不知道数据来自哪个高阶组件，存在命名空间的冲突。而且高阶组件嵌套得越多，额外的组件实例就越多，造成性能损耗。

下面以一个鼠标位置侦听的案例演示vue3.0中的逻辑复用



以上就是vue3.0中比较重要的改进，我会在后面的文章中结合具体代码详细为大家讲解vue3.0更多新的使用方法。希望大家持续关注，共勉。