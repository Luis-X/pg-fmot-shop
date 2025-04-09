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
      ? 'https://api-shared-prd.cn-pgcloud.com/sso/v3/oauth/login?client_id=rdfmotshopping&app=rdfmotshopping&subscription-key=6ff8f86edd5541a5983ff7865de30183&pfidpadapterid=ad..OAuth&redirect_uri=https://ministore.shenghuojia.com/test&scope=openid%20profile%20GDPR' //生产
      : 'https://api-shared-qa.cn-pgcloud.com/sso/v3/oauth/login?client_id=rdfmotshopping&app=rdfmotshopping&subscription-key=12047b54518b42448b20aeb394edca24&pfidpadapterid=ad..OAuth&redirect_uri=https://ministore-qa.shenghuojia.com/test&scope=openid%20profile%20GDPR', //qa

  //sso登出
  SsoLogout:
    window.location.origin === 'https://ministore.shenghuojia.com'
      ? 'https://api-shared-prd.cn-pgcloud.com/sso/v3/logout?subscription-key=6ff8f86edd5541a5983ff7865de30183&app=rdfmotshopping' //生产
      : 'https://api-shared-qa.cn-pgcloud.com/sso/v3/logout?subscription-key=12047b54518b42448b20aeb394edca24&app=rdfmotshopping', //qa
};

export default RoutePath;
