import { PermissionSave, PermissionUpdate, PermissionUnBinding } from '@api/permission/permission'

export default {
  namespaced: true,
  actions: {
    /**
     * 权限新增
     * @param dispatch
     * @param url
     * @param data
     */
    permissionSave ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        PermissionSave(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 权限修改
     * @param dispatch
     * @param url
     * @param data
     */
    permissionUpdate ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        PermissionUpdate(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 解除绑定
     * @param dispatch
     * @param url
     * @param data
     */
    permissionUnBinding ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        PermissionUnBinding(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
