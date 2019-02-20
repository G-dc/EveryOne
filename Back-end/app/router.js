'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // 检查登录状态
  router.get('/checkLoginStatus', controller.user.userLoginStatus);

  // 用户注册
  router.post('/userRegist', controller.user.userRegist);

  // 用户登录
  router.post('/userLogin', controller.user.userLogin);

  // 用户注销
  router.get('/userLogout', controller.user.userLogout);

  // 用户更新信息
  router.post('/userUpdate', controller.user.userUpdate);

  // 新建待办任务
  router.post('/addOneProject', controller.project.addOneProject);

  // 根据参数获取符合条件的所有待办任务
  router.get('/getProjectList', controller.project.getProjectList);

  // 根据唯一ID获取对应的待办任务
  router.get('/getOneProject', controller.project.getOneProject);

  // 根据唯一ID对数据库对应的待办任务进行更新
  router.post('/updateProject', controller.project.updateProject);

  // 获取当天之前的所有待办
  router.get('/getAllProject', controller.project.getAllProject);
};
