import { Message, MessageBox } from 'element-ui'
import util from '@/libs/util.js'
import router from '@/router'
import { Login, Logout, UserInfo } from '@api/user/user'
import { MenuVueTreeCurrentPath } from '@/api/adminApi/menu'
import { MenuVueTreeCurrent } from '@api/menu/menu'

export default {
  namespaced: true,
  actions: {
    /**
     * @description 登录
     * @param {Object} context
     * @param {Object} payload username {String} 用户账号
     * @param {Object} payload password {String} 密码
     * @param {Object} payload route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
     */
    login ({ dispatch }, {
      userName = '',
      password = ''
    } = {}) {
      // 开始请求登录接口
      return new Promise((resolve, reject) => {
        Login({
          userName,
          password
        })
          .then(res => {
            util.cookies.set('token', res.data.accessToken, { expires: 10 })
            // 设置 vuex 用户信息
            dispatch('d2admin/user/set', {
              name: res.name
            }, { root: true })
            // 用户登录后从持久化数据加载一系列的设置
            dispatch('menuTree')
            dispatch('load')
            dispatch('userInfo')
            // 结束
            resolve()
          })
          .catch(err => {
            console.log('err: ', err)
            reject(err)
          })
      })
    },
    /**
     * @description 注销用户并返回登录页面
     * @param {Object} context
     * @param {Object} payload confirm {Boolean} 是否需要确认
     */
    logout ({ commit, dispatch }, { confirm = false } = {}) {
      /**
       * @description 注销
       */
      function logout () {
        return new Promise((resolve, reject) => {
          let params = { access_token: util.cookies.get('token') }
          Logout(params).then(result => {
            // 删除cookie
            util.cookies.remove('token')
            util.cookies.remove('userId')
            // 清空 vuex 用户信息
            dispatch('d2admin/user/set', {}, { root: true })
            router.push({
              name: 'login'
            })
            // 跳转路由
          }).catch(error => {
            reject(error)
          })
        })
      }

      // 判断是否需要确认
      if (confirm) {
        commit('d2admin/gray/set', true, { root: true })
        MessageBox.confirm('确定要注销当前用户吗', '注销用户', {
          type: 'warning'
        })
          .then(() => {
            commit('d2admin/gray/set', false, { root: true })
            logout()
          })
          .catch(() => {
            commit('d2admin/gray/set', false, { root: true })
            Message({
              message: '取消注销操作'
            })
          })
      } else {
        logout()
      }
    },
    /**
     * 用户详情
     */
    userInfo ({ dispatch }) {
      let token = util.cookies.get('token')
      if (!token) {
        Message.error('用户未登录或登录过期,请重新登录')
        // 跳转路由
        router.push({
          name: 'login'
        })
      } else {
        return new Promise((resolve, reject) => {
          let params = { access_token: util.cookies.get('token') }
          UserInfo(params).then(result => {
            if (result.statusCode != 'CA20000') {
              Message({
                message: '获取用户信息失败,请重新登录',
                type: 'error',
                onClose: function () {
                  // 跳转路由
                  router.push({
                    name: 'login'
                  })
                }
              })
            } else {
              let userId = result.userDetail.userId
              util.cookies.set('userId', userId, { expires: 10 })
              let username = result.userDetail.username
              let name = result.userDetail.name
              // 保存用户
              dispatch('d2admin/user/set', {
                name: name,
                userId: userId,
                username: username
              }, { root: true })
              // 用户登录后从持久化数据加载一系列的设置
              dispatch('load')
              // 结束
              resolve()
            }
          }).catch(error => {
            console.log('err: ', error)
            reject(error)
          })
        })
      }
    },
    menuTree ({ commit, dispatch }) {
      let url = MenuVueTreeCurrentPath
      let _self = this
      MenuVueTreeCurrent(url, null).then(result => {
        let code = result.statusCode
        if (code != 'CA20000') {
          Message({
            message: '获取用户信息失败,请重新登录',
            type: 'error',
            onClose: function () {
              _self.logout()
            }
          })
        } else {
          dispatch('d2admin/menu/SetAside', result, { root: true })
        }
      })
    },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} context
     */
    load ({ dispatch }) {
      return new Promise(async resolve => {
        // DB -> store 加载用户名
        await dispatch('d2admin/user/load', null, { root: true })
        // DB -> store 加载主题
        await dispatch('d2admin/theme/load', null, { root: true })
        // DB -> store 加载页面过渡效果设置
        await dispatch('d2admin/transition/load', null, { root: true })
        // DB -> store 持久化数据加载上次退出时的多页列表
        await dispatch('d2admin/page/openedLoad', null, { root: true })
        // DB -> store 持久化数据加载侧边栏折叠状态
        await dispatch('d2admin/menu/asideCollapseLoad', null, { root: true })
        // DB -> store 持久化数据加载全局尺寸
        await dispatch('d2admin/size/load', null, { root: true })
        // DB -> store 持久化数据加载颜色设置
        await dispatch('d2admin/color/load', null, { root: true })
        // end
        resolve()
      })
    }
  }
}
