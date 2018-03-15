import React from 'react';
import DocumentTitle from 'react-document-title';
import NoticeIcon from 'ant-design-pro/lib/NoticeIcon';
import {Redirect, Route, routerRedux, Switch} from 'dva/router';
import {Avatar, Dropdown, Icon, Layout, Menu, Tabs, Tag} from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import {connect} from 'dva';
import {FOOT_COPYRIGHT, FOOT_LINK, LOGO_NAME, FOOT_TIME} from '../common/constants';
import map from '../assert/map.svg';
import styles from './TabsLayout.less';
import {joinPath} from '../utils/utils';
import { dataNotice } from '../utils/defaultData';
import {getFirstMatchedChildName} from '../utils/routeUtil';
import GlobalFooter from '../components/GlobalFooter';
import {isAdmin, isHr} from '../utils/authority';

const {Content} = Layout; // eslint-disable-line
const {TabPane} = Tabs;

const LayoutName = 'TabsLayout';

class TabsLayout extends React.PureComponent {
  constructor() {
    super();
    this.isAdmin = this.isAdmin.bind(this);
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'user/fetchCurrent',
    });
  }

  getChildrenRoute = () => {
    const {navData} = this.props;
    const route = navData.filter(item => item.layout === LayoutName)[0];
    return route.children.map(it => ({
      name: it.name,
      exact: true,
      path: joinPath(it.path, route.path),
      component: it.component,
    }));
  };

  getPageTitle() {
    const {location} = this.props;
    const {pathname} = location;
    let title = LOGO_NAME;
    this.getChildrenRoute().forEach((item) => {
      if (item.path === pathname) {
        title = `${item.name} - ${LOGO_NAME}`;
      }
    });
    return title;
  }

  getActiveKey = () => getFirstMatchedChildName(this.props)

  logout = () => {
    this.props.dispatch({
      type: 'login/logout',
    });
  };
  isAdmin = () => {
    return sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user')).t && JSON.parse(sessionStorage.getItem('user')).t.role === 'admin';
  };

  directToChangePassword = () => {
    const {dispatch} = this.props;
    dispatch(routerRedux.push('/tabs/profile/change-password'));
  };

  renderTabs = () => ( // 设置tab
    <Tabs
      className={styles.tabs}
      animated={false}
      onTabClick={(key) => {
        this.props.dispatch(routerRedux.push(key));
      }}
      activeKey={this.getActiveKey()}
    >
      {this.props.childrenRoute.filter((child) => {
        if (child.tabs === 'error') {
          return false;
        }
        return child.tabs || (isAdmin());
      }).map((item) => {
        return (
          <TabPane
            tab={item.name}
            key={item.path}
          />
        );
      })}
    </Tabs>
  );
  renderContent = () => {
    return (
      <Content style={{margin: '24px 24px 24px', height: '100%', width: '88.2%'}}>
        <Switch>
          {
            this.props.childrenRoute.map((item) => {
              let tempChildrenRoute = item.childrenRoute;
                if (item.path === '/tabs/invite') {
                  if ((!isAdmin()) && (!isHr())) {
                    const inviteChildrenRoute = [];
                    item.childrenRoute.map((it) => {
                      if (it.path === '/tabs/invite/invite-message') {
                        inviteChildrenRoute.unshift(it);
                      } else {
                        inviteChildrenRoute.push(it);
                      }
                    });
                    tempChildrenRoute = inviteChildrenRoute;
                  }
                }
              return (
                <Route
                  exact={item.exact}
                  key={item.path}
                  path={item.path}
                  render={props => (
                    <item.component
                      childrenRoute={tempChildrenRoute}// 给子组件注入属性
                      routeInfo={item}
                      {...props}
                    />)}
                />
              );
            })
          }
          <Redirect exact from={this.props.path} to={this.props.childrenRoute[0].path}/>
        </Switch>
      </Content>
    );
  };

  renderUserInfo = () => {
    const onMenuClick = (key) => {
      switch (key) {
        case 'logout':
          this.logout();
          break;
        case 'changePassword':
          this.directToChangePassword();
          break;
        default:
          break;
      }
    };

    const {user} = this.props;
    const menu = (
      <Menu className={styles.menu} onClick={event => onMenuClick(event.key)}>
        <Menu.Item key="changePassword"><Icon type="setting"/>修改密码</Menu.Item>
        <Menu.Divider/>
        <Menu.Item key="logout"><Icon type="logout"/>退出登录</Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menu}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="normal" style={{backgroundColor: '#87d068'}} className={styles.avatar} icon="user"/>
          姓名 ：{user.name}
        </span>
      </Dropdown>);
  };

  renderNotification = () => {
    const data = dataNotice();
    const onItemClick = (item, tabProps) => {
      // console.log(item,tabProps);
    }
    const onClear = (tabTitle) => {
      // console.log('tabTitle: ',tabTitle);
    }
    function getNoticeData(notices) {
      if (notices.length === 0) {
        return {};
      }
      const newNotices = notices.map((notice) => {
        const newNotice = {...notice};
        if (newNotice.datatime) {
          newNotice.datatime = moment(notice.datatime).fromNow();
        }
        if (newNotice.id) {
          newNotice.key = newNotice.id;
        }
        if (newNotice.extra && newNotice.status) {
          const color = ({
            todo: '',
            processing: 'blue',
            urgent: 'red',
            doing: 'gold',
          })[newNotice.status];
          newNotice.extra = <Tag color={color} style={{ marginRight: 0 }}>{newNotice.extra}</Tag>
        }
        return newNotice;
      });
      return groupBy(newNotices, 'type');
    }
    const noticeData = getNoticeData(data);
    return (
      <NoticeIcon
        className="notice-icon"
        // count = {5}
        // onItemClick={onItemClick}
        // onClear={onClear}
        // popupAlign={{offset: [20, -16]}}
      >
        <NoticeIcon.Tab
          // list={noticeData['通知']}
          title="通知"
          emptyText="暂无通知"
          emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
        />
        <NoticeIcon.Tab
          // list={noticeData['消息']}
          title="消息"
          emptyText="暂无消息"
          emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
        />
        <NoticeIcon.Tab
          // list={noticeData['待办']}
          title="待办"
          emptyText="暂无待办"
          emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
        />
      </NoticeIcon>
    );
  };

  render() {
    return (
      <DocumentTitle className={styles.background} title={this.getPageTitle()}>
        <div className={styles.main}>
          <div className={styles.content}>
            <div className={styles.header}>
              <img className={styles.logo} alt="" src={map}/>
            </div>
            <div className={styles.right}>
              {this.renderNotification()}
              {this.renderUserInfo()}
            </div>
            {this.renderTabs()}
            {this.renderContent()}
          </div>
          <GlobalFooter className={styles.footer} links={FOOT_LINK} copyright={FOOT_COPYRIGHT} content={FOOT_TIME}/>
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(state => ({
  user: state.user.currentUser,
}))(TabsLayout);
