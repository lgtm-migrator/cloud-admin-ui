import { MenuSave, MenusByParentId, MenusTree, MenuUpdateById } from '@api/menu/menu'

export default {
  namespaced: true,
  actions: {
    /**
     * 菜单集
     * @param dispatch
     * @param url
     * @param data
     */
    menuList ({ dispatch }, { url, data } = {}) {
      // 开始请求登录接口
      return new Promise((resolve, reject) => {
        MenusByParentId(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 树形菜单
     * @param dispatch
     * @param url
     * @param data
     */
    menuTree ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        MenusTree(url, data).then(result => {
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
     */
    menuSave ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        MenuSave(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     *根据id修改菜单
     * @param dispatch
     * @param url
     * @param data
     */
    menuUpdateById ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        MenuUpdateById(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
