
import * as api from '../api/api';
import MyAlert from '../components/MyAlert';

// 1. 开始上传分片
const startUploadChunk = async (file) => {
  console.log('---文件开始上传---')

  const chunkSize = 1024 * 1024 * 10;                 // 每个分片 10MB
  const chunks = Math.ceil(file.size / chunkSize);    // 大文件总的分片数
  const fileMD5 = await calculateFileMD5(file);       // 大文件的文件md5值
  const fileType = file.type;                        // 文件类型
  const fileName = file.name;                        // 文件名称

  // 分片
  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(file.size, start + chunkSize);
    const chunkBlob = file.slice(start, end);
    const chunkFileName = `chunk_${i}.${file.name.split('.').pop()}`;   // 根据原文件名生成新的分片文件名
    const chunkFileType = file.type;                                    // 沿用原文件的类型
    const chunkFile = new File([chunkBlob], chunkFileName, {
      type: chunkFileType,
      lastModified: Date.now() // 设置文件的最后修改时间为当前时间
    });
    
    await requestSignChunkData({
      chunks: chunks,
      chunk: i,
      fileMd5: fileMD5,
      type: fileType,
      name: fileName,
    }, chunkFile)
  }

  console.log('---文件上传完成---')

  console.log('---分片合并开始---')
  await requestSignChunkMergeData({
    chunks: chunks,
    fileMd5: fileMD5,
    type: fileType,
    name: fileName,
  });
  console.log('---分片合并完成---')
};
  
// 一、计算文件 MD5
const calculateFileMD5 = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      const buffer = reader.result;
      const md5 = require('blueimp-md5')(buffer);
      resolve(md5);
    };
  });
};

// 二、获取分片签名 & 上传分片
const requestSignChunkData = async (params, chunkFile) => {
  console.log('获取分片签名', params.chunk)
  await api.uploadFileSignChunk(params).then( async (res) => {
    if (res) {
      const respData = res.data || {};
      if (0 === respData.code) {
        console.log('获取分片签名，成功', respData)
        const signInfo = respData.data || {};
        await requestUploadChunkFile(signInfo.params, chunkFile);
      } else {
        console.log('获取分片签名，错误')
        MyAlert({ errorMsg: respData.message });
      }
    }
  }).catch((err) => {
    console.log('获取分片签名，失败')
  })
};

const requestUploadChunkFile = async (signParams, file) => {
  console.log('上传分片', signParams.chunk)
  const formData = new FormData();
  formData.append('signature', signParams.signature);
  formData.append('subscriptionKey', signParams.subscriptionKey);
  formData.append('public', signParams.public);
  formData.append('timestamp', signParams.timestamp);
  formData.append('userId', signParams.userId);
  formData.append('file', file, file.name);                
  formData.append('chunks', signParams.chunks);
  formData.append('chunk', signParams.chunk);
  formData.append('fileMd5', signParams.fileMd5);
  formData.append('type', signParams.type);
  formData.append('name', signParams.name);
  await api.uploadFilePost(formData).then((res) => {
    if (res) {
      const respData = res.data || {};        
      const errorCode = respData.errorCode || '';
      if (!errorCode) {  
        console.log('上传分片，成功')          
      } else {
        console.log('上传分片，错误')
        MyAlert({ errorMsg: '上传分片失败，请重试!' });
      }
    }      
  }).catch((err) => {
    console.log('上传分片，失败')
  })
}

// 三、获取合并分片签名 & 合并分片
const requestSignChunkMergeData = async (params) => {   
  console.log('获取合并分片签名')
  await api.uploadFileSignChunkMerge(params).then((res) => {
    if (res) {
      const respData = res.data || {};
      if (0 === respData.code) {
        console.log('获取合并分片签名，成功', respData)
        const signInfo = respData.data || {};
        requestUploadFileMerge(signInfo.params);
      } else {
        console.log('获取合并分片签名，错误')
        MyAlert({ errorMsg: respData.message });
      }
    }
  }).catch((err) => {
    console.log('获取合并分片签名，失败')
  })
};

const requestUploadFileMerge = (signParams) => {
  console.log('合并分片')
  const formData = new FormData();
  formData.append('signature', signParams.signature);
  formData.append('subscriptionKey', signParams.subscriptionKey);
  formData.append('public', signParams.public);
  formData.append('timestamp', signParams.timestamp);
  formData.append('userId', signParams.userId);               
  formData.append('chunks', signParams.chunks);
  formData.append('fileMd5', signParams.fileMd5);
  formData.append('type', signParams.type);
  formData.append('name', signParams.name);
  api.uploadFileMergePost(formData).then( async (res) => {
    if (res) {
      const respData = res.data || {};        
      const fileId = respData.fileId || '';
      const url = respData.url || '';
      if (url) {
        console.log('合并分片，成功', url);
      } else if (fileId) {  
        console.log('合并分片，成功', fileId)  
        await requestFileUrl(fileId);        
      } else {
        console.log('合并分片，错误')
        MyAlert({ errorMsg: '合并分片失败，请重试!' });
      }
    }
  }).catch((err) => {
    console.log('合并分片，失败')
  })
}

// 四、通过fileId获取url
const requestFileUrl = async (fileId) => {
  console.log('通过fileId获取url', fileId);          
  const fileUrlResp = await api.uploadFileGetUrl([fileId]);
  const respData = fileUrlResp.data || {};
  if (0 === respData.code) {
    const fileData = respData.data || {};
    const fileUrl = fileData[fileId] || '';
    console.log('获取url成功', fileUrl);
  } else {
    console.log('获取url失败', fileId);
    MyAlert({ errorMsg: respData.message });
  }    
}

// 五、获取检查分片签名
/*
const requestSignChunkCheckData = async (params) => {   
  console.log('获取检查分片签名', params)
  await api.uploadFileSignChunkCheck(params).then((res) => {
    if (res) {
      const respData = res.data || {};
      if (0 === respData.code) {
        console.log('获取检查分片签名，成功', respData)
        const signInfo = respData.data || {};
        requestUploadFileCheckChunk(signInfo.params);
      } else {
        console.log('获取检查分片签名，错误')
        MyAlert({ errorMsg: respData.message });
      }
    }
  }).catch((err) => {
    console.log('获取检查分片签名，失败')
  })
};

const requestUploadFileCheckChunk = (signParams) => {
  console.log('检查分片', signParams)
    const formData = new FormData();
  formData.append('signature', signParams.signature);
  formData.append('subscriptionKey', signParams.subscriptionKey);
  formData.append('public', signParams.public);
  formData.append('timestamp', signParams.timestamp);
  formData.append('chunkSize', signParams.chunkSize);
  formData.append('chunk', signParams.chunk);
  formData.append('fileMd5', signParams.fileMd5);
  api.uploadFileCheckChunkPost(formData).then((res) => {
    if (res) {
      const respData = res.data || {};        
      const isExist = respData.isExist;
      if (isExist) {  
        console.log('检查分片，存在')                
      } else {
        console.log('检查分片，不存在')
      }
    }
  }).catch((err) => {
    console.log('检查分片，失败')
  })
}
*/

export default {
  startUploadChunk,
}