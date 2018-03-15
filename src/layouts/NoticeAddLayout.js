import React, { PureComponent } from 'react';
import { Card, Button } from 'antd';
import { Link } from 'dva/router';
import StandardTable from '../components/StandardTable';
// import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './NoticeAddLayout.less';

// const FormItem = Form.Item;

export default class NoticeAddLayout extends PureComponent {
  render() {
    const list = [
      {
        id: '1',
        name: '元旦正常上班通知1',
        author: '张三',
        type: '深圳',
        crateDate: '2017-01-01',
      },
      {
        id: '2',
        name: '元旦正常上班通知1',
        author: '张三',
        type: '深圳',
        crateDate: '2017-01-01',
      },
      {
        id: '3',
        name: '元旦正常上班通知1',
        author: '张三',
        type: '深圳',
        crateDate: '2017-01-01',
      },
    ];

    const data = {
      list,
      pagination: {
        total: list.length,
        pageSize: 20,
        current: 1,
      },
    };
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Link to="/user/login">
                <Button icon="plus" type="primary">
                  新增公告1
                </Button>
              </Link>
            </div>
            <StandardTable
              data={data}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </div>
    );
  }
}
