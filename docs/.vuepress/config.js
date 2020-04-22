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
              title: 'computed的实现过程',
              collapsable: true,
              children: ['observer/computed'], 
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