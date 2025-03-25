const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            //target: 'http://192.168.120.24:8080',
            target: 'https://dtiger-qa.pg.com',
            changeOrigin: true,
            secure:false,//是否忽略证书
        })
    );
    app.use(
        '/api/get',
        createProxyMiddleware({
            //target: 'http://192.168.120.24:8080',
            target: 'https://dtiger-qa.pg.com',
            changeOrigin: true,
            secure:false,//是否忽略证书
        })
    );
    app.use(
        '/api/admin',
        createProxyMiddleware({
            //target: 'http://192.168.120.24:8080',
            target: 'https://dtiger-qa.pg.com',
            changeOrigin: true,
            secure:false,//是否忽略证书
        })
    );
    app.use(
        '/admin/login',
        createProxyMiddleware({
            //target: 'http://192.168.120.24:8080',
            target: 'https://dtiger-qa.pg.com',
            changeOrigin: true,
            secure:false,
        })
    );
    app.use(
        '/admin/ssoLogin',
        createProxyMiddleware({
            //target: 'http://192.168.120.24:8080',
            target: 'https://dtiger-qa.pg.com',
            changeOrigin: true,
            secure:false,
        })
    );
    app.use(
        '/get',
        createProxyMiddleware({
            //target: 'http://192.168.120.24:8080',
            target: 'https://dtiger-qa.pg.com',
            changeOrigin: true,
            secure:false,
        })
    );
    app.use(
        '/salesReport',
        createProxyMiddleware({
            //target: 'http://192.168.120.24:8080',
            target: 'https://dtiger-qa.pg.com',
            changeOrigin: true,
            secure:false,
        })
    );
};
