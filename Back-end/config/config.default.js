'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1548235291595_2590';
  // add your config here
  config.middleware = [];

  config.security = {
    csrf: {
      useSession: true,
      cookieName: 'csrfToken',
      sessionName: 'csrfToken',
    },
  };

  // 允许跨域
  config.cors = {
    origin: 'http://everyone.guodc.top',
    allowMethods: 'GET, HEAD, PUT, POST, DELETE, PATCH',
    credentials: true,
  };

  return config;
};
