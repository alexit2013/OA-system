import React from 'react';
import {routerRedux} from 'dva/router';
import {connect} from 'dva';
import {Button, Divider, Icon, message, Upload, Modal, Table, Tooltip, AutoComplete, Input, Popconfirm} from 'antd';
import AssetTable from '../../../components/Table/Table';
import style from './AssetManage.less';
import {UPLOAD_ASSERT, EXPORTASSETEXCEL} from '../../../common/constants';
import {allotAsset, queryLike} from '../../../services/api';
import {isAsset, isAdmin} from '../../../utils/authority';
import {getShowText} from '../../../utils/utils';

let dataAsset = [];
const {confirm} = Modal;
const {Search} = Input;
class AssetManage extends React.Component {
  state = {
    emIds: [],
    authority: false,
    visible: false,
    nameSource: [],
    dataSource: [],
    allotName: '',
    emId: '',
    employeeNum: '',
    initatorNum: '',
    filterDropdownVisible: false,
    searchText: '',
    filtered: false,
  };
  componentDidMount() {
    this.isAuthority();
    this.fetchData();
  };
  onInputChange = (e) => { // 筛选使用者的onChange事件
    const searchText = e.target.value.trim();
    this.setState({ searchText });
  }
  isAuthority = () => {
    if (isAsset() || isAdmin()) {
      this.setState({authority: true});
    } else {
      this.setState({authority: false});
    }
  };
  readAsset = (emId) => { // 如果是普通用户则没有修改权限
    const {dispatch} = this.props;
    dispatch({
      type: 'asset/readOnly',
      payload: !isAsset(),
    });
    setTimeout(
      dispatch(routerRedux.push({
        pathname: '/tabs/asset/asset-manage/asset-add',
        id: emId,
      })), 0);
  };
  fetchData = () => {
    if (isAsset() || isAdmin()) { // 如果是资产管理员就请求所有数据
      this.props.dispatch({
        type: 'asset/fetchAssets'
      });
    } else { // 不是就请求个人数据
      this.props.dispatch({
        type: 'asset/fetchUser',
      });
    }
  };
  tuserSearch = () => { // 筛选使用者的onSearch事件
    const {searchText} = this.state;
    if (searchText === '') {
      this.setState({searchText: ''});
      return this.fetchData();
    }
    const reg = new RegExp(searchText, 'gi');
    this.setState({
      filterDropdownVisible: false,
      filtered: !!searchText,
    });
    console.log('dataAsset: ', dataAsset);
    const sortAsset = dataAsset.map((record) => {
      const match = record.tuser.match(reg);
      if (!match) {
        return null;
      }
      return record;
    }).filter(record => !!record);
    console.log('sortAsset: ', sortAsset);
    this.props.dispatch({
      type: 'asset/filtrate',
      payload: sortAsset,
    })
  }
  handleChange = (value) => { // AutoComplete组件数据发生改变时调用
    if (value === '') {
      this.setState({nameSource: []});
    } else {
      queryLike(value)
        .then((response) => {
          if (Object.prototype.toString.call(response) === '[object Array]') {
            const temp = [];
            response.map((item) => {
              temp.push(item.name);
            });
            this.setState({
              dataSource: [...response],
              nameSource: [...temp],
            });
          } else if (Object.prototype.toString.call(response) === '[object Object]') {
            const temp = [];
            temp.push(response);
            this.setState({
              nameSource: [response.name],
              dataSource: [...temp],
            });
          }
        });
    }
  };
  handleSelete = (value) => { // 选中数据时调用
    this.setState({allotName: value});
    if ( this.state.dataSource.length !== 0) {
      this.state.dataSource.map((item) => {
        if (item.name === value) {
          this.setState({employeeNum: item.employeeNumber})
        }
      });
    } else {
      return null;
    }
  };

  addUser = () => { // 添加资产时调用
    const {dispatch} = this.props;
    dispatch(routerRedux.push('/tabs/asset/asset-manage/asset-add'));
  };

