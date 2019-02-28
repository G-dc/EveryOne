'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1548235291595_2590';
  // add your config here
  config.middleware = [];

  config.security = {
    csrf: {
      enable: false,
      // useSession: true,
      // cookieName: 'csrfToken',
      // sessionName: 'csrfToken',
    },
  };

  // 允许跨域
  config.cors = {
    origin: ctx => ctx.get('origin'),
    // origin: 'http://everyone.guodc.top',
    // origin: 'http://127.0.0.1:8080',
    allowMethods: 'GET, HEAD, PUT, POST, DELETE, PATCH',
    credentials: true,
  };

  config.jwt = {
    secret: '123456',
  };

  return config;
};
