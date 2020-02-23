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
  url = routerBaseUrl(url)
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
  url = routerBaseUrl(url)
  if (data) {
    return httpPost(url, data)
  } else {
    return httpPost(url, null)
  }
}

export function routerBaseUrl (url) {
  if (url) {
    url = userServer + url
  } else {
    url = userServer
  }
  return url
}
