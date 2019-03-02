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
    },
  };

  // 允许跨域
  config.cors = {
    origin: ctx => ctx.get('origin'),
    allowMethods: 'GET, HEAD, PUT, POST, DELETE, PATCH',
    credentials: true,
  };

  config.jwt = {
    secret: '123456',
  };

  return config;
};
