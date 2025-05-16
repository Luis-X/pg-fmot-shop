import CryptoJS from 'crypto-js';

const tools = {
  getToken: () => {   
    let token = localStorage.getItem('token') || '';
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
    // console.log(result) 
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