import React from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Button, Divider, Table, Popconfirm} from 'antd';
import {getShowText} from '../../../utils/utils';
import styles from './DocManager.less';
import {formatTime} from '../../../utils/timeUtil';

@connect(state => ({
  document: state.document,
}))
export default class DocManager extends React.Component {
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'document/fetchList',
    });
  }

  deleteDoc = (docId) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'document/deleteDoc',
      payload: docId,
    });
  }

  editDoc = (docId) => {
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname: '/tabs/manager/doc-manage/doc-add',
      docId,
    }));
  }

  handlerClickAddDoc = () => {
    const target = '/tabs/manager/doc-manage/doc-add';
    this.props.dispatch(routerRedux.push(target));
  }

  renderTable = () => {
    const {document: {loading, list}} = this.props;
    const columns = [
      {
        title: '文档名称',
        dataIndex: 'title',
        render: val => <span>{getShowText(val)}</span>,
      },
      {
        title: '作者',
        dataIndex: 'author',
        render: val => <span>{getShowText(val)}</span>,
      },
      {
        title: '类型',
        dataIndex: 'category',
        render: val => <span>{getShowText(val)}</span>,
      },
      {
        title: '创建时间',
        dataIndex: 'authorTime',
        render: val => <span>{formatTime(val)}</span>,
      },
      {
        title: '操作',
        render: item => (
          <div>
            <Popconfirm title="确定删除吗？" onConfirm={() => this.deleteDoc(item.id)}>
              <a>删除</a>
            </Popconfirm>
            <Divider type="vertical"/>
            <a onClick={() => this.editDoc(item.id)}>编辑</a>
          </div>
        ),
      },
    ];

    return (
      <Table
        loading={loading}
        rowKey={item => item.id}
        dataSource={list}
        columns={columns}
      />);
  }


  render() {
    return (
      <div className={styles.main}>
        <div>
          <Button
            className={styles.addDocButton}
            onClick={this.handlerClickAddDoc}
          >
          新增文档
          </Button>
        </div>
        {this.renderTable()}
      </div>
    );
  }
}
