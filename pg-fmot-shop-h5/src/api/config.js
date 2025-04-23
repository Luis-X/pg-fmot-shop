
let config = {
  appId: 'wx827f7dbb8b3964c5',
}

const flag = window.location.origin === 'https://ministore.shenghuojia.com' ? 'qa' : 'release'
console.log(flag)

if (process.env.NODE_ENV === 'development') {
  console.log('dev')
  console.log('本地环境');  
  config.host = ''  
  config.aclCallBack = 'https://ministore-qa.shenghuojia.com/aclCallback?callback='
  config.aclUrl = 'https://acl.shenghuojia.com/acl/wx/oauth2/authorize?brandId=d22bfea181bf85c9cf5d96514b9b3ccc&scope=snsapi_userinfo&access_token=true&url='
  config.skId = 'MTIwNDdiNTQ1MThiNDI0NDhiMjBhZWIzOTRlZGNhMjQ='
  config.ssoCallbackUrl = 'https://ministore-qa.shenghuojia.com/#/pages/ssoCallBack/index'
  config.ssoLoginUrl = 'https://api-shared-qa.cn-pgcloud.com/sso/v3/oauth/login?client_id=rdfmotshopping&app=rdfmotshopping&pfidpadapterid=ad..OAuth&scope=openid%20profile%20GDPR'
} else {
  if (flag === 'qa') {
    console.log('测试环境');
    config.host = 'https://ministore-qa.shenghuojia.com'    
    config.aclCallBack = 'https://ministore-qa.shenghuojia.com/aclCallback?callback='
    config.aclUrl = 'https://acl.shenghuojia.com/acl/wx/oauth2/authorize?brandId=d22bfea181bf85c9cf5d96514b9b3ccc&scope=snsapi_userinfo&access_token=true&url='
    config.skId = 'MTIwNDdiNTQ1MThiNDI0NDhiMjBhZWIzOTRlZGNhMjQ='
    config.ssoCallbackUrl = 'https://ministore-qa.shenghuojia.com/#/pages/ssoCallBack/index'
    config.ssoLoginUrl = 'https://api-shared-qa.cn-pgcloud.com/sso/v3/oauth/login?client_id=rdfmotshopping&app=rdfmotshopping&pfidpadapterid=ad..OAuth&scope=openid%20profile%20GDPR'
  } else {
    console.log('生产环境');
    config.host = 'https://ministore.shenghuojia.com'    
    config.aclCallBack = 'https://ministore.shenghuojia.com/aclCallback?callback='
    config.aclUrl = 'https://acl.shenghuojia.com/acl/wx/oauth2/authorize?brandId=d22bfea181bf85c9cf5d96514b9b3ccc&scope=snsapi_userinfo&access_token=true&url='
    config.skId = 'NmZmOGY4NmVkZDU1NDFhNTk4M2ZmNzg2NWRlMzAxODM='
    config.ssoCallbackUrl = 'https://ministore.shenghuojia.com/#/pages/ssoCallBack/index'
    config.ssoLoginUrl = 'https://api-shared-prd.cn-pgcloud.com/sso/v3/oauth/login?client_id=rdfmotshopping&app=rdfmotshopping&pfidpadapterid=ad..OAuth&scope=openid%20profile%20GDPR'
  }
}

export default config