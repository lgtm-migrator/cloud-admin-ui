import { PostDeptGetBinding, PostDeptGetBindingId, PostDeptBinding } from '@/api/post/postDept'

export default {
  namespaced: true,
  actions: {
    /**
     * 获取已绑定的岗位组织
     * @param dispatch
     * @param url
     * @param data
     * @returns {Promise<any>}
     */
    postDeptGetBinding ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        PostDeptGetBinding(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 获取已绑定的岗位组织id
     * @param dispatch
     * @param url
     * @param data
     * @returns {Promise<any>}
     */
    postDeptGetBindingId ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        PostDeptGetBindingId(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 绑定
     * @param dispatch
     * @param url
     * @param data
     * @returns {Promise<any>}
     */
    postDeptBinding ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        PostDeptBinding(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
