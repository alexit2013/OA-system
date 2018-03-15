import React from 'react';
import { Link } from 'dva/router';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import styles from './PageHeaderLayout.less';

export default ({ children, wrapperClassName, top, ...restProps }) => (
  <div style={{ margin: '10px 10px 30px -10px' }} className={wrapperClassName}>
    {top}
    <PageHeader {...restProps} linkElement={Link} />
    {children ? <div className={styles.content}>{children}</div> : null}
  </div>
);
