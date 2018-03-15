import React from 'react';
import {routerRedux} from 'dva/router';
import { connect } from 'dva';
import {Table, Badge, Icon, message, Modal, Button, Input, Popconfirm} from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import TableProbation from '../../../components/Table/Table';

const {confirm} = Modal;
const {Search} = Input;
// let rowData = [];
let j = 0;
@connect(state => ({
  probation: state.probation,
}))
class StaffTraining extends React.Component {
  state = {
    emIds: [],
    flag: '',
  }
  componentDidMount() {
    this.fetchData();
  }
  fetchData = () => {
    this.props.dispatch({
      type: 'probation/fetchDate',
    });
  }

  handleOnRow = () => {
    this.props.dispatch(routerRedux.push('/tabs/probation/probation-stage'));
  }
  handleChildrenRow = (record) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/tabs/probation/probation-stage',
      id: record.id,
    }));
  }
  layoutDelete = () => { // 删除阶段培养计划的样式
    return (
      <Button onClick={this.showDeleteConfirm}>
        <Icon type="delete" />批量删除
      </Button>
    )
  }
  showDeleteConfirm = () => { // 批量删除时弹出的modal
    const object = {
      title: '确定要删除吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onCancel() {
      },
    };
    object.onOk = () => {
      console.log('onOk: ', this.state.emIds);
      if (this.state.emIds.length === 0) {
        message.error('请选择所需要删除的对象');
      } else {
        this.batchDelete(this.state.emIds);
      }
    };
    confirm(object);
  };
  batchDelete = (arr) => { //  批量删除时调用
    console.log('batchDelete: ', arr);
    this.props.dispatch({
      type: 'probation/batchDelete',
      payload: arr,
    });
    this.setState({emIds: []});
  };
  handleSearch = (e) => { // 搜索框处理逻辑
    const value = e.trim();
    console.log('value: ', value);
    this.props.dispatch({
      type: 'probation/searchDate',
      payload: value,
    });
  }
  searchData = () => {
    return (
      <div style={{marginLeft: '40%'}}>
        <Search
          placeholder="支持培养阶段/评价结果搜索"
          onSearch={this.handleSearch}
          style={{ width: 300, marginBottom: '10px' }}
          enterButton
        />
      </div>
    );
  }
  render() {
    j = 0;
    const {probation: {probationList, loading}} = this.props;
    const expandedRowRender = () => {
      const childColumns = [
        { title: '培养阶段', dataIndex: 'phase', key: 'phase', width: '100' },
        { title: '当前状态', key: 'status', render: item => <span><Badge status={item.status === '完成' ? 'success' : 'error'} />{item.status}</span> , width: '250px'},
        { title: '评价结果', dataIndex: 'rank', key: 'rank' },
        {
          title: '主管评语', 
          key: 'authorresult',
          width: '300px',
          render: item => (
            <Ellipsis tooltip length={18}>{item.evaluatecomment}</Ellipsis>
          ),
        },
        {
          title: '操作',
          key: 'operation',
          render: item => (
            <span className="example">
              {
                item.status === '完成'
                ?
                  <a href="#">查看</a>
                :
                  <a href="#">编辑</a>
              }
            </span>
          ),
        },
      ];
      let childData = [];
      childData = probationList[j].trainRecords;
      j += 1;
      if (j === probationList.length - 1) {
        j = 0;
      }
      const cbKeys = (keys) => {
        console.log('keys', keys);
        this.setState({
          emIds: [...keys],
        });
      };
      return (
        <TableProbation
          cbKeys={cbKeys}
          rowKey={record => record.id}
          pagination={false}
          columns={childColumns}
          dataSource={childData}
          onRow={(record) => { // 点击行onClick事件
            return {
              onClick: () => { this.handleChildrenRow(record); },
            };
          }}
        />
      );
    };
    const columns = [
      { title: '姓名', dataIndex: 'empname', key: 'empname' },
      { title: '工号', dataIndex: 'key', key: 'key' },
      { title: '岗位', dataIndex: 'station', key: 'station' },
      { title: '部门', dataIndex: 'secondDepartment', key: 'secondDepartment' },
      { title: '主管', dataIndex: 'directorName', key: 'directorName' },
      { title: '招聘类型', dataIndex: 'recruitmentType', key: 'recruitmentType' },
      { title: '思想导师', dataIndex: 'mentorName', key: 'mentorName' },
      { title: '当前培养阶段', dataIndex: 'phase', key: 'phase'},
      { title: '当前培养状态', dataIndex: 'status', key: 'status' },
      { title: '评价结果', dataIndex: 'result', key: 'result' },
      {
        title: '操作',
        render: () => (
          <Popconfirm placement="top" title="确定转正吗？" onConfirm={confirm} okText="Yes" cancelText="No">
            <a>转正</a>
          </Popconfirm>
        ),
      },
    ];

    const data = [];
    for (let i = 0; i < 5; i += 1) {
      data.push({
        key: i,
        name: '柴兴致',
        platform: '85100256',
        version: 'IT',
        upgradeNum: '运营部',
        creator: '柳景涛',
        createdAt: '柳景涛',
        operation: '第三阶段',
        dangqianpeiyangzhuangtai: '良好',
        pingjiajieguo: '良好',
        dangqianzhuangtai: '审核中',
      });
    }

    return (
      <div style={{width: '100%'}}>
        {/* {this.layoutDelete()} */}
        {this.searchData()}
        <Table
          className="components-table-demo-nested"
          columns={columns}
          expandedRowRender={expandedRowRender}
          dataSource={probationList}
          loading={loading}
        />
      </div>
    );
  }
}

export default StaffTraining;
// ReactDOM.render(<StaffTraining />, document.getElementById('root'));
