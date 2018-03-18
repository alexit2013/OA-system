import React from 'react';
import {connect} from 'dva';
import {Button, Divider, Icon, message, Modal, Input, Row, Col} from 'antd';
import TableAsset from '../../../components/Table/Table';
import {AssetDetails} from '../../../services/api';
import {formatTime} from '../../../utils/timeUtil';
// import {getShowText} from '../../../utils/utils';
import {filtrate} from '../../../utils/filterData';

const {confirm} = Modal;
const {Search} = Input;
class VerifyTaskManage extends React.Component {
  state = {
    flag: true,
    emIds: [],
  };
  componentDidMount() {
    this.fetchData();
  }
  fetchData = () => { // 请求需要确认的任务信息
    const {dispatch} = this.props;
    dispatch({
      type: 'asset/UsersAcceptMission',
    });
  };
  showAssetDetail = (item) => { // 显示资产详情时调用
    AssetDetails(item.aid)
      .then((response) => {
        if (Object.prototype.toString.call(response) === '[object Object]') {
          response.accepterName = item.accepterName;
          this.setState({flag: false});
          this.AssetDetailContent(response);
        } else {
          this.setState({flag: true});
          this.AssetDetailContent({});
        }
      });
  };
  AssetDetailContent = (data) => {
    // console.log(this.state.flag);
    if (this.state.flag) {
      return message.error('对不起该资产已被管理员删除');
    } else {
      Modal.info({
        title: '资产详情',
        width: '700px',
        content: (
          <div>
            <Row>
              <Col span={12}>
                <div>
                  <span>使用人:</span>
                  <div style={{display: 'inline-block', marginLeft: 5}}>{data.tuser}</div>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <span>分配后使用人:</span>
                  <div style={{display: 'inline-block', marginLeft: 5}}>{data.accepterName}</div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <div>
                  <span>类型:</span>
                  <div style={{display: 'inline-block', marginLeft: 5}}>{data.type}</div>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <span>采购日期:</span>
                  <div style={{display: 'inline-block', marginLeft: 5}}>{formatTime(data.procureDate)}</div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <div>
                  <span>到货日期:</span>
                  <div style={{display: 'inline-block', marginLeft: 5}}>{formatTime(data.arriveDate)}</div>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <span>品牌:</span>
                  <div style={{display: 'inline-block', marginLeft: 5}}>{data.brand}</div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <div>
                  <span>型号:</span>
                  <div style={{display: 'inline-block', marginLeft: 5}}>{data.modelNum}</div>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <span>品名:</span>
                  <div style={{display: 'inline-block', marginLeft: 5}}>{data.brandName}</div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <div>
                  <span>MAC地址:</span>
                  <div style={{display: 'inline-block', marginLeft: 5}}>{data.macAddress}</div>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <span>快速服务码:</span>
                  <div style={{display: 'inline-block', marginLeft: 5}}>{data.quickCode}</div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <div>
                  <span>序列号:</span>
                  <div style={{display: 'inline-block', marginLeft: 5}}>{data.serial}</div>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <span>单价:</span>
                  <div style={{display: 'inline-block', marginLeft: 5}}>{data.price}</div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <div>
                  <span>固定资产编号:</span>
                  <div style={{display: 'inline-block', marginLeft: 5}}>{data.inventarNum}</div>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <span>备注:</span>
                  <div style={{display: 'inline-block', marginLeft: 5}}>{data.remarks}</div>
                </div>
              </Col>
            </Row>
          </div>
        ),
      });
    }
  };
  accept = (item) => {
    // console.log('item: ', item);
    const status = {// 当点击确认键后发送确认信息
      ...item,
      status: '接受',
    };
    this.props.dispatch({
      type: 'asset/assetAlloc',
      payload: status,
    });
  };
  reject = (item) => {
    const status = {// 当点击确认键后发送确认信息
      ...item,
      status: '拒绝',
    };
    this.props.dispatch({
      type: 'asset/assetAlloc',
      payload: status,
    });
  };
  handleStatus = (item) => {
    if (item.status === '待确认') {
      return (
        <div>
          <a onClick={() => this.showAssetDetail(item)}>详情</a>
          <Divider type="vertical"/>
          <a onClick={() => this.accept(item)}>接受</a>
          <Divider type="vertical"/>
          <a onClick={() => this.reject(item)}>拒绝</a>
        </div>
      );
    } else {
      return (
        <div>
          <a onClick={() => this.showAssetDetail(item)}>资产详情</a>
        </div>
      );
    }
  };
  showDeleteConfirm = (value, text) => { // 批量操作时弹出的modal
    const object = {
      title: text,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onCancel() {
        // console.log('Cancel');
      },
    };
    object.onOk = () => {
      if (this.state.emIds.length === 0) {
        message.error('请选择需要操作的对象!');
      } else {
        this.batchOperation(value);
      }
    };
    confirm(object);
  };
  batchOperation = (value) => {
    const {emIds} = this.state;
    const putData = {
      name: value,
      body: emIds,
    };
    this.props.dispatch({
      type: 'asset/batchOperation',
      payload: putData,
    });
  }
  handleSearch = (e) => {
    const value = e.trim();
    this.props.dispatch({
      type: 'asset/VerifyTaskManage',
      payload: value,
    });
  }
  layoutButton = () => {
    return (
      <div style={{marginBottom: 10}}>
        <Button onClick={() => this.showDeleteConfirm('accept', '确定要接受吗？')}>
          <Icon type="check" />批量接受
        </Button>
        <Button style={{marginLeft: 5}} onClick={() => this.showDeleteConfirm('reject', '确定要拒绝吗？')}>
          <Icon type="close" />批量拒绝
        </Button>
      </div>
    );
  }
  render() {
    const {asset: {loading, verifylist}} = this.props;
    const columns = [
      {
        title: '当前使用人',
        dataIndex: 'initarorName',
        filters: filtrate(verifylist, 'initarorName'),
        onFilter: (value, record) => {
          if (record.initarorName === null || record.initarorName === '') {
            return false;
          }
          return record.initarorName.indexOf(value) === 0;
        },
      },
      {
        title: '转移接收人',
        dataIndex: 'accepterName',
        filters: filtrate(verifylist, 'accepterName'),
        onFilter: (value, record) => {
          if (record.accepterName === null || record.accepterName === '') {
            return false;
          }
          return record.accepterName.indexOf(value) === 0;
        },
      },
      {
        title: '分配时间',
        dataIndex: 'initDate',
        render: val => <span> {formatTime(val)} </span>,
      },
      {title: '备注', dataIndex: 'remarks', key: 'remarks'},
      {
        title: '状态',
        dataIndex: 'status',
        width: '100px',
        filters: filtrate(verifylist, 'status'),
        onFilter: (value, record) => {
          if (record.status === null || record.status === '') {
            return false;
          }
          return record.status.indexOf(value) === 0;
        },
      },
      {
        title: '操作',
        align: 'center',
        render: item => (
          this.handleStatus(item)
        ),
      },
    ];
    const cbKeys = (keys) => {
      console.log('keys: ', keys);
      this.setState({
        emIds: [...keys],
      });
    };
    return (
      <div >
        {this.layoutButton()}
        <TableAsset
          rowKey={record => record.mid}
          cbKeys={cbKeys}
          columns={columns}
          dataSource={verifylist}
          loading={loading}
        />
      </div>
    );
  }
}

export default connect(state => ({
  asset: state.asset,
}))(VerifyTaskManage);
