# Vuex的数据是怎么响应的

这里为了大家方便理解，我把源码中部分代码删减掉了，只留了一些核心代码

```js
// 这里的state就是我们store中的state
function resetStoreVM (store, state, hot) {

  // store中state的数据放在了data中，（这里的data最终也是放入Vue.observable），把state变成一份可观察的数据
  const silent = Vue.config.silent
  Vue.config.silent = true
  store._vm = new Vue({
    data: {
      $$state: state
    },
    // 这里的的computed实际就是我们的设置的getters
    computed: {...getters}
  })
  Vue.config.silent = silent
}
```



我认为的：我在没有看源码之前，我自己也想了一下Vuex中的数据是怎么做到数据响应的，我想到的是Vuex的state是经过`Vue.observable`处理后，数据变成了响应的了。

实际上：那Vuex这里为啥要重新创建一个Vue的实例，把数据放在data上，然后data再经过`Vue.observable`处理，为啥要绕这么一圈呢，直接用`Vue.observable`不是更加简洁吗，大家看上边那段源码里有个`computed`,**就是因为要使用vue中的computed这个功能来缓存getter的结果**

