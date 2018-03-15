import React from 'react';
import {Route, Redirect, Switch } from 'dva/router';
import {isEmpty} from 'lodash';

const renderChildrenRoute = childrenRoute =>
  childrenRoute.map(item => (
    <Route
      exact={item.exact}
      key={item.path}
      path={item.path}
      render={props => (
        <item.component
          childrenRoute={item.childrenRoute}
          routeInfo={item}
          {...props}
        />)}
    />
  ));

export const renderRoute = (props, selfContent = null) => (
  <Switch>
    {renderChildrenRoute(props.childrenRoute)}
    {(selfContent === null) ?
      (<Redirect exact from={props.path} to={props.childrenRoute[0].path} />) :
      (<Route
        exact={false}
        key={props.path}
        path={props.path}
        render={selfContent}
      />) }
  </Switch>);


export const getFirstMatchedChildName = (props) => {
  const {location: {pathname}} = props;
  const child = props.childrenRoute.filter(it => pathname.startsWith(it.path));
  const activeKey = isEmpty(child) ? '' : child[0].path;
  return activeKey;
};
