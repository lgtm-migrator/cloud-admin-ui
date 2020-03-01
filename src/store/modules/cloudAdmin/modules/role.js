import { RoleSave, RoleListPage, RoleUpdate,RoleRemove } from '@api/role/role'

export default {
  namespaced: true,
  actions: {
    /**
     * 保存
     * @param dispatch
     * @param url
     * @param data
     */
    roleSave ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        RoleSave(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 获取集合
     * @param dispatch
     * @param url
     * @param data
     */
    roleListPage ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        RoleListPage(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 角色修改
     * @param dispatch
     * @param url
     * @param data
     */
    roleUpdate ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        RoleUpdate(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 角色删除
     * @param dispatch
     * @param url
     * @param data
     */
    roleRemove ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        RoleRemove(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}
