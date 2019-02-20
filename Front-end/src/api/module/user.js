import ajx from '../request'

// 登录
export function login (params) {
  return ajx.post('/userLogin', params)
}

// 注册
export function regist (params) {
  return ajx.post('/userRegist', params)
}

// 注销
export function logout () {
  return ajx.get('/userLogout')
}
