/**
 * set some public function
 */

module.exports = {
  /**
   * @param {*} str —— 当前cookie内对应的name
   */
  getCookieVal (str) {
    if (document.cookie) {
      if (document.cookie.indexOf(str) > -1) {
        if (document.cookie.indexOf(';') > -1) {
          const _cookie = document.cookie.split(';')
          const _cookieData = _cookie.find((item) => {
            return item.indexOf(str) > -1
          })

          return _cookieData.split('=')[1]
        } else {
          return document.cookie.split('=')[1]
        }
      } else {
        return false
      }
    } else {
      return false
    }
  },

  /**
   * @param {*} obj —— 需要重置的对象
   * @param {*} bool —— 是否重置对象内所有属性值
   * @param {*} arr —— 不需要重置的属性名（数据形式传入，当bool为false时需要传入）
   */
  resetObject (obj, bool, arr) {
    if (bool) {
      for (let item in obj) {
        obj[item] = ''
      }
    } else {
      for (let item in obj) {
        if (arr.indexOf(item) === -1) {
          obj[item] = ''
        }
      }
    }
  },

  /**
   * @param {*} str —— 需要格式化的时间戳
   */
  formatDate (str) {
    const time = new Date(str)

    const year = time.getFullYear()
    const month = time.getMonth() + 1 > 9 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)
    const date = time.getDate() > 9 ? time.getDate() : '0' + time.getDate()

    return year + '-' + month + '-' + date
  }
}
