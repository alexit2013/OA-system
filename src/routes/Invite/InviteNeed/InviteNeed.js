import React from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {
  Button,
  Upload,
  Icon,
  Input,
  Modal,
  Divider,
  message,
  Popconfirm,
} from 'antd';
import {INVITE_NEED, EXPORTINVITERNEEDEXCEL} from '../../../common/constants';
import InviteTable from '../../../components/Table/Table';
import {filtrate} from '../../../utils/filterData';

const {confirm} = Modal;
const {Search} = Input;
const needsValue = '';

@connect(state => ({
  invite: state.invite,
}))
class InviteNeed extends React.Component {

  state = {
    emIds: [],
  }

  componentDidMount() {
    this.needsValue = this.props.location.needsValue;
    this.fetchData();       // 待修改
  }

  // Add by jingtao.liu 通过needsValue，保存查找的条件，使得返回可以得到原先的结果列表
  fetchData = () => { // 获取候选人信息
    if (this.needsValue === '' || this.needsValue === undefined) {
      this.props.dispatch({
        type: 'invite/findAllNeed',
      });
    } else {
      // 根据查找值加载
      this.props.dispatch({
        type: 'invite/sortInviter',
        payload: this.needsValue,
      });
    }
  }

  handleEdit = (item) => { // 编辑时调用
    const {dispatch} = this.props;
    const body = {
      id: item.nid,
      hcNo: item.hcNo,
    };
    dispatch(routerRedux.push({
      pathname: '/tabs/invite/invite-need/add-need',
      body,
      needsValue: this.needsValue,
    }));
  }
  handleDelete = (emid) => { // 删除操作时使用
    const {dispatch} = this.props;
    dispatch({
      type: 'invite/deleteNeedInviter',
      payload: emid.nid,
    });
  }
  saveInviter = () => {
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname: '/tabs/invite/invite-need/add-need',
      needsValue: this.needsValue,
    }));
  }
  showDeleteConfirm = () => { // 批量删除时弹出的modal
    const object = {
      title: '确定要删除吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onCancel() {
        // console.log('Cancel');
      },
    };
    object.onOk = () => {
      if (this.state.emIds.length === 0) {
        message.error('请选择所需要删除的对象');
      } else {
        this.batchDeleteInviter(this.state.emIds);
      }
    };
    confirm(object);
  };

  batchDeleteInviter = (arr) => { // 批量删除时调用
    this.props.dispatch({
      type: 'invite/batchDeleteNeedInviter',
      payload: arr,
    });
    this.setState({emIds: []});
  };

  handleSearchChange = (e) => { // 输入名字筛选，表格
    const {value} = e.target;
    if (value.trim() === '') {
      this.needsValue = value.trim();
      this.fetchData();
    }
  }
  handleSearchStatus = (value) => {
    if (value) {
      if (value.trim() === '') {
        return null;
      }
      this.needsValue = value;
      this.props.dispatch({
        type: 'invite/sortInviter',
        payload: value.trim(),
        needsValue: this.needsValue,
      });
    }
  }

  render() {
    const fetch = this.fetchData;
    const {invite: { needlist, loading }} = this.props;
    const props = {
      name: 'file',
      action: INVITE_NEED,
      headers: {
        authorization: 'authorization-text',
      },
      showUploadList: false,
      onChange(info) {
        if (info.file.status !== 'uploading') {
          // console.log('上传ing......:', info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          fetch();
          message.success(`${info.file.name} 上传成功，已导入${info.file.response.length}条记录`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed`);
        }
      },
    };
    const cbKeys = (keys) => {
      this.setState({
        emIds: [...keys],
      });
    };

    const columns = [{
      title: '招聘需求编码',
      dataIndex: 'hcNo',
      key: 'hcNo',
    }, {
      title: '一级部门',
      dataIndex: 'odepartment',
      key: 'odepartment',
      filters: filtrate(needlist, 'odepartment'),
      onFilter: (value, record) => record.odepartment.indexOf(value) === 0,
    }, {
      title: '二级部门',
      dataIndex: 'sdepartment',
      key: 'sdepartment',
      filters: filtrate(needlist, 'sdepartment'),
      onFilter: (value, record) => record.sdepartment.indexOf(value) === 0,
    }, {
      title: '岗位名称',
      dataIndex: 'pname',
      key: 'pname',
    }, {
      title: '岗位职级',
      dataIndex: 'rank',
      key: 'rank',
      filters: filtrate(needlist, 'rank'),
      onFilter: (value, record) => record.rank.indexOf(value) === 0,
    }, {
      title: '职位状态',
      dataIndex: 'postStatus',
      key: 'postStatus',
      filters: filtrate(needlist, 'postStatus'),
      onFilter: (value, record) => record.postStatus.indexOf(value) === 0,
    }, {
      title: '优先级',
      dataIndex: 'priorty',
      key: 'priorty',
      filters: filtrate(needlist, 'priorty'),
      onFilter: (value, record) => {
        if (record.priorty === null || record.priorty === '') {
          return false;
        }
        return record.priorty.indexOf(value) === 0;
      },
    }, {
      title: '操作',
      align: 'center',
      render: item => (
        <div>
          <a onClick={() => this.handleEdit(item)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确定删除吗？" onConfirm={() => this.handleDelete(item)}>
            <a>删除</a>
          </Popconfirm>
          {/* <a onClick={() => { this.handleDelete(item); }}>删除</a> */}
        </div>
      ),
    }];
    return (
      <div>
        <div style={{marginBottom: 10}}>
          <Button onClick={this.saveInviter}>
            <Icon type="plus" />添加需求
          </Button>
          <Button style={{marginLeft: 10}} onClick={this.showDeleteConfirm}>
            <Icon type='"delete"' />批量删除
          </Button>
          <Upload style={{marginLeft: 10}} {...props} >
            <Button >
              <Icon type="upload" />批量导入
            </Button>
          </Upload>
          <Button style={{marginLeft: 10}}>
            <Icon type="export" /> <a href={`${EXPORTINVITERNEEDEXCEL}`}>批量导出</a>
          </Button>
          <Search
            enterButton
            style={{marginLeft: '8%', width: '25%' }}
            placeholder="岗位名称/一级部门/二级部门"
            onSearch={this.handleSearchStatus}
            onChange={this.handleSearchChange}
          />
        </div>
        <InviteTable
          rowKey={record => record.nid}
          cbKeys={cbKeys}
          columns={columns}
          dataSource={needlist}
          loading={loading}
        />
      </div>
    );
  }
}

export default InviteNeed;
