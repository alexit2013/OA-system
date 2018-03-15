import React from 'react';
import {Router, Route, Switch, Redirect} from 'dva/router';
import {isEmpty} from 'lodash';
import {LocaleProvider, Spin} from 'antd';
// LocaleProvider 使用React的context特性，只需在应用外包裹一层即可全局生效
import zhCN from 'antd/lib/locale-provider/zh_CN';
// LocalProvider的local属性
import dynamic from 'dva/dynamic';
import cloneDeep from 'lodash/cloneDeep';
import {getNavData} from './common/nav';
import {getPlainNode, joinPath} from './utils/utils';

import styles from './index.less';

dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin}/>;
});

function getRouteData(navData, path) {
  if (!navData.some(item => item.layout === path) ||
    !(navData.filter(item => item.layout === path)[0].children)) {
    return null;
  }
  const route = cloneDeep(navData.filter(item => item.layout === path)[0]);
  const nodeList = getPlainNode(route.children);
  return nodeList;
}

const getRouteLayout = (navData, layout) => {
  const getChildrenRoute = (nodeList, parentPath) => {
    if (isEmpty(nodeList)) {
      return null;
    }
    return nodeList.map((it) => {
      const path = joinPath(it.path, parentPath);
      const exact = isEmpty(it.children);
      return {
        ...it,
        name: it.name,
        exact,
        path,
        childrenRoute: getChildrenRoute(it.children, path),
        component: it.component,
      };
    });
  };

  if (!navData.some(item => item.layout === layout) ||
    !(navData.filter(item => item.layout === layout)[0].children)) {
    return null;
  }
  const route = navData.filter(item => item.layout === layout)[0];
  return {
    name: route.name,
    path: route.path,
    childrenRoute: getChildrenRoute(route.children, route.path),
    component: route.component,
  };
};

function getLayout(navData, path) { //eslint-disable-line
  if (!navData.some(item => item.layout === path) ||
    !(navData.filter(item => item.layout === path)[0].children)) {
    return null;
  }
  const route = navData.filter(item => item.layout === path)[0];
  return {
    component: route.component,
    layout: route.layout,
    name: route.name,
    path: route.path,
  };
}

function RouterConfig({history, app}) {
  const navData = getNavData(app);
  const TabsLayoutNode = getRouteLayout(navData, 'TabsLayout');
  const UserLayoutNode = getRouteLayout(navData, 'UserLayout');

  const passProps = {
    app,
    navData,
    getRouteData: (path) => {
      return getRouteData(navData, path);
    },
  };

  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route
            path="/tabs"
            render={props => (
              <TabsLayoutNode.component
                childrenRoute={TabsLayoutNode.childrenRoute}
                {...props}
                {...passProps}
              />)}
          />
          <Route
            path="/user"
            render={props =>
              (<UserLayoutNode.component
                childrenRoute={UserLayoutNode.childrenRoute}
                {...props}
                {...passProps}
              />)}
          />
          <Redirect exact from="/" to="/tabs"/>
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
