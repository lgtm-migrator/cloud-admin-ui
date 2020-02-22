/**
 * 路由集
 * @constructor
 */
import { httpGet, httpPost } from '../http'
import { routerServer } from '../baseUrl'

/**
 * 获取路由集
 * @param url 请求路径（resultfull）
 * @param data 请求参数
 * @constructor
 */
export function Routers (url, data) {
  url = routerBaseUrl(url)
  if (data) {
    return httpGet(url, data)
  }
  return httpGet(url, null)
}

/**
 * 新增路由
 * @param url 请求路径（resultfull）
 * @param data 请求参数
 * @constructor
 */
export function AddRouter (url, data) {
  url = routerBaseUrl(url)
  if (data) {
    return httpPost(url, data)
  }
  return httpPost(url, null)
}

/**
 * 路由修改
 * @param url
 * @param data
 * @constructor
 */
export function UpdateRouter (url, data) {
  url = routerBaseUrl(url)
  if (data) {
    return httpPost(url, data)
  }
  return httpPost(url, null)
}

export function routerBaseUrl (url) {
  if (url) {
    url = routerServer + url
  } else {
    url = routerServer
  }
  return url
}
