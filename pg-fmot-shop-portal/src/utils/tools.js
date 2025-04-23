import CryptoJS from 'crypto-js';

const tools = {
  getToken: () => {   
    let token = localStorage.getItem('token') || '';
    // FIXME: 调试
    // 1.从QA环境，获取token后，复制到本地
    // 2.访问：http://localhost:3000/portal/#/internalAccount
    // token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyZC1mbW90LXNob3BwaW5nIiwiYXVkIjoicmQtZm1vdC1zaG9wcGluZyIsIm5iZiI6MTc0NTM3MjEzOCwicm9sZSI6IndlYi1hZG1pbiIsImRhdGEiOiJ7fSIsImlzcyI6InJkLWZtb3Qtc2hvcHBpbmciLCJleHAiOjE3NDU0MDA5MzgsImlhdCI6MTc0NTM3MjEzOCwidXNlcklkIjoiMSJ9.gtUNK2-gMWC-5LY-M_zRJ4n1bcE4kmfym-QTvyp9rn8'
    return token;
  },
  encodeBaseStr: (str) => {
    let result = ''
    try {
      const utf8Bytes = CryptoJS.enc.Utf8.parse(str);
      result = CryptoJS.enc.Base64.stringify(utf8Bytes);
    } catch (error) {
      console.log(error)
    } 
    console.log(result) 
    return result
  },
  decodeBaseStr: (str) => {
    let result = ''
    try {
      const words = CryptoJS.enc.Base64.parse(str);
      result = CryptoJS.enc.Utf8.stringify(words);
    } catch (error) {
      console.log(error)
    } 
    return result
  },
};

export default tools;