let RoutePath = {
    Index: '/',
    Callback: '/callback',
    // Login: '/login',
    UserManage: '/user',
    StoreList: '/store/storeList',
    ShopConfig: '/store/shopConfig',
    Event: '/event',
    Report: '/report',
    Log: '/log',
    Lineup: '/lineup',
    ResultWarning:'/result',
    ResultCodePage:'/resultCode',
    // Logout: '/logout',
    InternalAccount: '/internalAccount',
    ExternalAccount: '/externalAccount',
    EventMgmt: '/eventMgmt',
    OrderMgmt: '/orderMgmt',
    GoodsMgmt: '/goodsMgmt',
    TrackMgmt: '/trackMgmt',
    TrackDetail: '/trackDetail',

    SsoUrlJump: window.location.origin === 'https://dtiger.pg.com' ?
        'https://fedauth.pg.com/as/authorization.oauth2?client_id=dtiger&response_type=code&redirect_uri=https://dtiger.pg.com/portal/callback&scope=openid+profile&pfidpadapterid=OAuth&access_token_manager_id=OAuth3'//生产
        :
        'https://fedauthtst.pg.com/as/authorization.oauth2?client_id=dtiger&response_type=code&redirect_uri=https://dtiger-qa.pg.com/portal/callback&scope=openid+profile&pfidpadapterid=OAuth&access_token_manager_id=OAuth3',//qa

     //sso登出
    SsoLogout: window.location.origin === 'https://dtiger.pg.com' ?
        'https://fedauth.pg.com/ext/logout'//生产
        :
        'https://fedauthtst.pg.com/ext/logout',//qa
};

export default RoutePath;
