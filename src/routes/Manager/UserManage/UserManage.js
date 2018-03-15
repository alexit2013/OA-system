import React from 'react';
import {routerRedux} from 'dva/router';
import {connect} from 'dva';
import {Button, Divider, Icon, message, Upload,Modal, Input, Popconfirm} from 'antd';
import Table from '../../../components/Table/Table';
import style from './UserManage.less';
import {UPLOAD_SERVER, EXPORTUSEREXCEL} from '../../../common/constants';
import {queryLike, exportDocx} from '../../../services/api';

const Search = Input.Search;
const confirm = Modal.confirm;
class UserManage extends React.Component {
  state = {
    emIds:[],
    nameSource:[],
    // dataSource: [],
  };
  componentDidMount() {
    this.fetchData();
  }
  fetchData = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'user/fetchUsers',
    });
  };
  addUser = () => {
    const {dispatch} = this.props;
    dispatch(routerRedux.push('/tabs/manager/user-manage/user-add'));
  };
  editUser = (emId) => {
    console.log('emid: ', emId);
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname: '/tabs/manager/user-manage/user-add',
      id: emId,
    }));
  };
  batchDelete = (arr) => {
    this.props.dispatch({
      type: 'user/batchDelete',
      payload: arr,
    });
    this.setState({emIds:[]});
  };

  deleteUser = (emId) => {
    this.props.dispatch({
      type: 'user/deleteUser',
      payload: emId,
    });
  };
  showDeleteConfirm = () => {
    const object = {
      title: '确定要删除吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onCancel() {
        // console.log('Cancel');
      },
    };
    object.onOk = ()=>{
      if (this.state.emIds.length === 0) {
        message.error('请选择所需要删除的对象')
      } else {
        this.batchDelete(this.state.emIds)
      }
    };
    confirm(object);
  };
  handleChange = (value) => { // AutoComplete组件数据发生改变时调用
    if (value.trim() === '') {
      this.setState({nameSource:[]});
      this.props.dispatch({
        type: 'user/fetchUsers',
      });
    } else {
      queryLike(value)
        .then((response)=>{
          if (Object.prototype.toString.call(response) === '[object Array]') {
            const temp = [];
            response.map((item)=>{
              temp.push(item.name);
            });
            this.setState({
              // dataSource: response,
              nameSource: [...temp],
            });
          };
        });
    }
  };
  handleSelete = (value) => { // 选中数据时调用
    const { users } = this.props;
    const temparr = [];
    users.map((it) => {
      if (it.name === value) {
        temparr.push(it);
      }
    })
    this.props.dispatch({
      type: 'user/search',
      payload: temparr,
    })
  };
  // handleEnter = (e) => {
  //   const {dataSource} = this.state;
  //   dataSource.map((it) => {
  //     if (it.name )
  //   })
  // }
  handleSeleteSearch = (value) => { // 选中数据时调用
    console.log('value: ', value);
    if (value) {
      if (value.trim() === '') {
        return null;
      }
      this.props.dispatch({
        type: 'user/sortUser',
        payload: value,
      });
    }
  };
  handleSearchChange = (e) => { // 输入名字筛选，表格
    const {value} = e.target;
    if (value === '') {
      this.fetchData();
    }
  }
  render() {
    const { users } = this.props;
    const fetch = this.fetchData;
    const props = {
      name: 'file',
      action: UPLOAD_SERVER,
      headers: {
        authorization: 'authorization-text',
      },
      showUploadList: false,
      onChange(info) {
        if (info.file.status !== 'uploading') {
          // console.log('upload:', info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          fetch();
          if (info.file.response.length >= 0) {
            message.error(`${info.file.name} 上传失败，手机号重复${info.file.response.length}条记录`);
          } else {
            message.success(`${info.file.name} 上传成功`);
          }
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 上传失败`);
        }
      },
    };

    const columns = [
      {title: '姓名', dataIndex: 'name' },
      {title: '工号', dataIndex: 'emId', key: 'emId'},
      {title: '岗位', dataIndex: 'station' },
      {title: '职级', dataIndex: 'grade' },
      {title: '部门', dataIndex: 'department' },
      {
        title: '操作',
        render: item => (
          <div>
            <Popconfirm title="确定删除吗？" onConfirm={() => this.deleteUser(item.emId)}>
              <a>删除</a>
            </Popconfirm>
            <Divider type="vertical"/>
            <a onClick={() => this.editUser(item.emId)}>编辑</a>
          </div>
        ),
      },
    ];
    const cbKeys = (keys) => {
      console.log('keys:', keys);
      this.setState({ emIds: [...keys]});
    };

    return (
      <div >
        <div>
          {/* <Button className={style.container} onClick={this.addUser}><Icon type="plus" />添加用户</Button> */}
          <Upload {...props}>
            <Button>
              <Icon type="upload"/> 批量导入
            </Button>
          </Upload>
          <Button>
            <Icon type="export" /> <a href={`${EXPORTUSEREXCEL}`}>批量导出</a>
          </Button>
          <Button onClick={this.showDeleteConfirm}>
            <Icon type="delete"/> 批量删除
          </Button>
          <Search
            placeholder="姓名/岗位/部门/主管姓名 搜索"
            onSearch={this.handleSeleteSearch}
            onChange={this.handleSearchChange}
            enterButton
            style={{width: 300, marginLeft: 10}}
          />
        </div>
        <Table
          cbKeys={cbKeys}
          columns={columns}
          dataSource={users}
          rowKey={record => record.emId}
        />
      </div>
    );
  }
}

export default connect(state => ({
  currentUser: state.user.currentUser,
  users: state.user.list,
}))(UserManage);
