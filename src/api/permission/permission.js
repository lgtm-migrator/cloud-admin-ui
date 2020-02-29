import { permissionServer } from '@api/baseUrl'
import { httpPost, httpGet } from '@api/http'

/**
 * 新增权限
 * @param url
 * @param data
 * @returns {*}
 * @constructor
 */
export function PermissionSave (url, data) {
  url = userBaseUrl(url)
  if (data) {
    return httpPost(url, data)
  } else {
    return httpPost(url, null)
  }
}

/**
 * 修改权限
 * @param url
 * @param data
 * @returns {*}
 * @constructor
 */
export function PermissionUpdate (url, data) {
  url = userBaseUrl(url)
  if (data) {
    return httpPost(url, data)
  } else {
    return httpPost(url, null)
  }
}

/**
 * 解除绑定
 * @param url
 * @param data
 * @constructor
 */
export function PermissionUnBinding (url, data) {
  url = userBaseUrl(url)
  if (data) {
    return httpGet(url, data)
  } else {
    return httpGet(url, null)
  }
}

export function userBaseUrl (url) {
  if (url) {
    url = permissionServer + url
  } else {
    url = permissionServer
  }
  return url
}
