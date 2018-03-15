import React from 'react';
import {routerRedux} from 'dva/router';
import {connect} from 'dva';
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
import {INVITE_HISTORY, EXPORTINVITERRESOURCEEXCEL} from '../../../common/constants';
import InviteTable from '../../../components/Table/Table';
import {isHr, isAdmin} from '../../../utils/authority';
import {formatTime} from '../../../utils/timeUtil';
import {queryInviter} from '../../../services/api';
import {filtrate} from '../../../utils/filterData';

const {confirm} = Modal;
const {Search} = Input;
let Message = null;
let srchValue = '';

@connect(state => ({
  invite: state.invite,
}))
class InviteMessage extends React.Component {
  state = {
    emIds: [],
    List: [],
  }

  componentDidMount() {
    this.srchValue = this.props.location.srchValue;
    this.fetchData();
  }

  getSelectData = (value) => { // 选中数据时调用
    if (value) {
      if (value.trim() === '') {
        return null;
      }
      this.props.dispatch({
        type: 'invite/sortCenter',
        payload: value.trim(),
      });
      this.srchValue = value;
    }
  };
  fetchData = () => { // 获取候选人信息
    if (this.srchValue === '' || this.srchValue === undefined) {
      // 第一次加载
      queryInviter()
        .then((response) => {
          this.setState({List: response});
        });
      Message = this;
      this.props.dispatch({
        type: 'invite/queryInviter',
      });
    } else {
      // 如果有值，则加载
      this.getSelectData(this.srchValue);
    }
  }

