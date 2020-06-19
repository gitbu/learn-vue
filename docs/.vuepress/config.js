module.exports = {
  base: '/learn-vue/',
  dest: './dist',
  title: 'vue 源码分析',
  description: 'vue 源码分析',
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    repo: 'gitbu/learn-vue',
    editLinks: true,
    docsDir: 'docs',
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: '上次更新',
    nav: [
      {
        text: 'vue2',
        items: [
          {
            text: 'vue',
            link: '/vue2/vue/prepare/'
          },
          {
            text: 'vuex',
            link: '/vue2/vuex/'
          },
        ]
      }
    ],
    sidebar: {
      '/vue2/vue/': [
        {
          title: '准备工作',
          collapsable: false,
          children: [
            ['prepare/', '介绍'],
            'prepare/基础知识准备',
            'prepare/项目结构',
            'prepare/项目初始化',
            'prepare/源码调试',
          ]
        }, {
          title: '响应式系统',
          collapsable: false,
          children: [
            {
              title: '原理剖析',
              collapsable: true,
              children: [
                'observer/基本原理',
                'observer/依赖搜集原理',
                'observer/异步更新和$nextTick原理',
                'observer/computed实现原理',
                'observer/$watch实现原理',
                'observer/数组更新检测实现原理',
                'observer/$set实现原理',
              ], 
            },
            {
              title: '自己实现',
              collapsable: true,
              children: [
                'observer/toDoByYourself/手写一个响应式系统'
              ]
            },
         
          ]

        }, {
          title: '虚拟DOM',
          collapsable: false,
          children: [{
            title: '组件挂载更新',
            collapsable: true,
            children: [
              'vdom/组件挂载过程',
              'vdom/组件更新过程',
              'vdom/createElement',
              'vdom/createComponent',
              'vdom/vnode',
            ],
          }, {
            title: 'domDiff',
            collapsable: true,
            children: [
              'vdom/domDiff/vnode对比流程图',
              'vdom/domDiff/patch',
              'vdom/domDiff/createElm',
              'vdom/domDiff/invokeCreateHooks',
              'vdom/domDiff/patchVnode',
              'vdom/domDiff/updateChildren',
            ],
          }]
        }, {
          title: '全局API',
          collapsable: false,
          children: [
            '全局API/component和filter和directive',
            '全局API/use',
            '全局API/observable',
            '全局API/extend',
            '全局API/directive',
          ]
        }, {
          title: '编译原理',
          collapsable: false,
          children: [
            '模板编译/概览',
            {
              title: '调用链路',
              collapsable: true,
              children: [
                '模板编译/调用链路/图解链路',
                '模板编译/调用链路/调用编译',
                '模板编译/调用链路/compileToFunctions',
                '模板编译/调用链路/createCompiler',
                '模板编译/调用链路/createCompilerCreator',
                '模板编译/调用链路/createCompileToFunctionFn',
              ]
            },
          ]
        }
      ],
      '/vue2/vuex/': [{
        title: '原理解析',
        collapsable: false,
        children: [
          '原理解析/实例能访问到$store的原理',
          '原理解析/vuex的数据是怎么响应的',
          '原理解析/mutation和commit',
          '原理解析/getter',
          '原理解析/action和dispatch',
        ]

      }, {
        title: 'module的管理',
        collapsable: false,
        children: [
          'module/module',
          'module/module-collection',
        ]
      }, {
        title: 'map的原理',
        collapsable: false,
        children: [
          'map/mapState',
          'map/mapGetters',
          'map/mapMutations',
          'map/mapActions',
          'map/总结',
        ]
      }]
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@alias': '/to/some/dir'
      }
    }
  }
}