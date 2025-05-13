
let config = {
  appId: 'wx66f76f4c6ea64910',
}

const flag = window.location.origin === 'https://ministore-qa.shenghuojia.com' ? 'qa' : 'release'
console.log(flag)

if (process.env.NODE_ENV === 'development') {
  // console.log('本地环境');  
  const devHost = 'https://ministore-qa.shenghuojia.com'
  config.host = ''
  config.aclRedirectUrl = `${devHost}/aclRedirect`
  config.skId = 'MTIwNDdiNTQ1MThiNDI0NDhiMjBhZWIzOTRlZGNhMjQ='
  config.ssoCallbackUrl = `${devHost}/#/pages/ssoCallBack/index`
  config.ssoLoginUrl = 'https://api-shared-qa.cn-pgcloud.com/sso/v3/oauth/login?client_id=rdfmotshopping&app=rdfmotshopping&pfidpadapterid=ad..OAuth&scope=openid%20profile%20GDPR'
} else {
  if (flag === 'qa') {
    // console.log('测试环境');
    const qaHost = 'https://ministore-qa.shenghuojia.com'
    config.host = qaHost   
    config.aclRedirectUrl = `${qaHost}/aclRedirect`
    config.skId = 'MTIwNDdiNTQ1MThiNDI0NDhiMjBhZWIzOTRlZGNhMjQ='
    config.ssoCallbackUrl = `${qaHost}/#/pages/ssoCallBack/index`
    config.ssoLoginUrl = 'https://api-shared-qa.cn-pgcloud.com/sso/v3/oauth/login?client_id=rdfmotshopping&app=rdfmotshopping&pfidpadapterid=ad..OAuth&scope=openid%20profile%20GDPR'
  } else {
    // console.log('生产环境');
    const prodHost = 'https://ministore.shenghuojia.com'
    config.host = prodHost
    config.aclRedirectUrl = `${prodHost}/aclRedirect`
    config.skId = 'NmZmOGY4NmVkZDU1NDFhNTk4M2ZmNzg2NWRlMzAxODM='
    config.ssoCallbackUrl = `${prodHost}/#/pages/ssoCallBack/index`
    config.ssoLoginUrl = 'https://api-shared-prd.cn-pgcloud.com/sso/v3/oauth/login?client_id=rdfmotshopping&app=rdfmotshopping&pfidpadapterid=ad..OAuth&scope=openid%20profile%20GDPR'
  }
}

export default config