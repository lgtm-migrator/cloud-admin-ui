import { httpGet, httpPost } from '@api/http'
import { login, logout, userInfo, userServer } from '../baseUrl'

/**
 * 用户登录
 * @param data
 * @constructor
 */
export function Login (data) {
  return httpPost(login, data)
}

/**
 * 用户注销
 * @param data
 */
export function Logout (data) {
  return httpGet(logout, data)
}

/**
 * 用户详情
 * @param data
 */
export function UserInfo (data) {
  return httpGet(userInfo, data)
}

/**
 * 用户详情根据id
 * @param url
 * @param data
 * @constructor
 */
export function UserInfoById (url, data) {
  url = userBaseUrl(url)
  if (data) {
    return httpGet(url, data)
  } else {
    return httpGet(url, null)
  }
}

/**
 * 用户设置
 * @param url
 * @param data
 * @constructor
 */
export function UserSetting (url, data) {
  url = userBaseUrl(url)
  if (data) {
    return httpPost(url, data)
  } else {
    return httpPost(url, null)
  }
}

/**
 * 修改用户密码
 * @param url
 * @param data
 * @constructor
 */
export function UserSettingPasswordCurrent (url, data) {
  url = userBaseUrl(url)
  if (data) {
    return httpPost(url, data)
  } else {
    return httpPost(url, null)
  }
}

/**
 * 用户新增
 * @param url
 * @param data
 * @constructor
 */
export function UserSave (url, data) {
  url = userBaseUrl(url)
  if (data) {
    return httpPost(url, data)
  } else {
    return httpPost(url, null)
  }
}

/**
 * 用户集合
 * @param url
 * @param data
 * @returns {*}
 * @constructor
 */
export function UserPage (url, data) {
  url = userBaseUrl(url)
  if (data) {
    return httpPost(url, data)
  } else {
    return httpPost(url, null)
  }
}

/**
 * 获取用户详情(包含用户组织用户岗位等信息)
 * @param url
 * @param data
 * @constructor
 */
export function UserInfoId (url, data) {
  url = userBaseUrl(url)
  if (data) {
    return httpGet(url, data)
  } else {
    return httpGet(url, null)
  }
}

/**
 * 用户更新
 * @param url
 * @param data
 * @constructor
 */
export function UserUpdate (url, data) {
  url = userBaseUrl(url)
  if (data) {
    return httpPost(url, data)
  } else {
    return httpPost(url, null)
  }
}

/**
 * 删除
 * @param url
 * @param data
 * @returns {*}
 * @constructor
 */
export function UserDelete (url, data) {
  url = userBaseUrl(url)
  if (data) {
    return httpGet(url, data)
  } else {
    return httpGet(url, null)
  }
}

export function userBaseUrl (url) {
  if (url) {
    url = userServer + url
  } else {
    url = userServer
  }
  return url
}
