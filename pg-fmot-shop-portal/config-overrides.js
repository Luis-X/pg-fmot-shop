const {override, fixBabelImports, overrideDevServer} = require('customize-cra');

const addProxy = () => configFunction => ({
    ...configFunction,
    compress: true,
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'https://ministore-qa.shenghuojia.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  })

module.exports = {
    webpack: override(
        fixBabelImports('import', {
            libraryName: 'antd',
            style: 'css',
            // options: {
            //     lessOptions: { // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
            //         modifyVars: {
            //             'primary-color': '#1DA57A',
            //             'link-color': '#1DA57A',
            //             'border-radius-base': '2px',
            //         },
            //         javascriptEnabled: true,
            //     },
            // },
        }
        )
    ),
        
    devServer: overrideDevServer(addProxy())
};