const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    devServer: {
        host: '127.0.0.1',
        port: 9999,
        proxy: {
            '/tainbo':{
                target:'http://172.16.20.83:80',
                ws:true,
            },
            '/smartcity': {
                //target:'172.16.20.83:80',
                target: 'http://172.16.20.84:8888',
                //target: 'http://172.16.40.156:8888',
                //target:'http://127.0.0.1:8888',// 请求本地 需要xboot后台项目
                ws: true
            },
            '/foo': {
                target: '<other_url>'
            }
        },
    },
    // 打包时不生成.map文件 避免看到源码
    productionSourceMap: false,
    // 部署优化
    configureWebpack: {
        // 使用CDN
        externals: {
            vue: 'Vue',
            axios: 'axios',
            'vue-router': 'VueRouter',
            vuex: 'Vuex',
            iview: 'iview',
            echarts: 'echarts',
            apexcharts: 'ApexCharts',
            'vue-apexcharts': 'VueApexCharts',
            xlsx: 'XLSX',
            dplayer: 'DPlayer',
            gitalk: 'Gitalk',
            AMap: 'AMap' // 高德地图配置
        },
        // GZIP压缩
        plugins: [
            new CompressionPlugin({
                test: /\.js$|\.html$|\.css/, // 匹配文件
                threshold: 10240 // 对超过10k文件压缩
            })
        ]
    },
    chainWebpack: config => {
        config.module
            .rule('swf')
            .test(/\.swf$/)
            .use('url-loader')
            .loader('url-loader')
            .tap(options => {
                return {
                    limit: 10000
                }
            })
    }
}
