import { httpGet, httpPost } from '@api/http'
import { login, logout, userInfo } from '../baseUrl'

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
