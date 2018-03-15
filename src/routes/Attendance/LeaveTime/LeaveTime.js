import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Divider, Button } from 'antd';
import moment from 'moment';
import {routerRedux} from 'dva/router';
import styles from './LeaveTime.less';
import {ATTENDANCE_TYPE} from '../../../common/constants';

@connect(state => ({
  attendance: state.attendance,
}))
export default class LeaveTime extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'attendance/queryAttendances',
      payload: ATTENDANCE_TYPE.LEAVE,
    });
  }
  addAttendance = () => {
    const target = '/tabs/attendance/leave-time/add';
    this.props.dispatch(routerRedux.push(target));
  };

  editAttendance = (id) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/tabs/attendance/leave-time/add',
      id,
    }));
  };

  deleteAttendance = (id) => {
    this.props.dispatch({
      type: 'attendance/deleteAttendanceById',
      payload: id,
    });
  };
  render() {
    const {attendance: {loading, list}} = this.props;
    const columns = [
      {
        title: '请假开始时间',
        dataIndex: 'startTime',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
      },
      {
        title: '请假结束时间',
        dataIndex: 'endTime',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
      },
      {
        title: '请假事由',
        dataIndex: 'leaveContent',
      },
      {
        title: '部门',
        dataIndex: 'department',
        align: 'center',
      },
      {
        title: '审批人',
        dataIndex: 'reviewer',
      },
      {
        title: '抄送人',
        dataIndex: 'copyTo',
      },
      {
        title: '审批状态',
        dataIndex: 'approvalStatus',
      },
      {
        title: '操作',
        render: item => (
          <div>
            <a onClick={() => this.deleteAttendance(item.id)}>删除</a>
            <Divider type="vertical" />
            <a onClick={() => this.editAttendance(item.id)}>编辑</a>
          </div>
        ),
      },
    ];
    return (
      <div>
        <Button className={styles.submit} onClick={this.addAttendance}>
          申请请假
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
