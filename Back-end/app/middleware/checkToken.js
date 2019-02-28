'use strict';

module.exports = (options, app) => {
  return async function(ctx, next) {
    if (ctx.request.header.authorization) {
      let token = ctx.request.header.authorization.split(' ')[1];


      try {
        const decodedToken = app.jwt.verify(token, app.config.jwt.secret);

        delete decodedToken.iat;
        delete decodedToken.exp;

        token = app.jwt.sign(decodedToken, app.config.jwt.secret, {
          expiresIn: '1d',
        });

        ctx.cookies.set('TOKEN', token, {
          httpOnly: false,
          encrypt: false,
          signed: false,
          overwrite: true,
          maxAge: 3 * 24 * 3600 * 1000,
        });
        await next();
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          ctx.status = 401;
          ctx.body = {
            message: '登录信息已过期，请重新登录',
          };
          return;
        }
      }
    } else {
      ctx.status = 401;
      ctx.body = {
        message: 'token失效，请重新登录',
      };
      return;
    }
  };
};
