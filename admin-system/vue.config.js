// 解决跨域问题
module.exports = {
  devServer: {
    proxy: {
      '/api': {  // 匹配所有以 /api 开头的请求
        target: 'http://localhost:8080',  // 后端服务地址
        changeOrigin: true,  // 允许改变请求头中的 origin
        pathRewrite: {
          '^/api': ''  // 重写路径，去掉 /api 前缀
        }
      }
    }
  }
}
