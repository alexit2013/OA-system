import React from 'react';
import {Modal, Table, Row, Col, message} from 'antd';
import {connect} from 'dva';
import {UsersInitMission, AssetDetails} from '../../../services/api';
import {formatTime} from '../../../utils/timeUtil';
import {getShowText} from '../../../utils/utils';
import {filtrate} from '../../../utils/filterData';

class TaskManage extends React.Component {
  state = {
    List: [],
    flag: true,
  };

  componentDidMount() {
    this.fetchData(); // 组件装载完后,向后台请求任务列表
  }

  fetchData = () => {
    UsersInitMission()
      .then((response) => {
        this.setState({List: response});
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
          this.AssetDetailContent({});
          this.setState({flag: true});
        }
      });
  };
  AssetDetailContent = (data) => {
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
  render() {
    const getShowTextStatus = (val) => {
      if (val === '接受') {
        return (
          <span style={{color: '#11ee55'}}>已接收</span>
        );
      } else if (val === '拒绝') {
        return (
          <span style={{color: 'red'}}>已拒绝</span>
        );
      } else if (val === '待确认') {
        return (
          <span style={{color: 'purple'}}>待确认</span>
        );
      }
    };
    const {List} = this.state; // Tabel的数据源
    const columns = [
      {
        title: '发起人',
        dataIndex: 'initarorName',
        filters: filtrate(List, 'initarorName'),
        onFilter: (value, record) => {
          if (record.initarorName === null || record.initarorName === '') {
            return false;
          }
          return record.initarorName.indexOf(value) === 0;
        },
      },
      {
        title: '接收人',
        dataIndex: 'accepterName',
        filters: filtrate(List, 'accepterName'),
        onFilter: (value, record) => {
          if (record.accepterName === null || record.accepterName === '') {
            return false;
          }
          return record.accepterName.indexOf(value) === 0;
        },
      },
      {
        title: '发起时间',
        dataIndex: 'initDate',
        render: val => <span>{formatTime(val)}</span>,
      },
      {
        title: '确认时间',
        dataIndex: 'acceptDate',
        render: val => <span>{formatTime(val)}</span>,
      },
      {title: '备注', dataIndex: 'grade', key: 'grade'},
      {
        title: '状态',
        dataIndex: 'status',
        filters: filtrate(List, 'status'),
        onFilter: (value, record) => {
          if (record.status === null || record.status === '') {
            return false;
          }
          return record.status.indexOf(value) === 0;
        },
      },
      {
        title: '操作',
        render: item => (
          <div>
            <a onClick={() => this.showAssetDetail(item)}>资产详情</a>
          </div>
        ),
      },
    ];
    return (
      <div >
        <Table
          rowKey={record => record.mid}
          columns={columns}
          dataSource={List}
        />
      </div>
    );
  }
}

export default connect(state => ({
  asset: state.asset,
}))(TaskManage);
