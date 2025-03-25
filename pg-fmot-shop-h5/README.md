

# pg-fmot-shop-h5

online shopping app for FMOT H5

### 一、环境配置

###### 开发前的配置要求

1. Node 14.21.3

2. Taro 3.6.34 
   - 由3.6.22升级
   - 已知问题：在iPhone se 页面跳转2次
   - 已知问题：picker组件，在微信内，蒙层穿透，可滚动
   


### 二、使用到的框架

- [Taro 3](https://docs.taro.zone/docs/)
- [NUTUI 2.6.19](https://docs.taro.zone/docs/)



### 三、NPM私有包（需要PG的VPN）

"cms-request": "^1.0.0"

npm install --no-strict-ssl --registry=https://nexus.cn-pgcloud.com/repository/npm-public



### 四、发布到QA环境

- 访问 command + k 去访问：smb://dev.mtdxx.com
- 找到目录为：常用软件/devwebupload 的工具，下载到本地
- chmod + x 【devwebupload 对应的本地路径】
- 进入开发项目，执行【devwebupload 对应的本地路径】--urlPrefix "https://pgnews-qa.shenghuojia.com"
- 工具会默认将 .dist 路径内所有文件，上传并部署到QA环境

