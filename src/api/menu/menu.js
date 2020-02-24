import { httpGet } from '@api/http'
import { menuServer } from '../baseUrl'

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

export function userBaseUrl (url) {
  if (url) {
    url = menuServer + url
  } else {
    url = menuServer
  }
  return url
}
