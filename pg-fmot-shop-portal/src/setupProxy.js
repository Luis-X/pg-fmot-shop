const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      //target: 'http://192.168.120.24:8080',
      target: 'https://ministore-qa.shenghuojia.com',
      changeOrigin: true,
      secure: false, //是否忽略证书
    })
  );
};
