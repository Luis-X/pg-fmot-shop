const tools = {
  getToken: () => {   
    let token = localStorage.getItem('token') || '';
     // FIXME: 调试
     // 1.从QA环境，获取token后，复制到本地
     // 2.访问：http://localhost:3000/portal/#/internalAccount
    token = ''
    return token;
  },
};

export default tools;