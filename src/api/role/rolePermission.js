import { rolePermissionServer } from '@api/baseUrl'
import { httpPost, httpGet } from '@api/http'

/**
 * 角色权限保存
 * @param url
 * @param data
 * @returns {*}
 */
export function RolePermissionSave (url, data) {
  url = rolePermissionBaseUrl(url)
  if (data) {
    return httpPost(url, data)
  } else {
    return httpPost(url, null)
  }
}

/**
 * 根据角色id获取权限id
 * @param url
 * @param data
 * @returns {*}
 * @constructor
 */
export function RolePermissionIds (url, data) {
  url = rolePermissionBaseUrl(url)
  if (data) {
    return httpGet(url, data)
  } else {
    return httpGet(url, null)
  }
}

export function rolePermissionBaseUrl (url) {
  if (url) {
    url = rolePermissionServer + url
  } else {
    url = rolePermissionServer
  }
  return url
}
