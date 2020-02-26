import { permissionServer } from '@api/baseUrl'

export function userBaseUrl (url) {
  if (url) {
    url = permissionServer + url
  } else {
    url = permissionServer
  }
  return url
}
