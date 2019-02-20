import axios from 'axios'
import * as baseUrl from '../../static/js/baseUrl'
import * as publicFunction from '../../static/js/public'

const ajx = axios.create({
  timeout: 1000 * 20,
  withCredentials: true,
  baseURL: baseUrl.baseUrl
})

ajx.interceptors.request.use(config => {
  if (config.method === 'post') {
    const _key = '_csrf'
    config.data[_key] = publicFunction.getCookieVal('user_id')
  }
  return config
}, error => {
  return Promise.reject(error)
})

ajx.interceptors.response.use(response => {
  return response.data ? response.data : response
}, error => {
  return Promise.reject(error)
})

export default ajx
