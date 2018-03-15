import React from 'react';
import {connect} from 'dva';
import {Input, Popconfirm, message, Button, Icon, Modal, Divider } from 'antd';
import {FindAllDepartment, zuzhijgbc, editDepartment, zhuzijgsc} from '../../../services/api';
import Table from '../../../components/Table/Table';
import PropTypes from 'prop-types';

let data = [];
let counter = 2018023;
const columns = [];
const {confirm} = Modal;

@connect(state => ({
  invite: state.invite,
}))
class EditableTable extends React.Component {
  static propTypes = {
    columnsData: PropTypes.array.isRequired,
    dataSource: PropTypes.array.isRequired,
  }
  
  // constructor(props) {
  //   super(props);
  //   this.columns = [{
  //     title: '一级部门',
  //     dataIndex: 'yjbm',
  //     width: 150,
  //     render: (text, record) => this.EditableCell(text, record, 'yjbm'),
  //   }, {
  //     title: '一级部门主管',
  //     dataIndex: 'yjzg',
  //     width: 150,
  //     render: (text, record) => this.EditableCell(text, record, 'yjzg'),
  //   }, {
  //     title: '二级部门',
  //     dataIndex: 'ejbm',
  //     width: 150,
  //     render: (text, record) => this.EditableCell(text, record, 'ejbm'),
  //   }, {
  //     title: '二级部门主管',
  //     dataIndex: 'ejzg',
  //     width: 150,
  //     render: (text, record) => this.EditableCell(text, record, 'ejzg'),
  //   }, {
  //     title: '操作',
  //     dataIndex: 'operation',
  //     width: 150,
  //     render: (text, record) => {
  //       const { editable } = record;
  //       return (
  //         <div className="editable-row-operations">
  //           {
  //             editable ?
  //               <span>
  //                 {/* <a onClick={() => this.save(record)}>Save</a> */}
  //                 <Popconfirm title="确定保存吗？" onConfirm={() => this.save(record)}>
  //                   <a>保存</a>
  //                 </Popconfirm>
  //                 <Divider type="vertical" />
  //                 <a onClick={() => this.cancel(record.key)}>取消</a>
  //                 {/* <Divider type="vertical" />
  //                 <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
  //                   <a onClick={() => this.save(record)}>Save</a>
  //                 </Popconfirm> */}
  //               </span>
  //             :
  //               <span>
  //                 <a onClick={() => this.edit(record.key)}>编辑</a>
  //                 <Divider type="vertical" />
  //                 <a onClick={() => this.add(record.key)}>复制</a>
  //               </span>
  //           }
  //         </div>
  //       );
  //     },
  //   }];
  //   this.state = {data, emIds: []};
  //   this.cacheData = data.map(item => ({ ...item }));
  // }

  componentDidMount() {
    this.fetchDate();
  }
  createColums = (dataArr) => {
    dataArr.map((it) => {
      columns.push({title: it.title, dataIndex: it.dataIndex, render: (text, record) => this.EditableCell(text, record, it.dataIndex)});
    });
    columns.push({
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        const { editable } = record;
        return (
          <div>
            {
              editable ?
                <span>
                  <Popconfirm title="确定保存吗？" onConfirm={() => this.save(record)}>
                    <a>保存</a>
                  </Popconfirm>
                </span>
              :
                <span>
                  <a onClick={() => this.edit(record.key)}>编辑</a>
                </span>
            }
          </div>
        );
      }});
  }
  handleChange = (value, column, key) => {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target[column] = value;
      // this.setState({ data: newData});
      data = newData;
    }
    // this.setState({zhuzhi})
  }
  fetchDate = () => {
    FindAllDepartment()
      .then((response) => {
        data = response;
        this.setState({data});
      });
  }
  edit(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target.editable = true;
      data = newData;
      this.setState({data});
    }
  }
  add = (key) => {
    counter += 1;
    let flag = 0;
    const newData = [...this.state.data];
    const tempData = {...newData.filter((it, i) => {
      if (it.key === key) {
        flag = i;
        return true;
      }
    })[0]};
    tempData.key = counter;
    tempData.id = '0';
    data.splice(flag + 1, 0, tempData);
    this.setState({data});
    this.edit(counter);
  }
  handleClick = () => {
    counter += 1;
    const tempData = {
      id: '0',
      key: counter,
      yjbm: '',
      ejbm: '',
      sanjbm: '',
      sijbm: '',
      wjbm: '',
      yjzg: '',
      ejzg: '',
      sanjzg: '',
      sijzg: '',
      wjzg: '',
    };
    data.unshift(tempData);
    this.setState({data});
  }
  handleDelete = () => {
    const {emIds} = this.state;
    const emidStr = emIds.join(',');
    let newData = [];
    zhuzijgsc(emidStr)
      .then((res) => {
        if (res.status) {
          newData = [...this.state.data].filter((it) => {
            let flag = false;
            for (let j = 0; j < emIds.length; j += 1) {
              if (it.id === emIds[j] || it.key === emIds[j]) {
                flag = true;
              }
            }
            if (!flag) {
              return true;
            }
          });
        }
        data = newData;
        this.cacheData = newData.map(item => ({ ...item }));
        this.setState({data: newData});
      });
  }
  save(record) {
    const {key, id} = record;
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      if (target.yjbm === '' || target.ejbm === '') {
        message.error('一级部门和二级部门为必填项！');
        return false;
      }
      delete target.editable;
      if (id === '0') {
        delete target.id;
        zuzhijgbc(target)
          .then((res) => {
            if (res.status === 'ok') {
              message.success(res.content);
              this.fetchDate();
              // this.setState({ data: newData });
              // this.cacheData = newData.map(item => ({ ...item }));
            } else {
              message.error(res.content);
            }
          });
      } else {
        const body = {
          ...target,
          id,
        };
        editDepartment(body)
          .then((res) => {
            console.log('res: ', res);
            if (res.status === 'ok') {
              message.success('修改成功');
              this.setState({data: newData});
              this.cacheData = newData.map(item => ({ ...item }));
            } else {
              message.error('修改失败');
              this.cancel(key);
            }
          });
      }
    }
  }
  cancel(key) {
    const newData = [...data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
      delete target.editable;
      this.setState({ data: newData });
    }
  }
  EditableCell = (text, record, column) => {
    return (
      <div>
        {record.editable
          ? <Input
            defaultValue={text}
            style={{ margin: '-5px 0' }}
            // onBlur={e => this.onBlur(e.target.value, column, record.key)}
            onChange={e => this.handleChange(e.target.value, column, record.key)}
          />
          : text
        }
      </div>
    );
  }

  showDeleteConfirm = () => { //  批量删除时弹出的modal
    const object = {
      title: '确定要删除吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onCancel() {
        console.log('Cancel');
      },
    };
    object.onOk = () => {
      if (this.state.emIds.length === 0) {
        message.error('请选择所需要删除的对象');
      } else {
        this.handleDelete();
      }
    };
    confirm(object);
  };

  render() {
    const cbKeys = (keys) => {
      this.setState({
        emIds: [...keys],
      });
    };
    return (
      <div style={{width: 1413}}>
        <Table
          rowKey={record => record.id}
          cbKeys={cbKeys}
          bordered
          dataSource={this.state.data}
          columns={this.columns}
          scroll={{ x: 1710}}
        />
      </div>
    );
  }
}
export default EditableTable;
