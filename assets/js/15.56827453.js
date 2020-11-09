(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{273:function(t,s,a){"use strict";a.r(s);var h=a(28),r=Object(h.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"前端路由"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#前端路由"}},[t._v("#")]),t._v(" 前端路由")]),t._v(" "),a("p",[t._v("在学些"),a("code",[t._v("vue-router")]),t._v("之前我们很有必要学习一些基础知识，这样才能看懂源码")]),t._v(" "),a("h2",{attrs:{id:"什么是路由"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#什么是路由"}},[t._v("#")]),t._v(" 什么是路由")]),t._v(" "),a("blockquote",[a("p",[t._v("路由是根据不同的url地址来显示不同的页面或内容的功能，这个概念很早是由后端提出的")])]),t._v(" "),a("h2",{attrs:{id:"前端路由是怎么实现的"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#前端路由是怎么实现的"}},[t._v("#")]),t._v(" 前端路由是怎么实现的")]),t._v(" "),a("h3",{attrs:{id:"hash模式"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#hash模式"}},[t._v("#")]),t._v(" hash模式")]),t._v(" "),a("p",[t._v("hash路由模式是这样的：http://xxx.abc.com/#/xx。 有带#号，后面就是hash值的变化。改变后面的hash值，它不会向服务器发出请求，因此也就不会刷新页面。并且每次hash值发生改变的时候，会触发hashchange事件。因此我们可以通过监听该事件，来知道hash值发生了哪些变化")]),t._v(" "),a("h3",{attrs:{id:"history模式"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#history模式"}},[t._v("#")]),t._v(" history模式")]),t._v(" "),a("p",[t._v("HTML5的History API为浏览器的全局history对象增加了该扩展方法。它是一个浏览器的一个接口，在window对象中提供了onpopstate事件来监听历史栈的改变，只要历史栈有信息发生改变的话，就会触发该事件")]),t._v(" "),a("h2",{attrs:{id:"hash模式和history模式的区别"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#hash模式和history模式的区别"}},[t._v("#")]),t._v(" hash模式和history模式的区别")]),t._v(" "),a("h4",{attrs:{id:"hash模式的优缺点："}},[a("a",{staticClass:"header-anchor",attrs:{href:"#hash模式的优缺点："}},[t._v("#")]),t._v(" hash模式的优缺点：")]),t._v(" "),a("p",[a("strong",[t._v("优点：")])]),t._v(" "),a("ol",[a("li",[a("p",[t._v("兼容性：hash模式能兼容到IE8而history模式只能兼容到IE10")])]),t._v(" "),a("li",[a("p",[t._v("页面刷新，hash后面的地址不会传递到服务器")])])]),t._v(" "),a("p",[a("strong",[t._v("缺点：")])]),t._v(" "),a("ol",[a("li",[t._v("hash本来是做页面定位的，如果拿来做页面路由的话原来的锚点功能就不能用了")]),t._v(" "),a("li",[t._v("由于传递数据是在地址栏里传递，所以会受大小限制")]),t._v(" "),a("li",[t._v("有一个丑陋的#")])]),t._v(" "),a("h4",{attrs:{id:"history的优缺点："}},[a("a",{staticClass:"header-anchor",attrs:{href:"#history的优缺点："}},[t._v("#")]),t._v(" history的优缺点：")]),t._v(" "),a("p",[a("strong",[t._v("优点：")])]),t._v(" "),a("ol",[a("li",[a("p",[t._v("history.pushState和history.replaceState改变路由不会像服务端发送请求")])]),t._v(" "),a("li",[a("p",[t._v("地址栏去掉了丑陋的#，显的更加美观")])]),t._v(" "),a("li",[a("p",[t._v("可以通过对象的形式传递数据，不受大小的限制")])]),t._v(" "),a("li",[a("p",[t._v("不会影响页面的锚点功能")])])]),t._v(" "),a("p",[a("strong",[t._v("缺点：")])]),t._v(" "),a("ol",[a("li",[t._v("因为页面刷新会向服务器发送请求，所以服务端要讲所有的路由重定向到根页面")])])])}),[],!1,null,null,null);s.default=r.exports}}]);