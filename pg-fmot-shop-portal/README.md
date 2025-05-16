

### 一、发布到QA环境

- 访问 command + k 去访问：smb://dev.mtdxx.com
- 找到目录为：常用软件/devwebupload 的工具，下载到本地
- chmod + x 【devwebupload 对应的本地路径】
- 进入开发项目，执行【devwebupload 对应的本地路径】--urlPrefix "https://ministore-qa.shenghuojia.com/portal"  --buildDir "./build" --contentPath "portal"
- 工具会默认将 .build 路径内所有文件，上传并部署到QA环境

### 二、本地调试
1.从QA环境，获取token后，复制到本地
2.访问：http://localhost:3000/portal/#/internalAccount
3.写入qa环境的token
