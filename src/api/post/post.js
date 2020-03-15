/* 系统岗位 */
import { postServer } from '@api/baseUrl'
import { httpGet, httpPost } from '@api/http'

/**
 * 获取分页后的数量
 * @param url
 * @param data
 * @returns {*}
 * @constructor
 */
export function PostGetPage (url, data) {
  url = postBaseUrl(url)
  if (data) {
    return httpPost(url, data)
  } else {
    return httpPost(url, null)
  }
}

/**
 * 保存
 * @param url
 * @param data
 * @returns {*}
 * @constructor
 */
export function PostSave (url, data) {
  url = postBaseUrl(url)
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
export function PostDelete (url, data) {
  url = postBaseUrl(url)
  if (data) {
    return httpGet(url, data)
  } else {
    return httpGet(url, null)
  }
}

/**
 * 更新
 * @param url
 * @param data
 * @constructor
 */
export function PostUpdate (url, data) {
  url = postBaseUrl(url)
  if (data) {
    return httpPost(url, data)
  } else {
    return httpPost(url, null)
  }
}

export function postBaseUrl (url) {
  if (url) {
    url = postServer + url
  } else {
    url = postServer
  }
  return url
}
