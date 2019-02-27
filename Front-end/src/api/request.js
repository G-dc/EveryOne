import axios from 'axios'
import * as baseUrl from '../../static/js/baseUrl'

import * as publicFunction from '../../static/js/public'
import router from '../router'

import { Message } from 'element-ui'

const ajx = axios.create({
  timeout: 1000 * 20,
  withCredentials: true,
  baseURL: baseUrl.baseUrl
})

ajx.interceptors.request.use(config => {
  if (publicFunction.getCookieVal()) {
    let token = publicFunction.getCookieVal()
    config.headers.authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

ajx.interceptors.response.use(response => {
  return response.data ? response.data : response
}, error => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        Message.warning({
          message: error.response.data.message
        })
        setTimeout(() => {
          router.replace({
            path: '/login'
          })
        }, 1000)
    }
  }
  return Promise.reject(error)
})

export default ajx
