import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'ConfigCRUD',
  themeConfig: {
    logo: '../public/icon.png',
    // siteTitle: 'VitePress-Fun'

    socialLinks: [
      {
        icon: 'github',
        link: 'aa'
      }
    ],

    sidebar: [
      {
        text: '基础',
        items: [
          { text: '快速开始', link: '/guide/' }
        ]
      }
    ]
  }
})
