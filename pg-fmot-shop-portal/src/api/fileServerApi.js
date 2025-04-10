import * as api from './api';
import MyAlert from '../components/MyAlert';

// 上传时获取签名
const getUploadFileSignature = (params, cb, errCb) => {
  const paramsData = {
    signatureType: 'UPLOAD_CHUNKS',
    fileMd5: params.fileMd5,
    chunks: params.fileChunks,
    chunk: params.curChunkIndex,
    chunkSize: params.curChunkSize,
    type: params.fileType,
    name: params.fileName,
    isPublic: false,
  };
  api.uploadFileSign(paramsData, cb, errCb).then((res) => {
    if (res) {
      cb(res);
    }
  }).catch((err) => {
    MyAlert({
      title: '签名异常',
      errorMsg: '获取上传签名异常，请稍后重试！',
    });
    if (errCb) {
      errCb();
    }
  });
};

// 合并时获取签名
const getMergeChunkSignature = (params, cb, errCb) => {
  const paramsData = {
    signatureType: 'MERGE',
    fileMd5: params.fileMd5,
    chunks: params.fileChunks,
    type: params.fileType,
    name: params.fileName,
    isPublic: false,
  };
  api.uploadFileSign(paramsData, cb, errCb).then((res) => {
    cb(res);
  }).catch((err) => {
    MyAlert({
      title: '签名异常',
      errorMsg: '获取上传签名异常，请稍后重试！',
    });
    if (errCb) {
      errCb();
    }
  });
};

// FileIdToUrl
const getFileIdToUrlSignature = (params, cb, errCb) => {
  const paramsData = {
    signatureType: 'UPLOAD',
    isPublic: false,
  };
  api.uploadFileGetUrl(paramsData, cb, errCb).then((res) => {
    if (res) {
      cb(res);
    }
  }).catch((err) => {
    MyAlert({
      title: '签名异常',
      errorMsg: '获取上传签名异常，请稍后重试！',
    });
    if (errCb) {
      errCb();
    }
  });
};

// 切片上传
const uploadFileChunk = (params, cb, errCb) => {
  const formData = new FormData();
  formData.append('public', `${false}`);
  formData.append('timestamp', params.timestamp);
  formData.append('chunks', `${params.fileChunks}`);
  formData.append('chunk', `${params.curChunkIndex}`);
  formData.append('fileMd5', params.fileMd5);
  formData.append('type', params.fileType);
  formData.append('name', params.fileName);
  formData.append('file', params.fileBlob, params.fileName);
  formData.append('subscriptionKey', params.subscriptionKey);
  formData.append('signature', params.signature);

  api.uploadFile(formData).then((res) => {
    cb(res);
  }).catch((err) => {
    MyAlert({ title: '服务器异常', errorMsg: '上传失败请重新上传！' });
    if (errCb) {
      errCb();
    }
  });
};

// 合并切片
const mergeFileChunks = (params, cb, errCb) => {
  const formData = new FormData();
  formData.append('public', `${false}`);
  formData.append('timestamp', params.timestamp);
  formData.append('chunks', `${params.fileChunks}`);
  formData.append('fileMd5', params.fileMd5);
  formData.append('type', params.fileType);
  formData.append('name', params.fileName);
  formData.append('subscriptionKey', params.subscriptionKey);
  formData.append('signature', params.signature);

  api.uploadFileChunkMerge(formData).then((res) => {
    cb(res);
  }).catch((err) => {
    MyAlert({ title: '服务器异常', errorMsg: '合并切片失败！' });
    if (errCb) {
      errCb();
    }
  });
};

// 文件每一片大小配置 单位MB
const chunkSizePre = 10; // MB

export default {
  getUploadFileSignature,
  uploadFileChunk,
  getMergeChunkSignature,
  mergeFileChunks,
  getFileIdToUrlSignature,
  chunkSizePre,
};
