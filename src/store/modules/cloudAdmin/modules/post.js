/* 岗位 */
import { PostGetPage, PostSave, PostDelete, PostUpdate } from '@api/post/post'

export default {
  namespaced: true,
  actions: {
    /**
     * 获取分页后的
     * @param dispatch
     * @param url
     * @param data
     * @returns {Promise<any>}
     */
    postGetPage ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        PostGetPage(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 保存
     * @param dispatch
     * @param url
     * @param data
     * @returns {Promise<any>}
     */
    postSave ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        PostSave(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 删除
     * @param dispatch
     * @param url
     * @param data
     * @returns {Promise<any>}
     */
    postDelete ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        PostDelete(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 更新
     * @param dispatch
     * @param url
     * @param data
     */
    postUpdate ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        PostUpdate(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
