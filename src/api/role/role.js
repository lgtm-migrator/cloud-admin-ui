import { roleServer } from '@api/baseUrl'
import { httpPost, httpGet } from '@api/http'

/**
 * 角色新增
 * @param url
 * @param data
 * @returns {*}
 * @constructor
 */
export function RoleSave (url, data) {
  url = roleBaseUrl(url)
  if (data) {
    return httpPost(url, data)
  } else {
    return httpPost(url, null)
  }
}

/**
 * 获取集合
 * @param url
 * @param data
 * @returns {*}
 * @constructor
 */
export function RoleListPage (url, data) {
  url = roleBaseUrl(url)
  if (data) {
    return httpGet(url, data)
  } else {
    return httpGet(url, null)
  }
}

/**
 * 修改角色
 * @param url
 * @param data
 * @returns {*}
 * @constructor
 */
export function RoleUpdate (url, data) {
  url = roleBaseUrl(url)
  if (data) {
    return httpPost(url, data)
  } else {
    return httpPost(url, null)
  }
}

/**
 * 角色删除
 * @param url
 * @param data
 * @returns {*}
 * @constructor
 */
export function RoleRemove (url, data) {
  url = roleBaseUrl(url)
  if (data) {
    return httpGet(url, data)
  } else {
    return httpGet(url, null)
  }
}

export function roleBaseUrl (url) {
  if (url) {
    url = roleServer + url
  } else {
    url = roleServer
  }
  return url
}
