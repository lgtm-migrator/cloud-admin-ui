import { Message, MessageBox } from 'element-ui'
import util from '@/libs/util.js'
import router from '@/router'
import { Login, Logout } from '@api/user/user'

export default {
  namespaced: true,
  actions: {
    login ({ dispatch }, {
      userName = '',
      password = ''
    } = {}) {
      return new Promise((resolve, reject) => {
        // 开始请求登录接口
        Login({
          userName,
          password
        })
          .then(result => {
            console.log('result: ', result)
            if (result.errCode !== 200) {
              Message.error(result.data)
              return
            }
            // 保存用户token
            util.cookies.set('userId', result.data.userId)
            util.cookies.set('token', result.data.accessToken)
            // 设置 vuex 用户信息
            dispatch('d2admin/user/set', {
              name: result.name
            }, { root: true })
            // 用户登录后从持久化数据加载一系列的设置
            dispatch('load')
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
     * 用户注销
     * @param commit 是否弹出提示
     * @param dispatch
     * @param confirm
     */
    logout ({ commit, dispatch }, { confirm = false } = {}) {
      if (commit) {
        commit('d2admin/gray/set', true, { root: true })
        MessageBox.confirm('确定要注销当前用户吗', '注销用户', {
          type: 'warning'
        }).then(() => {
          commit('d2admin/gray/set', false, { root: true })
          logout()
        })
      } else {
        logout()
      }

      /**
       * 用户注销
       * @returns {Promise<*>}
       */
      async function logout () {
        return new Promise((resolve, reject) => {
          let params = { access_token: util.cookies.get('token') }
          Logout(params).then(async result => {
            if (result.errCode !== 200) {
              Message.error(result.data)
            } else {
              // 删除cookie
              util.cookies.remove('token')
              util.cookies.remove('userId')
              // 清空 vuex 用户信息
              await dispatch('d2admin/user/set', {}, { root: true })
              // 跳转路由
              router.push({
                name: 'login'
              })
            }
          }).catch(err => {
            console.log('err: ', err)
            reject(err)
          })
        })
      }
    }
  }
}
