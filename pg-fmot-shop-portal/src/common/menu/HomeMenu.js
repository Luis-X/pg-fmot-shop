import React, { Component } from 'react';
import { Menu, Layout } from 'antd';
// import {connect} from 'react-redux';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import RoutePath from '../../config/RoutePath';
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
    let selectKeys = [];
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

    selectKeys = [pathname]

    try {
      if (pathname.includes(RoutePath.TrackDetail)) {
        selectKeys = ['/trackMgmt']
      }
    } catch (error) {
      console.log(error)
    }

    return (
      <>
        <Sider className="sider-setting" width={195}>
          <Menu
            mode="inline"
            inlineIndent={20} //模式的菜单缩进宽度
            defaultSelectedKeys={selectKeys}
            style={{ height: '100%', borderRight: 0 }}
          >
            {this.backMenu(menusData)}
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
