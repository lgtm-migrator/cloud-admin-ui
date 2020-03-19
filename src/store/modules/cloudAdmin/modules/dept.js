import { DeptTree, DeptSave, DeptUpdate, DeptRemove } from '@api/dept/dept'

export default {
  namespaced: true,
  actions: {
    /**
     * 组织树
     * @param dispatch
     * @param url
     * @param data
     * @returns {Promise<any>}
     */
    deptTree ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        DeptTree(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 新增
     * @param dispatch
     * @param url
     * @param data
     * @returns {Promise<any>}
     */
    deptSave ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        DeptSave(url, data).then(result => {
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
    deptUpdate ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        DeptUpdate(url, data).then(result => {
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
     */
    deptRemove ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        DeptRemove(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
