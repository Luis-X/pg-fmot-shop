let config = {}

// 生产
const proBase = {
  appId: 'wx827f7dbb8b3964c5',
  host: 'https://pgnews.shenghuojia.com',   
  fileUrl: 'https://storage.pg.com.cn',
  cmsConfig: {
    url: 'https://cms.shenghuojia.com/api/open/material-set',
    key: 'pg-china-news-center',
    tenantId: 15,
    seId: 'bTZXVkxNbWpOcnY5VXZFY3pIN1VIQUVLUHNqMUsyWm8=',
  },
  aclCallBack: 'http://pgnews.shenghuojia.com/aclCallback?callback=',
  aclUrl: 'https://acl.shenghuojia.com/acl/wx/oauth2/authorize?brandId=d22bfea181bf85c9cf5d96514b9b3ccc&scope=snsapi_userinfo&access_token=true&url='
}

// 开发
const qaBase = {
  appId: 'wx827f7dbb8b3964c5',
  host: 'https://pgnews-qa.shenghuojia.com', 
  fileUrl: 'https://storage-qa.pg.com.cn',
  cmsConfig: {
    url: 'https://cms-qa.shenghuojia.com/api/open/material-set',
    key: 'pg-china-news-center',
    tenantId: 15,
    seId: 'MVhHQmsyZVpZNkc2ZVh4U2oweWdENnBGYVU4amlxWE8=',
  },
  aclCallBack: 'http://pgnews-qa.shenghuojia.com/aclCallback?callback=',
  aclUrl: 'https://acl.shenghuojia.com/acl/wx/oauth2/authorize?brandId=d22bfea181bf85c9cf5d96514b9b3ccc&scope=snsapi_userinfo&access_token=true&url='
}

// 本地 代理
const localBase = {
  appId: 'wx827f7dbb8b3964c5',
  host: '',
  fileUrl: 'https://storage-qa.pg.com.cn',
  cmsConfig: {
    url: '/api/open/material-set',
    key: 'pg-china-news-center',
    tenantId: 15,
    seId: 'MVhHQmsyZVpZNkc2ZVh4U2oweWdENnBGYVU4amlxWE8=',
  },
  aclCallBack: 'http://pgnews-qa.shenghuojia.com/aclCallback?callback=',
  aclUrl: 'https://acl.shenghuojia.com/acl/wx/oauth2/authorize?brandId=d22bfea181bf85c9cf5d96514b9b3ccc&scope=snsapi_userinfo&access_token=true&url='
}

const flag = window.location.origin === qaBase.host ? 'qa' : 'release'

if (process.env.NODE_ENV === 'production') {
  console.log(flag)
  if (flag === 'qa') {
    config = qaBase
  } else {
    config = proBase
  }
} else if (process.env.NODE_ENV === 'development') {
  console.log('dev')
  config = localBase
} else {
  config = proBase
}

export default config