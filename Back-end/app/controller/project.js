'use strict';

const Controller = require('egg').Controller;


class ProjectController extends Controller {
  /**
   * 新增待办 controller
   */
  async addOneProject() {
    let addOneProjectResult = {};

    const ctx = this.ctx;

    const addProjectInfo = ctx.request.body;

    const tokenVal = await ctx.helper.getTokenVal();

    addProjectInfo.uId = tokenVal.userId;

    const addProjectResult = await ctx.service.project.addOne(addProjectInfo);

    if (addProjectResult.addOneResult.affectedRows === 1) {
      addOneProjectResult = {
        code: 200,
        msg: '新建待办任务成功',
        data: null,
      };
    }

    ctx.response.body = addOneProjectResult;
  }

  /**
   *  根据参数获取符合条件的所有事项
   */
  async getProjectList() {
    let getProjectListResult = {};

    const ctx = this.ctx;

    const tokenVal = await ctx.helper.getTokenVal();

    const userId = tokenVal.userId;

    const getListResult = await ctx.service.project.getList(userId, ctx.query);

    if (getListResult.getListResult.length > 0) {
      const _returnArr = await ctx.helper.checkUnFormatDateData(getListResult.getListResult);

      getProjectListResult = {
        code: 200,
        msg: '查询成功',
        data: _returnArr,
      };
    } else {
      getProjectListResult = {
        code: 400,
        msg: '查询得到的结果为空',
        data: [],
      };
    }

    ctx.response.body = getProjectListResult;
  }

  /**
   *  获取今日之前所有事项(或者根据传入的参数获取对应时间段内容)
   */
  async getAllProject() {
    let getAllProjectResult = {};

    const ctx = this.ctx;

    const tokenVal = await ctx.helper.getTokenVal();

    const userId = tokenVal.userId;

    if (ctx.query.year && ctx.query.month) {
      const startTime = Date.parse(ctx.query.year + ', ' + ctx.query.month + ', 1');

      const currentDate = new Date();

      let endTime = null;

      if ((currentDate.getMonth() + 1) === parseInt(ctx.query.month)) {
        endTime = Date.parse(ctx.query.year + ', ' + ctx.query.month + ', ' + currentDate.getDate());
      } else {
        if (ctx.query.month === 12) {
          endTime = Date.parse((parseInt(ctx.query.year) + 1) + ', 1, 1');
        } else {
          endTime = Date.parse(ctx.query.year + ', ' + (parseInt(ctx.query.month) + 1) + ', 1');
        }
      }


      const getSomeResult = await ctx.service.project.getSome(userId, startTime, endTime);

      if (getSomeResult.getSomeResult.length > 0) {
        const _returnArr = await ctx.helper.checkUnFormatDateData(getSomeResult.getSomeResult);

        getAllProjectResult = {
          code: 200,
          msg: '查询成功',
          data: _returnArr,
        };
      } else {
        getAllProjectResult = {
          code: 400,
          msg: '查询得到的结果为空',
          data: [],
        };
      }
    } else {
      // 获取请求此接口时当天日期
      const currentDate = new Date();

      const currentTime = Date.parse(currentDate.getFullYear() + ', ' + (currentDate.getMonth() + 1) + ', ' + currentDate.getDate());

      const getAllResult = await ctx.service.project.getAll(userId, currentTime);

      if (getAllResult.getAllResult.length > 0) {
        const _returnArr = await ctx.helper.checkUnFormatDateData(getAllResult.getAllResult);

        getAllProjectResult = {
          code: 200,
          msg: '查询成功',
          data: _returnArr,
        };
      } else {
        getAllProjectResult = {
          code: 400,
          msg: '查询得到的结果为空',
          data: [],
        };
      }
    }

    ctx.response.body = getAllProjectResult;
  }

  /**
   *  获取今日之前所有未完成事项
   */
  async getAllUnFinishProject() {
    let getAllUnFinishProjectResult = {};

    const ctx = this.ctx;

    const tokenVal = await ctx.helper.getTokenVal();

    const userId = tokenVal.userId;

    // 获取请求此接口时当天日期
    const currentDate = new Date();
    const currentTime = Date.parse(currentDate.getFullYear() + ', ' + (currentDate.getMonth() + 1) + ', ' + currentDate.getDate());

    const getAllUnFinishResult = await ctx.service.project.getAllUnFinish(userId, currentTime);

    const _arr = await ctx.helper.checkUnFinishProjectList(getAllUnFinishResult.getAllUnFinishResult);

    if (_arr.length > 0) {
      const _returnArr = await ctx.helper.checkUnFormatDateData(_arr);

      getAllUnFinishProjectResult = {
        code: 200,
        msg: '查询成功',
        data: _returnArr,
      };
    } else {
      getAllUnFinishProjectResult = {
        code: 400,
        msg: '查询得到的结果为空',
        data: [],
      };
    }

    ctx.response.body = getAllUnFinishProjectResult;
  }

  /**
   * 根据传入的ID进行对应待办任务查询
   */
  async getOneProject() {
    let getOneProjectResult = {};
    const ctx = this.ctx;

    const getOneResult = await ctx.service.project.getOne(ctx.query.prjId);

    if (getOneResult.getOneResult) {
      const _returnArr = await ctx.helper.checkUnFormatDateData(getOneResult.getOneResult);

      getOneProjectResult = {
        code: 200,
        msg: '查询成功',
        data: _returnArr,
      };
    } else {
      getOneProjectResult = {
        code: 400,
        msg: '查询得到的结果为空',
        data: [],
      };
    }

    ctx.response.body = getOneProjectResult;
  }

  /**
   *  根据唯一ID对数据库对应的数据进行更新
   */
  async updateProject() {
    let updateProjectResult = {};

    const ctx = this.ctx;
    const _info = ctx.request.body;

    const projectId = _info.prjId;

    const tokenVal = await ctx.helper.getTokenVal();
    const userId = tokenVal.userId;

    const updateInfo = {};
    updateInfo.projectTitle = _info.prjName;
    updateInfo.projectDesc = _info.prjDetail;
    updateInfo.projectType = _info.prjType;
    updateInfo.projectStatus = _info.prjStatus;
    updateInfo.projectWillDo = _info.planToFinish;
    updateInfo.projectHasDone = _info.prjCurrentProcess;
    updateInfo.projectStartTime = _info.prjStartTime;
    updateInfo.projectEndTime = _info.prjEndTime;

    const updateResult = await ctx.service.project.updateProjectInfo(updateInfo, projectId, userId);

    if (updateResult.updateProjectInfoResult.affectedRows === 1) {
      updateProjectResult = {
        code: 200,
        msg: '更新成功',
        data: null,
      };
    } else {
      updateProjectResult = {
        code: 400,
        msg: '更新失败，请稍后重试',
        data: null,
      };
    }

    ctx.response.body = updateProjectResult;
  }
}

module.exports = ProjectController;
