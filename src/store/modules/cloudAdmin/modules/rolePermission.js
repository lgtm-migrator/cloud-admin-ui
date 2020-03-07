import { RolePermissionSave, RolePermissionIds } from '@api/role/rolePermission'

export default {
  namespaced: true,
  actions: {
    /**
     * 保存
     * @param dispatch
     * @param url
     * @param data
     */
    rolePermissionSave ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        RolePermissionSave(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 根据角色id获取权限id集
     * @param dispatch
     * @param url
     * @param data
     * @returns {Promise<any>}
     */
    rolePermissionIds ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        RolePermissionIds(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
