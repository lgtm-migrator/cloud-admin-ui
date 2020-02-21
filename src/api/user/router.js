/**
 * 路由集
 * @constructor
 */
import { httpGet, httpPost } from '../http'
import { gatewayRouter, routerServer } from '../baseUrl'

/**
 * 获取路由集
 * @param url 请求路径（resultfull）
 * @param data 请求参数
 * @constructor
 */
export function Routers (url, data) {
  if (url) {
    url = routerServer + url
  } else {
    url = routerServer
  }
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
  if (url) {
    url = gatewayRouter + url
  } else {
    url = gatewayRouter
  }
  if (data) {
    return httpPost(url, data)
  }
  return httpPost(url, null)
}
