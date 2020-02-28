import { permissionServer } from '@api/baseUrl'
import { httpPost } from '@api/http'

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

export function userBaseUrl (url) {
  if (url) {
    url = permissionServer + url
  } else {
    url = permissionServer
  }
  return url
}
