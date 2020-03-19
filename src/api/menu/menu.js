import { httpGet, httpPost } from '@api/http'
import { menuServer } from '@api/baseUrl'

/**
 * 获取菜单
 * @param url
 * @param data
 * @returns {*}
 * @constructor
 */
export function MenusByParentId (url, data) {
  url = userBaseUrl(url)
  if (data) {
    return httpGet(url, data)
  } else {
    return httpGet(url, null)
  }
}

/**
 * 树形菜单
 * @constructor
 */
export function MenusTree (url, data) {
  url = userBaseUrl(url)
  if (data) {
    return httpGet(url, data)
  } else {
    return httpGet(url, null)
  }
}

/**
 * 保存
 * @param url
 * @param data
 * @constructor
 */
export function MenuSave (url, data) {
  url = userBaseUrl(url)
  if (data) {
    return httpPost(url, data)
  } else {
    return httpPost(url, null)
  }
}

/**
 * 根据id修改菜单
 * @param url
 * @param data
 * @returns {*}
 * @constructor
 */
export function MenuUpdateById (url, data) {
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
export function MenuRemove (url, data) {
  url = userBaseUrl(url)
  if (data) {
    return httpGet(url, data)
  } else {
    return httpGet(url, null)
  }
}

/**
 * vue树形菜单
 * @param url
 * @param data
 * @constructor
 */
export function MenuVueTreeCurrent (url, data) {
  url = userBaseUrl(url)
  if (data) {
    return httpGet(url, data)
  } else {
    return httpGet(url, null)
  }
}

export function userBaseUrl (url) {
  if (url) {
    url = menuServer + url
  } else {
    url = menuServer
  }
  return url
}
