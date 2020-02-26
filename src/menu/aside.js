// 菜单 侧边栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '页面',
    icon: 'folder-o',
    children: [
      { path: '/page1', title: '页面 1' },
      { path: '/page2', title: '页面 2' },
      { path: '/page3', title: '页面 3' }
    ]
  },
  {
    title: '系统设置',
    icon: '',
    children: [
      { path: '/router', title: '路由管理' },
      { path: '/menu', title: '菜单管理' },
      { path: '/permission', title: '权限管理' }
    ]
  }
]
