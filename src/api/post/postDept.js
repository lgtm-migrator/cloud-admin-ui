import { postDeptServer } from '@api/baseUrl'
import { httpGet, httpPost } from '@api/http'

/**
 * 获取已绑定岗位组织
 * @param url
 * @param data
 * @returns {*}
 */
export function PostDeptGetBinding (url, data) {
  url = postDeptBaseUrl(url)
  if (data) {
    return httpGet(url, data)
  } else {
    return httpGet(url, null)
  }
}
/**
 * 获取已绑定岗位组织id
 * @param url
 * @param data
 * @returns {*}
 */
export function PostDeptGetBindingId (url, data) {
  url = postDeptBaseUrl(url)
  if (data) {
    return httpGet(url, data)
  } else {
    return httpGet(url, null)
  }
}
/**
 * 绑定
 * @param url
 * @param data
 * @constructor
 */
export function PostDeptBinding (url, data) {
  url = postDeptBaseUrl(url)
  if (data) {
    return httpPost(url, data)
  } else {
    return httpPost(url, null)
  }
}

export function postDeptBaseUrl (url) {
  if (url) {
    url = postDeptServer + url
  } else {
    url = postDeptServer
  }
  return url
}
