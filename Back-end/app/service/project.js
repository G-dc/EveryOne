'use strict';

const Service = require('egg').Service;

class ProjectService extends Service {
  async addOne(obj) {
    const addOneResult = await this.app.mysql.insert('project', {
      userId: obj.uId,
      projectTitle: obj.prjName,
      projectDesc: obj.prjDetail,
      projectType: obj.prjType,
      projectStatus: obj.prjStatus,
      projectWillDo: obj.planToFinish,
      projectHasDone: obj.prjCurrentProcess,
      projectStartTime: obj.prjStartTime,
      projectEndTime: obj.prjEndTime,
    });
    return { addOneResult };
  }

  async updateProjectInfo(updateInfo, prjId, uId) {
    const options = {
      where: {
        projectId: prjId,
        userId: uId,
      },
    };

    const updateProjectInfoResult = await this.app.mysql.update('project', updateInfo, options);

    return { updateProjectInfoResult };
  }

  async getList(id, obj) {
    const sql = `select * from project where userId = '${id}' and projectStartTime >= ${obj.prjStartTime} and projectEndTime <= ${obj.prjEndTime}`;
    const getListResult = await this.app.mysql.query(sql);

    return { getListResult };
  }

  async getOne(id) {
    const getOneResult = await this.app.mysql.get('project', { projectId: id });

    return { getOneResult };
  }

  async getAll(id, time) {
    const sql = `select  * from project where userId = '${id}' and projectEndTime < ${time} order by projectStartTime desc`;

    const getAllResult = await this.app.mysql.query(sql);

    return { getAllResult };
  }

  async getSome(id, startTime, endTime) {
    const sql = `select * from project where userId = '${id}' and projectStartTime >= ${startTime} and projectEndTime < ${endTime} order by projectStartTime desc`;

    const getSomeResult = await this.app.mysql.query(sql);

    return { getSomeResult };
  }
}

module.exports = ProjectService;
