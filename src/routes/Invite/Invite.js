import React from 'react';
import {Layout, Menu, Icon} from 'antd';
import {Link} from 'dva/router';
import {isEmpty, chain} from 'lodash';
import {queryCurrentUser} from '../../services/api';
import styles from './Invite.less';
import {getFirstMatchedChildName, renderRoute} from '../../utils/routeUtil';
import {isHr, isAdmin} from '../../utils/authority';

const { Sider, Content } = Layout;
const {SubMenu} = Menu;
let tempValue = [];
class Invite extends React.Component {
  componentWillMount() {
    tempValue = this.props.childrenRoute;
    if ((tempValue[0].name !== '招聘需求管理') && (isAdmin() || isHr())) {
      const tempValue1 = tempValue[0];
      const tempValue2 = tempValue[1];
      tempValue[0] = tempValue2;
      tempValue[1] = tempValue1;
    }
  }

  getNavMenuItems(childrenRoute) {
    if (isEmpty(childrenRoute)) {
      return [];
    }
    return childrenRoute.map((item) => {
      if (!item.name) {
        return null;
      }
      const menuChildren = chain(item.children).filter(it => it.authority === 'hr_recruit').value();
      if (!isEmpty(menuChildren)) {
        if (!((isAdmin() || isHr()) && (item.authority === 'hr_recruit')) || item.authority === 'user') {
          return null;
        }
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  <Icon type={item.icon}/>
                  <span>{item.name}</span>
                </span>
              ) : item.name
            }
            key={item.path}
          >
            {this.getNavMenuItems(item.childrenRoute)}
          </SubMenu>
        );
      } else {
        if (item.authority === 'user') {
          console.log('user');
        }
        if (((isAdmin() || isHr()) && (item.authority === 'hr_recruit')) || item.authority === 'user') {
          const icon = item.icon && <Icon type={item.icon}/>;
          return (
            <Menu.Item
              key={item.path}
            >
              <Link
                to={item.path}
                replace={item.path === this.props.location.pathname}
              >
                {icon}<span>{item.name}</span>
              </Link>
            </Menu.Item>
          );
        } else {
          return null;
        }
        // if (!item.menu) {
        //   return null;
        // }
        // const icon = item.icon && <Icon type={item.icon}/>;
        // return (
        //   <Menu.Item
        //     key={item.path}
        //   >
        //     <Link
        //       to={item.path}
        //       replace={item.path === this.props.location.pathname}
        //     >
        //       {icon}<span>{item.name}</span>
        //     </Link>
        //   </Menu.Item>
        // );
      }
    });
  }

  getSelectKeys = () => {
    const pathName = getFirstMatchedChildName(this.props);
    return [pathName];
  };

  renderSildeMenu = () => (
    <Sider
      className={styles.sider}
      trigger={null}
      collapsible
      collapsed={false}
      breakpoint="md"
      style={{backgroundColor: '#fff', marginRight: '5px'}}
    >
      <Menu
        mode="inline"
        theme="light"
        style={{width: '100%'}}
        selectedKeys={this.getSelectKeys()}
        forceSubMenuRender
      >
        {this.getNavMenuItems(tempValue, this.props.path)}
      </Menu>
    </Sider>);

  renderContent = () => {
    return (
      <Content style={{margin: '24px 24px 24px', height: '100%'}}>
        {renderRoute(this.props)}
      </Content>
    );
  };

  render() {
    const layout = (
      <Layout>
        {this.renderSildeMenu()}
        {this.renderContent()}
      </Layout>
    );
    return (
      <div className={styles.main}>{layout}</div>
    );
  }
}

export default Invite;
