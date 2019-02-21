import ajx from '../request'

// 新增待办事项
export function addNewOne (params) {
  return ajx.post('/addOneProject', params)
}

// 获取当天待办事项
export function getProjectList (params) {
  return ajx.get('/getProjectList', {
    params: {
      prjStartTime: params.startTime,
      prjEndTime: params.endTime
    }
  })
}

// 根据ID获取某一待办事项
export function getOneProject (data) {
  return ajx.get('/getOneProject', {
    params: {
      prjId: data
    }
  })
}

// 更新待办
export function updateProject (params) {
  return ajx.post('/updateProject', params)
}

// 获取当天之前所有待办事项（如果有参数携带的话根据参数获取一定时间范围待办事项
export function getAllProject (params) {
  return ajx.get('/getAllProject', {
    params: params
  })
}

// 获取当天之前所有未完成待办事项
export function getAllUnFinishProject () {
  return ajx.get('/getAllUnFinishProject')
}
