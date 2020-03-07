import { PermissionMenByMenuId, PermissionMenuAll } from '@api/permission/permissionMenu'

export default {
  namespaced: true,
  actions: {
    /**
     * 根据菜单获取权限
     * @param dispatch
     * @param url
     * @param data
     */
    permissionMenuByMenuId ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        PermissionMenByMenuId(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 获取菜单权限集
     * @param dispatch
     * @param url
     * @param data
     */
    permissionMenuAll ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        PermissionMenuAll(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
