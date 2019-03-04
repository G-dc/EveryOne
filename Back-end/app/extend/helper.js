'use strict';

module.exports = {
  // 对传入的数据进行加密
  contentEncrypt(val, options) {
    val = require('crypto').createHash(options).update(val)
      .digest('hex');
    return val;
  },

  // 对传入的时间戳进行格式化处理
  formatDate(val) {
    const _date = new Date(val);
    return _date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' + _date.getDate();
  },

  // 根据传入的参数从cookie里面获取相关信息
  getCookieVal(val, options) {
    const _arr = val.split(';');
    const resultData = _arr.find(item => { return item.indexOf(options) > -1; });

    return resultData;
  },

  // 根据传入的参数获取token的相关值
  getTokenVal() {
    const token = this.ctx.request.header.authorization.split(' ')[1];

    const decodedToken = this.app.jwt.verify(token, this.app.config.jwt.secret);

    return decodedToken;
  },

  // 对传入的事项列表进行相同事项去重处理
  checkUnFinishProjectList(list) {
    const _projectList = [];

    // 对传入的数据进行第一步去重工作，只保留最新一条内容，生成一个新数组
    list.forEach(item => {
      if (_projectList.length > 0) {
        const _searchResult = _projectList.find(search_item => {
          return search_item.projectTitle === item.projectTitle;
        });

        if (!_searchResult) {
          _projectList.push(item);
        }
      } else {
        _projectList.push(item);
      }
    });

    // 对去重后保留的数组进行筛选，剔除已完成的内容

    let _returnArr = [];

    _returnArr = _projectList.filter(element => {
      return element.projectStatus !== 2;
    });

    return _returnArr;
  },

  // 对传入的不需要格式化时间戳的数据进行重新封装
  checkUnFormatDateData(obj) {
    const _returnArr = [];

    if (obj.length) {
      obj.forEach(item => {
        const _returnOne = {};

        _returnOne.prjId = item.projectId;
        _returnOne.prjName = item.projectTitle;
        _returnOne.prjDetail = item.projectDesc;
        _returnOne.prjType = item.projectType;
        _returnOne.prjStatus = item.projectStatus;
        _returnOne.planToFinish = item.projectWillDo;
        _returnOne.prjCurrentProcess = item.projectHasDone;
        _returnOne.prjStartTime = item.projectStartTime;
        _returnOne.prjEndTime = item.projectEndTime;

        _returnArr.push(_returnOne);
      });
    } else {
      const _returnOne = {};

      _returnOne.prjId = obj.projectId;
      _returnOne.prjName = obj.projectTitle;
      _returnOne.prjDetail = obj.projectDesc;
      _returnOne.prjType = obj.projectType;
      _returnOne.prjStatus = obj.projectStatus;
      _returnOne.planToFinish = obj.projectWillDo;
      _returnOne.prjCurrentProcess = obj.projectHasDone;
      _returnOne.prjStartTime = obj.projectStartTime;
      _returnOne.prjEndTime = obj.projectEndTime;

      _returnArr.push(_returnOne);
    }

    return _returnArr;
  },
};
