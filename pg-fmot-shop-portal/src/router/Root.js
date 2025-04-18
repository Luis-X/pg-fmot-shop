import React from 'react';
import RoutePath from '../config/RoutePath';
import { BrowserRouter as Router, Switch, Route, HashRouter } from 'react-router-dom';
import AuthRoute from '../components/AuthRoute';

import SsoLogin from '../views/sso/SsoLogin';
import SsoCallback from '../views/sso/SsoCallback';

import ResultWarn from '../views/result/ResultWarn';
import ResultCode from '../views/result/ResultCode';

import InternalAccount from '../views/internalAccount/InternalAccount';
import ExternalAccount from '../views/externalAccount/ExternalAccount';
import EventMgmt from '../views/eventMgmt/EventMgmt';
import OrderMgmt from '../views/orderMgmt/OrderMgmt';
import GoodsMgmt from '../views/goodsMgmt/GoodsMgmt';
import TrackMgmt from '../views/trackMgmt/TrackMgmt';
import TrackDetail from '../views/trackMgmt/TrackDetail';

const Root = () => (
  <HashRouter>
    {/* <Router basename={'/portal'}> */}
      <Switch>
        <Route exact path={RoutePath.Index} component={SsoLogin} />
        <Route exact path={RoutePath.Callback} component={SsoCallback} />

        <Route exact path={RoutePath.ResultWarn + '/:code'} component={ResultWarn} />
        <Route exact path={RoutePath.ResultCode + '/:code'} component={ResultCode} />

        <AuthRoute exact path={RoutePath.InternalAccount} component={InternalAccount} />
        <AuthRoute exact path={RoutePath.ExternalAccount} component={ExternalAccount} />
        <AuthRoute exact path={RoutePath.EventMgmt} component={EventMgmt} />
        <AuthRoute exact path={RoutePath.OrderMgmt} component={OrderMgmt} />
        <AuthRoute exact path={RoutePath.GoodsMgmt} component={GoodsMgmt} />
        <AuthRoute exact path={RoutePath.TrackMgmt} component={TrackMgmt} />
        <AuthRoute exact path={RoutePath.TrackDetail + '/:id'} component={TrackDetail} />
      </Switch>
    {/* </Router> */}
  </HashRouter>
);

export default Root;
