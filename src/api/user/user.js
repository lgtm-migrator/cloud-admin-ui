import { httpGet, httpPost } from '@api/http'

/**
 * 用户登录
 * @param data
 * @constructor
 */
export function Login (data) {
  return httpPost('/v1/server/system/oauth2/user/login', data)
}

/**
 * 用户注销
 * @param data
 */
export function Logout (data) {
  return httpGet('v1/server/system/oauth2/user/logout', data)
}