  editAsset = (emId) => { // 修改资产时调用
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname: '/tabs/asset/asset-manage/asset-add',
      id: emId,
    }));
  };

  batchDelete = (arr) => { // 批量删除时调用
    this.props.dispatch({
      type: 'asset/batchDelete',
      payload: arr,
    });
    this.setState({emIds: []});
  };

  handleCancelErr = () => { // modal组件点击取消按钮后调用
    this.setState({visible: false});
  };

  handleOk = () => { // modal组件点击确认后调用
    const {emId, allotName, employeeNum, initatorNum}  = this.state;
    if (allotName === JSON.parse(sessionStorage.getItem('user')).t.name) {
      this.setState({visible: false});
      return message.warning('自己不能分配自己!');
    } else {
      const PutData = {
        aid: emId,
        accepterNum: employeeNum,
        initatorNum,
      };
      allotAsset(PutData);
      this.setState({visible: false});
    }
  };
  showModal = () => {
    return (
      <Modal
        title="请填写分配人"
        visible={this.state.visible}
        onCancel={this.handleCancelErr}
        onOk={this.handleOk}
        okText="确定"
        cancelText="取消"
        width="220px"
      >
        <AutoComplete
          dataSource={this.state.nameSource}
          style={{ width: 180 }}
          onChange={this.handleChange}
          onSelect={this.handleSelete}
          placeholder="分配人姓名"
        />
      </Modal>
    );
  };
  allot = (item) => { // 点击分配按钮的函数
    this.setState({visible: true, emId: item.aid, initatorNum: item.employeeNum});
  };
  deleteAsset = (emId) => {
    this.props.dispatch({
      type: 'asset/deleteAsset',
      payload: emId,
    });
  };
  showDeleteConfirm = function () {
    const object = {
      title: '确定要删除吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onCancel() {
        // console.log('Cancel');
      },
    };
    object.onOk = () => {this.batchDelete(this.state.emIds)};
    confirm(object);

  }.bind(this);

  handleSeleteSearch = (value) => { // 选中数据时调用
    if (value.trim() === '') {
      this.props.dispatch({
        type: 'asset/fetchAssets',
      });
    } else {
      this.props.dispatch({
        type: 'asset/search',
        payload: value.trim().toUpperCase(),
      });
    }
  };
  handleSearchChange = (value) => {
    if (value.target.value === '') {
      this.fetchData();
    }
  }
  renderOperation = (item) => { // 权限分配
    if (this.state.authority) {
      return (
        <div>
          <Popconfirm title="确定删除吗？" onConfirm={() => this.deleteAsset(item.aid)}>
              <a>删除</a>
          </Popconfirm>
          <Divider type="vertical"/>
          <Tooltip title="点击完成编辑、分配资产等操作">
            <a onClick={() => this.editAsset(item.aid)}>编辑</a>
          </Tooltip>
        </div>
      );
    } else {
      return (
        <div>
          <Tooltip title="点击完成分配资产">
            <a onClick={() => this.readAsset(item.aid)}>编辑</a>
          </Tooltip>
        </div>
      )
    }
  };

  render() {
    const {assets: {list, loading}} = this.props;
    dataAsset = list;
    const fetch = this.fetchData;
    const {authority} = this.state;
    const props = {
      name: 'file',
      action: UPLOAD_ASSERT,
      headers: {
        authorization: 'authorization-text',
      },
      showUploadList: false,
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          fetch();
          message.success(`${info.file.name} 上传成功，已导入${info.file.response.length}条记录`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    const columns = [
      {title: '类型', dataIndex: 'type', key: 'type'},
      {title: '品牌', dataIndex: 'brand', key: 'brand'},
      {title: '型号', dataIndex: 'modelNum', key: 'modelNum'},
      {title: '序列号', dataIndex: 'serial', key: 'serial'},
      {title: '固定资产编号', dataIndex: 'inventarNum', key: 'inventarNum'},
      {title: '快速服务码', dataIndex: 'quickCode', key: 'quickCode'},
      {
        title: '使用者',
        dataIndex: 'tuser',
        key: 'tuser',
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Search
              ref={ele => this.searchInput = ele}
              placeholder = "Search name"
              onChange={this.onInputChange}
              onSearch={this.tuserSearch}
              enterButton
              defaultValue={this.state.searchText}
            />
          </div>
        ),
        filterIcon: <Icon type="smile-o" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible: this.state.filterDropdownVisible,
        onFilterDropdownVisibleChange: (visible) => {
          this.setState({
            filterDropdownVisible: visible,
          }, () => this.searchInput);
        },
      },
      {
        title: '使用情况',
        dataIndex: 'usage',
        key: 'usage',
        filters: [{
          text: '新购置',
          value: '新购置',
        }, {
          text: '闲置',
          value: '闲置',
        }, {
          text: '报废',
          value: '报废',
        }, {
          text: '需维修',
          value: '需维修',
        }, {
          text: '使用中',
          value: '使用中',
        }],
        filterMultiple: false,
        onFilter: (value, record) => record.usage.indexOf(value) === 0,
      },
      {
        title: '操作',
        align: 'center',
        width: '150px',
        render: item => (
          this.renderOperation(item)
        ),
      },
    ];
    const cbKeys = (keys) => {
      this.setState({emIds: [...keys]});
    };
    if (authority) {
      return (
        <div >
          <div style={{marginBottom: 10}}>
            <Button className={style.container} onClick={this.addUser}><Icon type="plus" />添加资产</Button>
            <Upload {...props}>
              <Button>
                <Icon type="upload"/> 批量导入
              </Button>
            </Upload>
            <Button>
              <Icon type="export" /> <a href={`${EXPORTASSETEXCEL}`}>批量导出</a>
            </Button>
            <Button onClick={this.showDeleteConfirm}>
              <Icon type="delete"/> 批量删除
            </Button>
            <Search
              placeholder="品牌/型号/序列号搜索"
              onSearch={(value) => {this.handleSeleteSearch(value)}}
              onChange={(e) => {this.handleSearchChange(e)}}
              enterButton
              style={{width: 300, marginLeft: 10}}
            />
          </div>
          <AssetTable
            rowKey={record => record.aid}
            cbKeys={cbKeys}
            columns={columns}
            dataSource={list}
          />
        </div>
      );
    } else {
      return (
        <div>
          <Table
            rowKey={record => record.aid}
            dataSource={list}
            columns={columns}
            loading={loading}
          />
          {this.showModal()}
        </div>
      );
    }
  }
}

export default connect(state => ({
  assets: state.asset,
}))(AssetManage);
