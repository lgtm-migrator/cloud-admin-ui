import { MenusByParentId } from '@api/menu/menu'

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
    }
  }
}
