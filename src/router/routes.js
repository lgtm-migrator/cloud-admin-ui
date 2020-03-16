import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: 'index',
        name: 'index',
        meta: {
          auth: true,
          title: '首页'
        },
        component: _import('system/index')
      },
      // 用户信息
      {
        path: 'userInfo',
        name: 'userInfo',
        meta: {
          auth: true,
          title: '用户信息'
        },
        component: _import('system/userInfo')
      },
      // 系统服务路由
      {
        path: 'router',
        name: 'router',
        meta: {
          title: '路由',
          auth: true
        },
        component: _import('system/router')
      },
      {
        path: 'menu',
        name: 'menu',
        meta: {
          title: '菜单',
          auth: true
        },
        component: _import('system/menu')
      },
      {
        path: 'permission',
        name: 'permission',
        meta: {
          title: '权限',
          auth: true
        },
        component: _import('system/permission')
      },
      {
        path: 'role',
        name: 'role',
        meta: {
          title: '角色',
          auth: true
        },
        component: _import('system/role')
      },
      {
        path: 'dept',
        name: 'dept',
        meta: {
          title: '组织',
          auth: true
        },
        component: _import('system/dept')
      },
      {
        path: 'post',
        name: 'post',
        meta: {
          title: '岗位',
          auth: true
        },
        component: _import('system/post')
      },
      {
        path: 'user',
        name: 'user',
        meta: {
          title: '用户',
          auth: true
        },
        component: _import('system/user')
      },
      // 演示页面
      // {
      //   path: 'page1',
      //   name: 'page1',
      //   meta: {
      //     title: '页面 1',
      //     auth: true
      //   },
      //   component: _import('demo/page1')
      // },
      // {
      //   path: 'page2',
      //   name: 'page2',
      //   meta: {
      //     title: '页面 2',
      //     auth: true
      //   },
      //   component: _import('demo/page2')
      // },
      // {
      //   path: 'page3',
      //   name: 'page3',
      //   meta: {
      //     title: '页面 3',
      //     auth: true
      //   },
      //   component: _import('demo/page3')
      // },
      // 系统 前端日志
      {
        path: 'log',
        name: 'log',
        meta: {
          title: '前端日志',
          auth: true
        },
        component: _import('system/log')
      },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: _import('system/function/refresh')
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: _import('system/function/redirect')
      }
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: _import('system/login')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: _import('system/error/404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
