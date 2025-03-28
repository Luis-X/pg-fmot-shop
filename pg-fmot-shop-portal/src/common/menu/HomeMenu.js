import React, { Component } from 'react';
import { Menu, Layout } from 'antd';
// import {connect} from 'react-redux';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
// import RoutePath from '../../config/RoutePath';
import {
  UserOutlined,
  TeamOutlined,
  OrderedListOutlined,
  AreaChartOutlined,
  MenuUnfoldOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import UserInfo from '../../actions/UserInfo';

let { Sider } = Layout;
const { SubMenu } = Menu;

class HomeMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menus: null,
    };
  }

  componentDidMount() {
    /*
    let pathname = this.props.location.pathname; //切换到其他页要清除 Store
    if (pathname !== '/summary_List' && pathname !== '/detail_summary') {
      this.props.saveUserInfoToStore(null);
    }
    */
  }

  backMenu(data) {
    let history = this.props.history;
    const iconData = {
      internal: <UserOutlined />,
      external: <TeamOutlined />,
      event: <MenuUnfoldOutlined />,
      order: <OrderedListOutlined />,
      goods: <TagsOutlined />,
      track: <AreaChartOutlined />,
    };
    let menusRoleData = data.map((item) => {
      if (item.subMenus == null) {
        return (
          <Menu.Item key={item.path} icon={iconData[item.menuKey]} onClick={() => history.push(item.path)}>
            {item.name}
          </Menu.Item>
        );
      } else {
        return (
          <SubMenu key={item.menuKey} icon={iconData[item.menuKey]} title={item.name}>
            {this.backMenu(item.subMenus)}
          </SubMenu>
        );
      }
    });
    return menusRoleData;
  }

  render() {
    let openKeys = [];
    let pathname = this.props.location.pathname;
    const menusData = [
      {
        id: 0,
        menuKey: 'internal',
        name: '内部账号管理',
        icon: null,
        path: '/internalAccount',
      },
      {
        id: 1,
        menuKey: 'external',
        name: '外部账号管理',
        icon: null,
        path: '/externalAccount',
      },
      {
        id: 2,
        menuKey: 'event',
        name: '活动管理',
        icon: null,
        path: '/eventMgmt',
      },
      {
        id: 3,
        menuKey: 'order',
        name: '订单管理',
        icon: null,
        path: '/orderMgmt',
      },
      {
        id: 4,
        menuKey: 'goods',
        name: '商品管理',
        icon: null,
        path: '/goodsMgmt',
      },
      {
        id: 5,
        menuKey: 'track',
        name: '数据统计',
        icon: null,
        path: '/trackMgmt',
      },
    ];

    /*
    if (pathname === RoutePath.StoreList || pathname === RoutePath.ShopConfig) {
      openKeys = ['store']; //可添加（带二级菜单的主菜单name）
    }
    */

    const onOpenChange = (keys) => {
      const latestOpenKey = keys.find(
        (itemKey) => openKeys.indexOf(itemKey) === -1
      );
      /*
      if ('store' === latestOpenKey) {
        this.props.history.push('/store/storeList');
      }
      */
     console.log(latestOpenKey)
    };
    return (
      <>
        <Sider className="sider-setting" width={195}>
          <Menu
            mode="inline"
            inlineIndent={20} //模式的菜单缩进宽度
            defaultSelectedKeys={[pathname]}
            defaultOpenKeys={openKeys}
            onOpenChange={onOpenChange}
            style={{ height: '100%', borderRight: 0 }}
          >
            {Array.isArray(menusData) ? this.backMenu(menusData) : null}
          </Menu>
        </Sider>
      </>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    saveUserInfoToStore: (data) =>
      dispatch({
        type: UserInfo.SAVE_USER_INFO,
        data: data,
      }),
  };
}

export default connect(null, mapDispatchToProps)(withRouter(HomeMenu));
