import { roleDeptServer } from '@api/baseUrl'
import { httpGet, httpPost } from '@api/http'

/**
 * 根据角色id获取绑定的组织id
 * @param url
 * @param data
 * @constructor
 */
export function RoleDeptGetDeptIdByRoleId (url, data) {
  url = roleDeptBaseUrl(url)
  if (data) {
    return httpGet(url, data)
  } else {
    return httpGet(url, null)
  }
}

/**
 * 根据角色id绑定组织
 * @param url
 * @param data
 * @returns {*}
 * @constructor
 */
export function RoleDeptBindingDeptByRoleId (url, data) {
  url = roleDeptBaseUrl(url)
  if (data) {
    return httpPost(url, data)
  } else {
    return httpPost(url, null)
  }
}

export function roleDeptBaseUrl (url) {
  if (url) {
    url = roleDeptServer + url
  } else {
    url = roleDeptServer
  }
  return url
}
