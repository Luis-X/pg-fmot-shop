import $ from 'jquery';
import * as URL from '../api/URL';

const utils = {
 // 根据类型下载模板文件
 downloadTemplateFile: (type) => {
  console.log(type);
  let url;
  let fileName = 'template.xlsx';
  if (type === 101) {
    // 内部，账户导入模板
    url = URL.internalAccountImportTemplate;
    fileName = 'internal account template.xlsx';
  } else if (type === 102) {
    // 内部，积分导入模板
    url = URL.internalAccountImportTemplatePoints;
    fileName = 'internal points template.xlsx';
  } else if (type === 201) {
    // 外部，账户导入模板
    url = URL.externalAccountImportTemplate;
    fileName = 'external account template.xlsx';
  } else if (type === 202) {
    // 外部，积分导入模板
    url = URL.externalAccountImportTemplatePoints;
    fileName = 'external points template.xlsx';
  } else {
    console.error('未识别的模板类型');
    
    return;
  }
  console.log(url);

  var xhh = new XMLHttpRequest();
  xhh.open('post', url, true);
  // xhh.setRequestHeader("Authorization", localStorage.getItem('token'));
  xhh.setRequestHeader('Authorization', localStorage.getItem('token'));
  xhh.setRequestHeader('Content-Type', 'application/json');
  xhh.responseType = 'blob';

  xhh.onload = function () {
    if (this.status === 200) {
      var blob = this.response;
      var reader = new FileReader();
      reader.readAsDataURL(blob); // 转换为base64，可以直接放入a表情href
      reader.onload = function (e) {
        // 转换完成，创建a标签用于下载
        var a = document.createElement('a');        
        a.download = fileName;
        a.href = e.target.result;
        $('body').append(a);
        a.click();
        $(a).remove();
      };
    }
  };
  xhh.send();
},

// urls转files
imgUrlsToFiles: (imgUrls) => {
  let list = [];
  imgUrls.forEach((item) => {
    const url = item || '';
    if (url) {
      list.push({
        url: url,
      });
    }
  });
  return list;
},

// files转urls
filesToImgUrls: (files) => {
  let list = [];
  files.forEach((item) => {
    const url = item.url || '';
    if (url) {
      list.push(url);
    }
  });
  return list;
}
};

export default utils;