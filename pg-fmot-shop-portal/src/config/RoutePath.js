let RoutePath = {
  Index: '/',
  Callback: '/callback',
  ResultWarning: '/result',
  ResultCodePage: '/resultCode',
  InternalAccount: '/internalAccount',
  ExternalAccount: '/externalAccount',
  EventMgmt: '/eventMgmt',
  OrderMgmt: '/orderMgmt',
  GoodsMgmt: '/goodsMgmt',
  TrackMgmt: '/trackMgmt',
  TrackDetail: '/trackDetail',

  //sso登录
  SsoUrlJump:
    window.location.origin === 'https://ministore.shenghuojia.com'
      ? 'https://api-shared-prd.cn-pgcloud.com/sso/v3/oauth/login?app=rdfmotshopping&client_id=rdfmotshopping&redirect_uri=https://ministore.shenghuojia.com/portal/callback&subscription-key=3m16q3nw17324Zh2&scope=openid%20profile%20GDPR' //生产
      : 'https://api-shared-qa.cn-pgcloud.com/sso/v3/oauth/login?app=rdfmotshopping&client_id=rdfmotshopping&redirect_uri=https://ministore-qa.shenghuojia.com/portal/callback&subscription-key=5ot2S43Wmg4oGBK2&scope=openid%20profile%20GDPR', //qa

  //sso登出
  SsoLogout:
    window.location.origin === 'https://ministore.shenghuojia.com'
      ? 'https://api-shared-prd.cn-pgcloud.com/sso/v3/logout?subscription-key=3m16q3nw17324Zh2&app=rdfmotshopping' //生产
      : 'https://api-shared-qa.cn-pgcloud.com/sso/v3/logout?subscription-key=5ot2S43Wmg4oGBK2&app=rdfmotshopping', //qa
};

export default RoutePath;
