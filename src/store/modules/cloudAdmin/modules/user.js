import { UserInfoById, UserSetting, UserSettingPasswordCurrent } from '@api/user/user'

export default {
  namespaced: true,
  actions: {
    /**
     * 根据id获取用户信息
     * @param dispatch
     * @param url
     * @param data
     */
    userInfoById ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        UserInfoById(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 设置用户
     * @param dispatch
     * @param url
     * @param data
     */
    userSetting ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        UserSetting(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 设置用户密码
     * @param dispatch
     * @param url
     * @param data
     */
    userSettingPasswordCurrent ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        UserSettingPasswordCurrent(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
