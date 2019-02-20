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
};
