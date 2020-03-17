import {
  UserInfoById,
  UserSave,
  UserSetting,
  UserSettingPasswordCurrent,
  UserPage,
  UserInfoId,
  UserUpdate,
  UserDelete
} from '@api/user/user'

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
    },
    /**
     * 用户新增
     * @param dispatch
     * @param url
     * @param data
     */
    userSave ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        UserSave(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 用户集合
     * @param dispatch
     * @param url
     * @param data
     */
    userPage ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        UserPage(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 获取用户信息(包含用户组织等)
     * @param dispatch
     * @param url
     * @param data
     * @returns {Promise<any>}
     */
    userInfoId ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        UserInfoId(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 用户更新
     * @param dispatch
     * @param url
     * @param data
     */
    userUpdate ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        UserUpdate(url, data).then(result => {
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
    userDelete ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        UserDelete(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}
