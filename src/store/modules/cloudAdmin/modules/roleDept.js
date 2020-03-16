import { RoleDeptBindingDeptByRoleId, RoleDeptGetDeptIdByRoleId } from '@/api/role/roleDpet'

export default {
  namespaced: true,
  actions: {
    /**
     * 根据角色id获取绑定的组织
     * @param dispatch
     * @param url
     * @param data
     * @returns {Promise<any>}
     */
    roleDeptGetDeptIdByRoleId ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        RoleDeptGetDeptIdByRoleId(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 根据角色id绑定组织id
     * @param dispatch
     * @param url
     * @param data
     */
    roleDeptBindingDeptByRoleId ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        RoleDeptBindingDeptByRoleId(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
