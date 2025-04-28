const isRelease = window.location.origin === 'https://ministore.shenghuojia.com' ? true : false

let RoutePath = {
  Index: '/',
  Callback: '/callback',
  ResultWarn: '/result',
  ResultCode: '/resultCode',
  InternalAccount: '/internalAccount',
  ExternalAccount: '/externalAccount',
  EventMgmt: '/eventMgmt',
  OrderMgmt: '/orderMgmt',
  GoodsMgmt: '/goodsMgmt',
  TrackMgmt: '/trackMgmt',
  TrackDetail: '/trackDetail',
};

if (isRelease) {
  console.log('生产环境');
  RoutePath.skId = 'NmZmOGY4NmVkZDU1NDFhNTk4M2ZmNzg2NWRlMzAxODM='
  RoutePath.SSOCallbackUrl = 'https://ministore.shenghuojia.com/portal/#/callback'
  RoutePath.SSOLoginUrl = 'https://api-shared-prd.cn-pgcloud.com/sso/v3/oauth/login?client_id=rdfmotshopping&app=rdfmotshopping&pfidpadapterid=ad..OAuth&scope=openid%20profile%20GDPR'
  RoutePath.SSOLogoutUrl = 'https://api-shared-prd.cn-pgcloud.com/sso/v3/logout?app=rdfmotshopping'
  RoutePath.H5ActivityUrl = 'https://ministore.shenghuojia.com/aclRedirect'
} else {
  console.log('测试环境');
  RoutePath.skId = 'MTIwNDdiNTQ1MThiNDI0NDhiMjBhZWIzOTRlZGNhMjQ='
  RoutePath.SSOCallbackUrl = 'https://ministore-qa.shenghuojia.com/portal/#/callback'
  RoutePath.SSOLoginUrl = 'https://api-shared-qa.cn-pgcloud.com/sso/v3/oauth/login?client_id=rdfmotshopping&app=rdfmotshopping&pfidpadapterid=ad..OAuth&scope=openid%20profile%20GDPR'
  RoutePath.SSOLogoutUrl = 'https://api-shared-qa.cn-pgcloud.com/sso/v3/logout?app=rdfmotshopping'
  RoutePath.H5ActivityUrl = 'https://ministore-qa.shenghuojia.com/aclRedirect'
}

console.log('RoutePath', RoutePath)

export default RoutePath;
