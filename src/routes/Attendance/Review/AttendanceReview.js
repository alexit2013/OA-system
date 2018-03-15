import React from 'react';
import {connect} from 'dva';
import {Table} from 'antd';
import moment from 'moment';
import {routerRedux} from 'dva/router';

@connect(state => ({
  attendance: state.attendance,
}))

export default class AttendanceCheck extends React.Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'attendance/queryReviews',
      payload: {},
    });
  }

  viewAttendance = (id) => {
    this.props.dispatch(routerRedux.push({
      pathname: `/tabs/attendance/attendance-review/detail/${id}`,
    }));
  };

  renderTable = () => {
    const {attendance: {loading, reviewList}} = this.props;
    const columns = [
      {
        title: '类型',
        dataIndex: 'attendanceType',
      },
      {
        title: '姓名',
        dataIndex: 'applicantName',
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
      },
      {
        title: '截止时间',
        dataIndex: 'endTime',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
      },
      {
        title: '事由',
        dataIndex: 'leaveContent',
      },
      {
        title: '部门',
        dataIndex: 'department',
        align: 'center',
      },
      {
        title: '审批状态',
        dataIndex: 'approvalStatus',
      },
      {
        title: '操作',
        render: item => (
          <div>
            <a onClick={() => this.viewAttendance(item.id)}>查看</a>
          </div>
        ),
      },
    ];
    return (
      <Table
        loading={loading}
        rowKey={item => item.id}
        dataSource={reviewList}
        columns={columns}
      />
    );
  }


  render() {
    return (
      <div>
        {this.renderTable()}
      </div>
    );
  }
}
