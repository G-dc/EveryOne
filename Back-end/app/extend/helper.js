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
};
