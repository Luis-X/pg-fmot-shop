export default {
   logger: {
    quiet: false,
    stats: true
  },
  mini: {},
  h5: {
    devServer: {
      host: 'localhost',
      port: 10086,
      proxy: {        
        '/api': {
          target: 'https://ministore-qa.shenghuojia.com',
          changeOrigin: true,
        },
        '/user': {
          target: 'https://ministore-qa.shenghuojia.com',
          changeOrigin: true,
        },
      }
    },
  }
}
