//import React, {lazy, Suspense} from 'react';
import React from 'react';
import RoutePath from '../config/RoutePath';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import AuthRoute from '../components/AuthRoute'
import SsoLogin from '../views/sso/SsoLogin';   //登录
import UserManage from "../views/user/UserManage"; //用户管理
import StoreList from "../views/store/StoreList";
import ShopConfig from "../views/store/ShopConfig";
import SsoCallback from "../views/sso/SsoCallback";   //sso
// import Login from "../views/Login"; //账号密码登录
import Lineup from "../views/lineup/Lineup";
import Event from "../views/event/Event";
import Report from "../views/report/Report";
import Log from "../views/log/Log";
import ResultWarning from "../views/result/ResultWarning";
import ResultCodePage from "../views/result/ResultCodePage";
// import Logout from "../views/sso/SsoLogout";   //sso

import InternalAccount from "../views/internalAccount/InternalAccount";
import ExternalAccount from "../views/externalAccount/ExternalAccount";
import EventMgmt from "../views/eventMgmt/EventMgmt";
import OrderMgmt from "../views/orderMgmt/OrderMgmt";
import GoodsMgmt from "../views/goodsMgmt/GoodsMgmt";
import TrackMgmt from "../views/trackMgmt/TrackMgmt";
import TrackDetail from "../views/trackMgmt/TrackDetail";

const Root = () => (
    <Router basename={'/portal'}>
        <Switch>
            <Route exact path={RoutePath.Index} component={SsoLogin}/>
            {/*这是一个登录页面,本地调试（qa）可以打开，建议上生产关闭. 账号密码（pactera/pactera）*/}
            {/*<Route exact path={RoutePath.Login} component={Login}/>*/}
            <Route exact path={RoutePath.Callback} component={SsoCallback}/>
            <AuthRoute exact path={RoutePath.UserManage} component={UserManage}/>
            <AuthRoute exact path={RoutePath.StoreList} component={StoreList}/>
            <AuthRoute exact path={RoutePath.ShopConfig} component={ShopConfig}/>
            <AuthRoute exact path={RoutePath.Lineup} component={Lineup}/>
            <AuthRoute exact path={RoutePath.Event} component={Event}/>
            <AuthRoute exact path={RoutePath.Report} component={Report}/>
            <AuthRoute exact path={RoutePath.Log} component={Log}/>
            <Route exact path={RoutePath.ResultWarning+ "/:id"} component={ResultWarning}/>
            <Route exact path={RoutePath.ResultCodePage+ "/:code"} component={ResultCodePage}/>
            {/*<Route exact path={RoutePath.Logout} component={Logout}/>*/}

            <AuthRoute exact path={RoutePath.InternalAccount} component={InternalAccount}/>
            <AuthRoute exact path={RoutePath.ExternalAccount} component={ExternalAccount}/>
            <AuthRoute exact path={RoutePath.EventMgmt} component={EventMgmt}/>
            <AuthRoute exact path={RoutePath.OrderMgmt} component={OrderMgmt}/>
            <AuthRoute exact path={RoutePath.GoodsMgmt} component={GoodsMgmt}/>
            <AuthRoute exact path={RoutePath.TrackMgmt} component={TrackMgmt}/>
            <AuthRoute exact path={RoutePath.TrackDetail+ "/:id"} component={TrackDetail}/>
            
        </Switch>
    </Router>
);

export default Root;
