import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Divider, Button } from 'antd';
import {routerRedux} from 'dva/router';

@connect(state => ({
  notice: state.notice,
}))
export default class NoticeManage extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'notice/noticeInvite',
    });
  }
  addNotice = () => {
    const target = '/tabs/invite/invite-notice/notice-add';
    this.props.dispatch(routerRedux.push(target));
  };

  editNotice = (id) => {
    this.props.dispatch({
      type: 'notice/editNotice',
      payload: id,
    });
  };

  deleteNotice = (id) => {
    this.props.dispatch({
      type: 'notice/deleteNotice',
      payload: id,
    });
  };
  render() {
    const {notice: {loading, list}} = this.props;

    const columns = [
      {
        title: '公告名称',
        dataIndex: 'title',
      },
      {
        title: '作者',
        dataIndex: 'author',
      },
      {
        title: '类型',
        dataIndex: 'type',
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'createdDate',
      },
      {
        title: '操作',
        render: item => (
          <div>
            <a onClick={() => this.deleteNotice(item.id)}>删除</a>
            <Divider type="vertical" />
            <a onClick={() => this.editNotice(item.id)}>编辑</a>
          </div>
        ),
      },
    ];
    return (
      <div>
        <Button onClick={this.addNotice}>
          新增公告
        </Button>
        <Table
          loading={loading}
          rowKey={item => item.id}
          dataSource={list}
          columns={columns}
        />
      </div>
    );
  }
}
