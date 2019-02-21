'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = this.ctx.session;

    this.ctx.cookies.set('user_id', this.ctx.session.csrfToken, {
      httpOnly: false,
      encrypt: false,
      signed: false,
      maxAge: 3 * 24 * 3600 * 1000, // 有效期三天
    });
  }
}

module.exports = HomeController;
