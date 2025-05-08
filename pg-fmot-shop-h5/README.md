

# pg-fmot-shop-h5

mini store for FMOT H5

### 一、环境配置

###### 开发前的配置要求

1. Node 16.20.2
2. Taro 3.6.35


### 二、使用到的框架

- [Taro 3](https://docs.taro.zone/docs/)
- [NUTUI 2.7.10](https://docs.taro.zone/docs/)


### 三、发布到QA环境

- 访问 command + k 去访问：smb://dev.mtdxx.com
- 找到目录为：常用软件/devwebupload 的工具，下载到本地
- chmod + x 【devwebupload 对应的本地路径】
- 进入开发项目，执行【devwebupload 对应的本地路径】--urlPrefix "https://ministore-qa.shenghuojia.com"
- 工具会默认将 .build 路径内所有文件，上传并部署到QA环境

