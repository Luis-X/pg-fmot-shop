export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/login/index',
    'pages/home/index',  
    'pages/cart/index',
    'pages/mine/index',  
    'pages/search/index',
    'pages/detail/index',
    'pages/orderConfirm/index',
    'pages/orderDetail/index',
    'pages/exchange/index',
    'pages/service/index',
    'pages/disable/index',
  ],
  tabBar: {
    custom: false,
    color: "#000000",
    selectedColor: "#DC143C",
    backgroundColor: "#ffffff",
    list: [
      {
        iconPath: 'images/home.png',
        selectedIconPath: 'images/home_on.png',
        pagePath: 'pages/home/index',
        text: '',
      },
      {
        iconPath: 'images/cart.png',
        selectedIconPath: 'images/cart_on.png',
        pagePath: 'pages/cart/index',
        text: '',
      },
      {
        iconPath: 'images/mine.png',
        selectedIconPath: 'images/mine_on.png',
        pagePath: 'pages/mine/index',
        text: '',
      },
    ],
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'FMOT SHOP',
    navigationBarTextStyle: 'black'
  }
})
