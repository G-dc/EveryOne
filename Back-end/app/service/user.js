'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async findUser(uName) {
    const findUserResult = await this.app.mysql.get('user', { userName: uName });
    return { findUserResult };
  }

  async addUser(userInfo) {
    const insertUserResult = await this.app.mysql.insert('user', { userName: userInfo.userName, userPassword: userInfo.userPassword });
    return { insertUserResult };
  }

  async updateUserInfoById(userInfo) {
    const options = {
      where: {
        id: userInfo.id,
      },
    };
    const setUserIdResult = await this.app.mysql.update('user', userInfo, options);

    return { setUserIdResult };
  }

  async checkLoginStatus(userInfo, sessionInfo) {
    const checkLoginStatusResult = userInfo === sessionInfo ? 1 : 0;

    return { checkLoginStatusResult };
  }
}

module.exports = UserService;