  handleEdit = (emid) => { // 编辑时调用
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname: '/tabs/invite/invite-message/add-inviter',
      id: emid,
      srchValue: this.srchValue,
    }));
  }
  handleDelete = (emid) => { //  删除操作时使用
    const {dispatch} = this.props;
    dispatch({
      type: 'invite/deleteInviter',
      payload: emid,
    });
  }
  handleInvite = (zid) => { //  跳转处理
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname: '/tabs/invite/invite-center',
      id: zid,
      srchValue: this.srchValue,
    }));
  }
  saveInviter = () => { // 添加信息
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname: '/tabs/invite/invite-message/add-inviter',
      srchValue: this.srchValue,
    }));
  }
  showDeleteConfirm = () => { //  批量删除时弹出的modal
    const object = {
      title: '确定要删除吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onCancel() {
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
  handleSeleteSearch = (value) => { // 选中数据时调用
    if (value) {
      if (value.trim() === '') {
        return null;
      }
      // this.setState({srchValue: value});
      this.srchValue = value;
      this.props.dispatch({
        type: 'invite/sortCenter',
        payload: value.trim(),
      });
    }
  };
  handleSearchChange = (e) => { // 输入名字筛选，表格
    const {value} = e.target;
    if (value === '') {
      this.fetchData();
      // this.setState({srchValue: value});
      this.srchValue = value.trim();
    }
  }
  batchDeleteInviter = (arr) => { //  批量删除时调用
    this.props.dispatch({
      type: 'invite/batchDeleteInviter',
      payload: arr,
    });
    this.setState({emIds: []});
  };
  handleSkip = (str) => { // 刷选按钮逻辑判断
    const {List} = this.state;
    const {dispatch} = this.props;
    const plan = [];
    const tech = [];
    const audit = [];
    const elseif = [];
    List.map((item) => {
      if (item.nowStatus === '待进一步邀约' || item.nowStatus === '已邀约待技术面试' || item.nowStatus === '待资格面试' || item.nowStatus === '待综合面试') {
        plan.push(item);
      } else if (item.nowStatus === '待资格面试') {
        tech.push(item);
      } else if (item.nowStatus === '待审核发放offer') {
        audit.push(item);
      } else {
        elseif.push(item);
      }
    });
    if (str === 'plan') {
      dispatch({
        type: 'invite/list',
        payload: plan,
      });
    } else if (str === 'tech') {
      dispatch({
        type: 'invite/list',
        payload: tech,
      });
    } else if (str === 'audit') {
      dispatch({
        type: 'invite/list',
        payload: audit,
      });
    } else if (str === 'else') {
      dispatch({
        type: 'invite/list',
        payload: elseif,
      });
    } else if (str === 'source') {
      dispatch({
        type: 'invite/ziyuanchi',
      });
    } else {
      dispatch({
        type: 'invite/list',
        payload: List,
      });
    }
  }

  isHrButton = () => { // 权限处理
    const fetch = this.fetchData;
    if (isHr() || isAdmin()) {
      const props = { // 导入候选人的Props
        name: 'file',
        action: INVITE_HISTORY,
        headers: {
          authorization: 'authorization-text',
        },
        showUploadList: false,
        onChange(info) {
          if (info.file.status !== 'uploading') {
            console.log('上传ing......:', info.file, info.fileList);
          }
          if (info.file.status === 'done') {
            fetch();
            if (info.file.response.length === 0) {
              message.success(`${info.file.name} 上传成功`);
            } else {
              message.error(`${info.file.name} 上传失败，身份证号重复`);
            }
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败`);
          }
        },
      };
      const propsResume = { // 导入简历时的props
        name: 'file',
        action: '/api/wordfile/upload',
        headers: {
          authorization: 'authorization-text',
        },
        showUploadList: false,
        onChange(info) {
          console.log('info: ', info);
          if (info.file.status !== 'uploading') {
            console.log('upload:', info.file, info.fileList);
          }
          if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功`);
            Message.props.dispatch(routerRedux.push({
              pathname: '/tabs/invite/invite-message/add-inviter',
              body: info.file.response,
            }))
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败`);
          }
        },
      };
      return (
        <div style={{marginBottom: 10}}>
          <Button onClick={() => this.handleSkip('all')} >全部</Button>
          <Button onClick={() => this.handleSkip('plan')}>待安排面试</Button>
          <Button onClick={() => this.handleSkip('tech')}>待资格面试</Button>
          <Button onClick={() => this.handleSkip('audit')}>待审核</Button>
          <Button onClick={() => this.handleSkip('source')}>资源池</Button>
          <Button onClick={() => this.handleSkip('else')}>其他</Button>
          <Search
            placeholder="姓名/责任人/手机号/岗位名称 搜索"
            onSearch={(value) => { this.handleSeleteSearch(value); }}
            onChange={this.handleSearchChange}
            enterButton
            style={{width: 300, marginLeft: 10}}
          />
          <Button style={{float: 'right'}} onClick={this.saveInviter}>
            <Icon type="plus" />添加信息
          </Button>
          <Button style={{float: 'right'}} onClick={this.showDeleteConfirm}>
            <Icon type="delete" />批量删除
          </Button>
          <div style={{float: 'right'}}>
            <Upload {...props}>
              <Button>
                <Icon type="upload" />批量导入
              </Button>
            </Upload>
            <Button>
              <Icon type="export" /><a href={`${EXPORTINVITERRESOURCEEXCEL}`}>批量导出</a>
            </Button>
            <Upload {...propsResume}>
              <Button>
                <Icon type="upload"/> 简历导入
              </Button>
            </Upload>
          </div>
        </div>
      );
    } else {
      return (
        <div style={{marginBottom: 10}}>
          <Button onClick={this.saveInviter}>
            <Icon type="plus" />添加信息
          </Button>
        </div>
      );
    }
  }
  isHrLink = (item) => {
    if (isHr() || isAdmin()) {
      return (
        <div>
          <a onClick={() => this.handleEdit(item.zid)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确定删除吗？" onConfirm={() => this.handleDelete(item.zid)}>
            <a>删除</a>
          </Popconfirm>
          {/* <a onClick={() => this.handleDelete(item.zid)}>删除</a> */}
          <Divider type="vertical" />
          <a onClick={() => this.handleInvite(item.zid)}>招聘管理</a>
        </div>
      );
    } else {
      return (
        <div>
          <a onClick={() => this.handleInvite(item.zid)}>招聘管理</a>
        </div>
      );
    }
  }
  render() {
    const {invite: {list}} = this.props;
    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '电话',
      dataIndex: 'phoneNo',
      key: 'phoneNo',
    }, {
      title: '当前状态',
      dataIndex: 'nowStatus',
      key: 'nowStatus',
      filters: filtrate(list, 'nowStatus'),
      onFilter: (value, record) => {
        if (record.nowStatus === null || record.nowStatus === '') {
          return false;
        }
        return record.nowStatus.indexOf(value) === 0;
      },
    }, {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      width: 100,
      filters: filtrate(list, 'sex'),
      onFilter: (value, record) => {
        if (record.sex === null || record.sex === '') {
          return false;
        }
        return record.sex.indexOf(value) === 0;
      },
    }, {
      title: '岗位名称',
      dataIndex: 'pname',
      key: 'station',
    }, {
      title: '单位(最近)',
      dataIndex: 'company1',
      key: 'company1',

    }, {
      title: '当前责任人',
      dataIndex: 'chargePerson',
      key: 'chargePerson',
      filters: filtrate(list, 'chargePerson'),
      onFilter: (value, record) => {
        if (record.chargePerson === null || record.chargePerson === '') {
          return false;
        }
        return record.chargePerson.indexOf(value) === 0;
      },
    }, {
      title: '最后操作时间',
      render: item => (
        <span>{formatTime(item.lastDate)}</span>
      ),
    }, {
      title: '操作',
      align: 'center',
      render: item => (
        this.isHrLink(item)
      ),
    }];
    const cbKeys = (keys) => {
      this.setState({
        emIds: [...keys],
      });
    };
    return (
      <div>
        {this.isHrButton()}
        <InviteTable
          rowKey={record => record.zid}
          cbKeys={cbKeys}
          columns={columns}
          dataSource={list}
        />
      </div>
    );
  }
}

export default InviteMessage;
