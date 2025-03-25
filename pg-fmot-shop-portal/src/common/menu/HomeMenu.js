import React, {Component} from 'react';
import {Menu, Layout} from 'antd';
// import {connect} from 'react-redux';
import {withRouter} from 'react-router'
import {connect} from 'react-redux';
import RoutePath from '../../config/RoutePath';
import {
    UsergroupAddOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
    LockOutlined,
    TagsOutlined,
    CopyOutlined,
    FileTextOutlined,
    SettingOutlined
} from '@ant-design/icons';
import UserInfo from "../../actions/UserInfo";

let {Sider} = Layout;
const {SubMenu} = Menu;

class HomeMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //selected:""
            menus: null
        };
    }

    componentDidMount() {
        let pathname = this.props.location.pathname; //切换到其他页要清除 Store
        if (pathname !== "/summary_List" && pathname !== "/detail_summary") {
            this.props.saveUserInfoToStore(null);
        }
        // const loginData = JSON.parse(localStorage.getItem('menu')) || ''
        // this.setState({
        //     menus: loginData.menus
        // })
    }

    backMenu(data) {
        let history = this.props.history;
        const iconData = {
            "user": <UsergroupAddOutlined/>,
            "store": <AppstoreOutlined/>,
            "storeList": <UnorderedListOutlined/>,
            "shopConfig": <LockOutlined/>,
            "event": <TagsOutlined/>,
            "report": <CopyOutlined/>,
            "log": <FileTextOutlined/>,
            "lineup": <SettingOutlined/>,
        }
        let menusRoleData = data.map((item) => {
                if (item.subMenus == null) {
                    return <Menu.Item
                        key={item.path}
                        icon={iconData[item.menuKey]}
                        onClick={() => history.push(item.path)}
                    >
                        {item.name}
                    </Menu.Item>
                } else {
                    return <SubMenu
                        key={item.menuKey}
                        icon={iconData[item.menuKey]}
                        title={item.name}>
                        {
                            this.backMenu(item.subMenus)
                        }
                    </SubMenu>
                }
            }
        );
        return menusRoleData;
    }


    render() {
        // let history = this.props.history;
        let openKeys = []
        let pathname = this.props.location.pathname;
        const menusData = localStorage.getItem('loginInfo') ? JSON.parse(localStorage.getItem('loginInfo')) : null
        // const dataLift = loginData ? loginData.menus : null
        // if (!loginData) { //没有menu数据，直接跳sso
        //     window.location.href = RoutePath.SsoUrlJump
        //     return;
        // }
        if (pathname === RoutePath.StoreList || pathname === RoutePath.ShopConfig) {
            openKeys = ['store']//可添加（带二级菜单的主菜单name）
        }
        const onOpenChange = (keys) => {
            const latestOpenKey = keys.find((itemKey) => openKeys.indexOf(itemKey) === -1);
            if ('store' === latestOpenKey) {
                this.props.history.push('/store/storeList')
            }
        };
        return (
            <>
                <Sider className="sider-setting"
                       width={195}>
                    <Menu mode="inline"
                          inlineIndent={20} //模式的菜单缩进宽度
                          defaultSelectedKeys={[pathname]}
                          defaultOpenKeys={openKeys}
                          onOpenChange={onOpenChange}
                          style={{height: '100%', borderRight: 0}}
                    >
                        {Array.isArray(menusData) ?
                            this.backMenu(menusData)
                            : null
                        }
                    </Menu>
                </Sider>
            </>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        saveUserInfoToStore: (data) => dispatch({
            type: UserInfo.SAVE_USER_INFO,
            data: data,
        }),
    }
}

export default connect(null, mapDispatchToProps)(withRouter(HomeMenu));
// export default withRouter(HomeMenu);
