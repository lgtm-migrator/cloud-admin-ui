import { httpGet, httpPost } from '@api/http'
import { deptServer } from '@api/baseUrl'

/**
 * 组织树
 * @param url
 * @param data
 * @constructor
 */
export function DeptTree (url, data) {
  url = deptBaseUrl(url)
  if (data) {
    return httpGet(url, data)
  } else {
    return httpGet(url, null)
  }
}

/**
 * 新增组织
 * @param url
 * @param data
 * @returns {*}
 * @constructor
 */
export function DeptSave (url, data) {
  url = deptBaseUrl(url)
  if (data) {
    return httpPost(url, data)
  } else {
    return httpPost(url, null)
  }
}

/**
 * 更新
 * @param url
 * @param data
 * @returns {*}
 * @constructor
 */
export function DeptUpdate (url, data) {
  url = deptBaseUrl(url)
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
export function DeptRemove (url, data) {
  url = deptBaseUrl(url)
  if (data) {
    return httpPost(url, data)
  } else {
    return httpPost(url, null)
  }
}

export function deptBaseUrl (url) {
  if (url) {
    url = deptServer + url
  } else {
    url = deptServer
  }
  return url
}
