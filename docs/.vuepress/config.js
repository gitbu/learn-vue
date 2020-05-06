module.exports = {
  base: '/learn-vue/',
  dest: './dist',
  title: 'vue 源码分析',
  description: 'vue 源码分析',
  themeConfig: {
    repo: 'gitbu/learn-vue',
    editLinks: true,
    docsDir: 'docs',
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: '上次更新',
    nav: [
      {
        text: 'vue',
        items: [
          {
            text: '2.x版本',
            link: '/vue2/prepare/'
          },
        ]
      }
    ],
    sidebar: {
      '/vue2/': [
        {
          title: '准备工作',
          collapsable: false,
          children: [
            ['prepare/', '介绍'],
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
                'observer/数组更新检测实现原理',
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
                'observer/toDoByYourself/基础知识准备',
                'observer/toDoByYourself/手写一个响应式系统'
              ]
            },
         
          ]

        }
      ]
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