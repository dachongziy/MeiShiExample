// 定义了各个路由页面
const router = {

    // app的启动页面
    'Splash': require('../pages/Splash'),

    'Login': require('../pages/Login'),
    // 下方的TabBarView组件
    'TabBarView': require('../pages/TabBarView'),
    // 扫描二维码组件
    'Scanner': require('../components/Scanner'),



    // home

    'Foods': require('../pages/home/Foods'),



    // feed

    'FeedDetail': require('../pages/feed/FeedDetail'),



    // profile

}



export default router
