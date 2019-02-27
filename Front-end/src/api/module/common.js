import ajx from '../request'

// 获取 csrf
export function getCSRF () {
  return ajx.get('/')
}

// 验证登录状态
export function checkStatus (data) {
  return ajx.get('/checkLoginStatus')
}
