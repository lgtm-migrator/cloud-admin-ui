import { AddRouter, Routers, UpdateRouter } from '@api/user/router'
import { Message } from 'element-ui'

export default {
  namespaced: true,
  actions: {
    /**
     * 路由集
     * @param dispatch
     * @param url
     * @param data
     * @returns {Promise<any>}
     */
    routers ({ dispatch }, { url, data } = {}) {
      // 开始请求登录接口
      return new Promise((resolve, reject) => {
        Routers(url, data)
          .then(result => {
            if (result.errCode !== 200) {
              Message.error(result.data)
              resolve()
            }
            // 结束
            resolve(result.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    /**
     * 新增路由
     * @param dispatch
     * @param url
     * @param data
     * @returns {Promise<any>}
     */
    addRouter ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        AddRouter(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 修改路由
     * @param dispatch
     * @param url
     * @param data
     */
    updateRouter ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        UpdateRouter(url, data).then(result => {
          console.log('result', result)
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
