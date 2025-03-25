import axios from 'axios';
import CONFIG from '../config/const';
import * as URL from './URL';
import RoutePath from "../config/RoutePath";
import {Modal} from 'antd';

export const client = axios.create({
    baseURL: CONFIG.SERVER_HOST,
    // baseURL: '/',
    timeout: 180000,
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        'Pragma': 'no-cache',
        'Authorization': localStorage.getItem('token') || ''
    }
});

client.interceptors.response.use((response) => { //响应拦截
    const status = response.status;
    const code = response.data.code;
    if (status === 200) {
        if (code === -2) {
            if (localStorage.getItem('token')) {
                apiWarning('login timeout');//未登录/登录超时
            } else {
                // window.location.href = '/portal/result/2'
                // this.props.history.push(RoutePath.ResultWarning)
            }
        } else if (code === -3) {
            window.location.href = '/portal/result/3'
            // apiWarning(`You don't have access`);//没有权限访问
        } else {
            return Promise.resolve(response);
        }
    } else {
        return Promise.reject(response); //catch的拦截 如500等
    }
},(error)=>{
    // alert(JSON.stringify(error.response))
    // alert(error.response.status)
    window.location.href = '/portal/resultCode/'+`${error.response.status}`
})

export const apiWarning = (title) => {
    let secondsToGo = 3;
    const modal = Modal.warning({
        title: title,
        className: 'apiModal',
        content: secondsToGo === 0 ? 'Page Jump in progress...' : `Will log in again in ${secondsToGo} second!`,  //页面跳转中...' : `将在 ${secondsToGo} 秒后重新授权登录!
    });
    const timer = setInterval(() => {
        secondsToGo -= 1;
        modal.update({
            title: title,
            className: 'apiModal',
            content: secondsToGo === 0 ? 'Page Jump in progress...' : `Will log in again in ${secondsToGo} second!`,
        });
    }, 1000);
    setTimeout(() => {
        clearInterval(timer);
        modal.destroy();
        setTimeout(() => window.location.href = '/portal' + RoutePath.Index, 1000);
        // window.location.href = '/portal/#'+RoutePath.Index
    }, secondsToGo * 1000);
}

export const setToken = () => {
    // client.interceptors.request.use(function (config) {
    //     config.headers['Authorization'] = token;;
    //     return config;
    // });
    client.interceptors.request.use(config => {
            const token = localStorage.getItem("token");
            if (token) {
                // 判断是否存在token，如果存在的话，则每个http header都加上token
                config.headers['Authorization'] = token;
            }
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );
};

/*登录*/
export const userLogin = (param) => {
    return client.post(URL.userLogin, param);
};

/*用户列表*/
export const userList = (param) => {
    return client.post(URL.userList, param);
};

/*添加用户*/
export const userSave = (param) => {
    return client.post(URL.userSave, param);
};

/*账户登录控制*/
export const changeStatus = (param) => {
    return client.post(URL.changeStatus, param);
};

/*商户列表*/
export const storeList = (param) => {
    return client.post(URL.storeList, param);
};

/*market列表*/
export const marketData = () => {
    return client.get(URL.marketData);
};

/*商户禁用控制*/
export const storeChangeStatus = (param) => {
    return client.post(URL.storeChangeStatus, param);
};

/*添加商户*/
export const storeSave = (param) => {
    return client.post(URL.storeSave, param);
};

/*商户人员列表*/
export const ownerList = (param) => {
    return client.post(URL.ownerList, param);
};

/*人员列表禁用控制*/
export const employeeChangeStatus = (param) => {
    return client.post(URL.employeeChangeStatus, param);
};

/*人员列表设置店长*/
export const employeeSetLeader = (param) => {
    return client.post(URL.employeeSetLeader, param);
};

/*人员列表加入黑名单*/
export const addBlack = (param) => {
    return client.post(URL.addBlack, param);
};

/*黑名单列表*/
export const blackList = (param) => {
    return client.post(URL.blackList, param);
};

/*移除黑名单*/
export const removeBlack = (param) => {
    return client.post(URL.removeBlack, param);
};

/*修改商户绑定密码*/
export const changePassword = (param) => {
    return client.post(URL.changePassword, param);
};

/*修改商户绑定密码 new*/
export const changePasswordNew = (param) => {
    return client.post(URL.changePasswordNew, param);
};

// /*活动列表list*/
// export const eventList = (eventName, pageNo, pageSize) => {
//     return client.get(URL.eventList + `?pageNo=${pageNo}` + `&pageSize=${pageSize}` + `&eventName=${eventName}`);
// };

/*管理员SSO登陆接口*/
export const SsoLogin = (param) => {
    return client.post(URL.ssoLogin, param);
};

/*折扣活动列表*/
export const eventList = (param) => {
    return client.post(URL.eventList, param);
};

/*lineup列表*/
export const lineupList = (param) => {
    return client.post(URL.lineupList, param);
};

// /*lineup启用禁用*/
// export const lineupChangeStatus = (param) => {
//     return client.post(URL.lineupChangeStatus, param);
// };

/*新增lineup*/
export const lineupSave = (param) => {
    return client.post(URL.lineupSave, param);
};

/*生成二维码*/
export const GenerateQRCode = (param) => {
    return client.post(URL.GenerateQRCode, param);
};

/*二维码历史记录*/
export const QRCodeHistory = (param) => {
    return client.post(URL.QRCodeHistory, param);
};

/*重新生成二维码*/
export const regenerate = (param) => {
    return client.post(URL.regenerate, param);
};

/*report列表*/
export const reportList = (param) => {
    return client.post(URL.reportList, param);
};

/*log列表*/
export const logList = (param) => {
    return client.post(URL.logList, param);
};

/*保存折扣活动*/
export const saveEvent = (param) => {
    return client.post(URL.saveEvent, param);
};

/*发布折扣活动*/
export const publishEvent = (param) => {
    return client.post(URL.publishEvent, param);
};

/*折扣活动详情*/
export const eventDetail = (id) => {
    return client.get(URL.eventDetail + `/${id}`);
};

/*批量导入*/
export const importForAdmin = (param) => {
    return client.post(URL.importForAdmin, param);
};

/*批量导入优惠券结算*/
export const couponImportForAdmin = (param) => {
    return client.post(URL.couponImportForAdmin, param);
};

/*按EventId导出核销记录*/
// export const exportByEventId = (param) => {
//     return client.post(URL.exportByEventId, param);
// };

/*下载二维码回调*/
export const downLoadCallBack = (param) => {
    return client.post(URL.downloadSuccess, param);
};

/*退出系统*/
export const logout = (param) => {
    return client.post(URL.logout, param);
};
