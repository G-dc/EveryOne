'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {

  /**
   * 注册 controller
   */
  async userRegist() {
    let userRegistResult = {};

    const ctx = this.ctx;
    const uName = ctx.request.body.userName;
    const findUserResult = await ctx.service.user.findUser(uName);

    const addUserInfo = ctx.request.body;

    if (!addUserInfo.userName || !addUserInfo.userPassword) {
      userRegistResult = {
        code: 500,
        msg: '用户名与密码为必填项',
        data: null,
      };
    } else {
      if (findUserResult.findUserResult) {
        // 假如已存在相同用户名的用户，提示重新注册新的用户名
        userRegistResult = {
          code: 400,
          msg: '该用户名已存在，请使用其他用户名',
          data: null,
        };
      } else {
        addUserInfo.userPassword = ctx.helper.contentEncrypt(addUserInfo.userPassword, 'md5');

        const addUserResult = await ctx.service.user.addUser(addUserInfo);

        if (addUserResult.insertUserResult.affectedRows === 1) {
          userRegistResult = {
            code: 200,
            msg: '用户注册成功',
            data: null,
          };

        } else {
          userRegistResult = {
            code: 500,
            msg: '用户注册失败，请检查注册信息或者稍后重新注册',
            data: null,
          };
        }
      }
    }
    ctx.response.body = userRegistResult;
  }

  /**
   * 登陆 controller
   */

  async userLogin() {
    let userLoginResult = {};

    const ctx = this.ctx;
    const uName = ctx.request.body.userName;
    const findUserResult = await ctx.service.user.findUser(uName);

    if (findUserResult.findUserResult) {
      const loginUserInfo = ctx.request.body;

      if (!loginUserInfo.userName || !loginUserInfo.userPassword) {
        userLoginResult = {
          code: 500,
          msg: '用户名与密码为必填项',
          data: null,
        };
      } else {
        const hexPwd = ctx.helper.contentEncrypt(loginUserInfo.userPassword, 'md5');

        if (hexPwd === findUserResult.findUserResult.userPassword && loginUserInfo.userName === findUserResult.findUserResult.userName) {

          findUserResult.findUserResult.userId = ctx.helper.contentEncrypt(findUserResult.findUserResult.userName + findUserResult.findUserResult.id, 'sha256');

          const updateUserInfoByIdResult = await ctx.service.user.updateUserInfoById(findUserResult.findUserResult);

          if (updateUserInfoByIdResult.setUserIdResult.affectedRows === 1) {
            userLoginResult = {
              code: 200,
              msg: '登陆成功',
              data: [],
            };

            ctx.rotateCsrfSecret();

            ctx.cookies.set('isLogin', undefined, {
              httpOnly: false,
              encrypt: false,
              signed: false,
              maxAge: 2000,
            });

            ctx.cookies.set('user', JSON.stringify(findUserResult.findUserResult), {
              httpOnly: false,
              encrypt: false,
              signed: false,
              maxAge: 3 * 24 * 3600 * 1000, // 有效期三天
            });

            ctx.cookies.set('user_id', ctx.session.csrfToken, {
              httpOnly: false,
              encrypt: false,
              signed: false,
              maxAge: 3 * 24 * 3600 * 1000, // 有效期三天
            });
          }
        } else {
          userLoginResult = {
            code: 400,
            msg: '用户名或者密码有误，请重新输入',
            data: null,
          };
        }
      }
    } else {
      userLoginResult = {
        code: 400,
        msg: '当前用户名未注册，请确认输入是否有误',
        data: null,
      };
    }

    ctx.response.body = userLoginResult;
  }

  /**
   * 注销 controller
   */
  async userLogout() {
    const ctx = this.ctx;

    ctx.session = null;

    ctx.response.body = {
      code: 200,
      msg: '注销成功',
    };
  }

  /**
   * 编辑个人信息 controller
   */

  async userUpdate() {
    let userUpdateResult = {};

    const ctx = this.ctx;
    const userInfo = ctx.request.body;

    userInfo.userPassword = ctx.helper.contentEncrypt(userInfo.userPassword, 'md5');
    delete userInfo._csrf;

    const updateUserInfoByIdResult = await ctx.service.user.updateUserInfoById(userInfo);

    if (updateUserInfoByIdResult.setUserIdResult.affectedRows === 1) {
      const findUserResult = await ctx.service.user.findUser(userInfo.userName);
      const _userInfo = [];

      _userInfo.push(findUserResult.findUserResult);

      userUpdateResult = {
        code: 200,
        msg: '个人信息更新成功',
        data: _userInfo,
      };
    } else {
      userUpdateResult = {
        code: 400,
        msg: '信息更新失败，请稍后重试',
        data: null,
      };
    }

    ctx.response.body = userUpdateResult;
  }

  /**
   * 检查登录状态
   */
  async userLoginStatus() {
    let userLoginStatusResult = {};

    const ctx = this.ctx;
    const userInfo = ctx.query.user_id;
    const sessionInfo = ctx.session.csrfToken;

    const checkLoginStatusResult = await ctx.service.user.checkLoginStatus(userInfo, sessionInfo);

    if (checkLoginStatusResult.checkLoginStatusResult === 1) {
      userLoginStatusResult = {
        code: 200,
        data: null,
        msg: '已登录',
      };
    } else {
      userLoginStatusResult = {
        code: 400,
        data: null,
        msg: '未登录',
      };
    }
    ctx.response.body = userLoginStatusResult;
  }
}

module.exports = UserController;
