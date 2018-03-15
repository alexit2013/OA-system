import React from 'react';
import {Layout, Menu, Icon} from 'antd';
import {Link} from 'dva/router';
import {isEmpty, chain} from 'lodash';
import {queryCurrentUser} from '../../services/api';
import styles from './style.less';
import {getFirstMatchedChildName, renderRoute} from '../../utils/routeUtil';

const {Sider, Content} = Layout;
const {SubMenu} = Menu;

class Manager extends React.Component {
  componentWillMount() {
    queryCurrentUser()
      .then((response) => {
        // console.log(response);
      });
  }
  getNavMenuItems(childrenRoute) {
    if (isEmpty(childrenRoute)) {
      return [];
    }
    return childrenRoute.map((item) => {
      if (!item.name) {
        return null;
      }
      const menuChildren = chain(item.children).filter(it => it.menu).value();
      if (!isEmpty(menuChildren)) {
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
        if (!item.menu) {
          return null;
        }
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
      }
    });
  }

  getSelectKeys = () => {
    const pathName = getFirstMatchedChildName(this.props);
    return [pathName];
  }

  renderSildeMenu = () => (
    <Sider
      className={styles.sider}
      trigger={null}
      collapsible
      collapsed={false}
      breakpoint="md"
      style={{backgroundColor: '#fff', marginRight: '0px'}}
    >
      <Menu
        mode="inline"
        them="white"
        style={{width: '90%'}}
        selectedKeys={this.getSelectKeys()}
      >
        {this.getNavMenuItems(this.props.childrenRoute, this.props.path)}
      </Menu>
    </Sider>)

  renderContent = () => {
    return (
      <Content style={{margin: '24px 24px 24px', height: '100%'}}>
        {renderRoute(this.props)}
      </Content>
    );
  }

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

export default Manager;
