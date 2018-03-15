import React from 'react';
import PropTypes from 'prop-types';
import {Link, Route} from 'dva/router';
import DocumentTitle from 'react-document-title';
import LoginIcon from '../assert/loginicon.svg';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
import {FOOT_COPYRIGHT, FOOT_LINK } from '../common/constants';

class UserLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
  }

  getChildContext() {
    const {location} = this.props;
    return {location};
  }

  getPageTitle() {
    const {getRouteData, location} = this.props;
    const {pathname} = location;
    let title = 'Surgnova';
    getRouteData('UserLayout').forEach((item) => {
      if (item.path === pathname) {
        title = `${item.name} - Surgnova`;
      }
    });
    return title;
  }

  render() {
    const {getRouteData} = this.props;

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img src={LoginIcon} alt="..." />
              </Link>
            </div>
            <div className={styles.desc}>成为全球外科医生和患者首选的手术器械品牌。</div>
          </div>
          {
            getRouteData('UserLayout').map(item =>
              (
                <Route
                  exact={item.exact}
                  key={item.path}
                  path={item.path}
                  component={item.component}
                />
              )
            )
          }
          <GlobalFooter className={styles.footer} links={FOOT_LINK} copyright={FOOT_COPYRIGHT}/>
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
