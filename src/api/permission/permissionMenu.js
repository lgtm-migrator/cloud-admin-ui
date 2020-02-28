import { permissionMenuServer } from '@api/baseUrl'
import { httpGet } from '@api/http'

/**
 * 根据菜单id获取权限
 * @param url
 * @param data
 * @returns {*}
 */
export function PermissionMenByMenuId (url, data) {
  url = permissionMenuBaseUrl(url)
  if (data) {
    return httpGet(url, data)
  } else {
    return httpGet(url, null)
  }
}

export function permissionMenuBaseUrl (url) {
  if (url) {
    url = permissionMenuServer + url
  } else {
    url = permissionMenuServer
  }
  return url
}
