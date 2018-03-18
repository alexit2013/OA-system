import React from 'react';
import {connect} from 'dva';
import {Button, DatePicker, Form, Input, notification, Select, Row, Col, AutoComplete, Modal, message} from 'antd';
import moment from 'moment';
import {isEmpty} from 'lodash';
import {queryLike, AssetDetails} from '../../../services/api';
import {ASSET_USAGE} from '../../../common/constants';
import { isAsset, isAdmin } from '../../../utils/authority';

const FormItem = Form.Item;
const { Option } = Select;
const dateFormat = 'DD-MM-YYYY';

function hasErrors(fieldsError) { // 判断是否有错误
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class AddAsset extends React.Component {
  state = {
    asset: {},
    nameSource: [],
    dataSource: [],
    edit: false,
    aid: '',
    tuserName: '',
    visible: false,
  };

  componentDidMount() {
    // To disabled submit button at the beginning.
    // this.props.form.validateFields();
    this.fetchData(this.props.location.id); // 编辑的时候，自动获取数据
  }

  fetchData = (id) => {
    if (!isEmpty(id)) {
      this.setState({edit: true});
      AssetDetails(id)
        .then((data) => {
          this.setState({
            asset: {
              ...data,
              procureDate: data.procureDate ? moment(data.procureDate) : null,
              arriveDate: data.arriveDate ? moment(data.arriveDate) : null,
            },
            aid: id,
            tuserName: data.tuser,
          });
        });
    }
  };

  goBack = () => {
    this.props.history.goBack();
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const {tuserName} = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (isAdmin() || isAsset()) {
          // 新增操作
          if (this.state.edit) {
            this.setState({visible: false});
            values.aid = this.state.aid;
            this.props.dispatch({
              type: 'asset/editAsset',
              payload: values,
            });
          } else {
            this.props.dispatch({
              type: 'asset/saveAsset',
              payload: values,
            });
          }
          return null;
        }
        if (this.state.edit) {
          if (tuserName === values.tuser) {
            this.setState({visible: false});
            values.aid = this.state.aid;
            this.props.dispatch({
              type: 'asset/editAsset',
              payload: values,
            });
          } else {
            this.setState({visible: true});
          }
        } else {
          this.props.dispatch({
            type: 'asset/saveAsset',
            payload: values,
          });
        }
      } else {
        notification.error({
          message: '请求错误 error',
        });
      }
    });
  }
  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.state.edit) {
          values.aid = this.state.aid;
          if (values.employeeNum === '') {
            return message.error('使用者姓名不正确！');
          }
          this.props.dispatch({
            type: 'asset/editAsset',
            payload: values,
          });
        }
      }
    });
    this.setState({visible: false});
  }
  handleCancel = () => {
    this.setState({visible: false});
    this.goBack();
  }
  isModal = () => {
    return (
      <Modal
        title="资产"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okText="提交"
      >
        <p>使用者已更改，确认提交？</p>
      </Modal>
    );
  }
  isButton = () => {
    const {getFieldsError} = this.props.form;
    return (
      <div >
        <Button
          style={{width: '90px'}}
          type="primary"
          htmlType="submit"
          disabled={hasErrors(getFieldsError())}
        >
          提交
        </Button>
        <Button
          style={{width: '90px', marginLeft: '3px'}}
          type="primary"
          onClick={() => this.props.history.goBack()}
        >
          返回
        </Button>
      </div>
    );
  }
  handleChange = (value) => {
    if (value.trim() === '') {
      this.setState({nameSource: []});
      this.props.form.setFieldsValue({
        employeeNum: '',
        department: '',
      });
    } else {
      queryLike(value.trim())
        .then((response) => {
          if (Object.prototype.toString.call(response) === '[object Array]') {
            const temp = [];
            response.map((item) => {
              temp.push(item.name);
              if (item.name === value.trim()) {
                this.props.form.setFieldsValue({
                  employeeNum: item.employeeNumber,
                  department: item.station,
                });
              }
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
  handleSelete = (value) => {
    if (this.state.dataSource.length) {
      const temp = this.state.dataSource;
      temp.map((item) => {
        if (item.name === value) {
          this.props.form.setFieldsValue({
            employeeNum: item.employeeNumber,
            department: item.station,
          });
        }
      });
    }
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    const {asset, nameSource} = this.state;
    const {disabled} = this.props;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
        md: {span: 10},
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 10, offset: 7},
      },
    };

    return (
      <Form onSubmit={this.handleSubmit}>
        {this.isModal()}
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="类型"
            >
              {getFieldDecorator('type', {
                rules: [{required: true, message: '请输入类型！'}],
                initialValue: asset.type,
              })(
                <Input style={{width: '180px'}} disabled={disabled}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="采购日期"
            >
              {getFieldDecorator('procureDate', {
                initialValue: asset.procureDate,
              })(
                <DatePicker format={dateFormat} style={{width: '180px'}} disabled={disabled}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="订单号"
            >
              {getFieldDecorator('orderNum', {
                initialValue: asset.orderNum,
              })(
                <Input style={{width: '180px'}} disabled={disabled}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="到货日期"
            >
              {getFieldDecorator('arriveDate', {
                rules: [{required: true, message: '请输入到货日期！'}],
                initialValue: asset.arriveDate,
              })(
                <DatePicker format={dateFormat} style={{width: '180px'}} disabled={disabled}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="品牌"
            >
              {getFieldDecorator('brand', {
                rules: [{required: true, message: '请输入品牌！'}],
                initialValue: asset.brand,
              })(
                <Input style={{width: '180px'}} disabled={disabled}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="型号"
            >
              {getFieldDecorator('modelNum', {
                rules: [{required: true, message: '请输入型号！'}],
                initialValue: asset.modelNum,
              })(
                <Input style={{width: '180px'}} disabled={disabled}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="品名"
            >
              {getFieldDecorator('brandName', {
                initialValue: asset.brandName,
              })(
                <Input style={{width: '180px'}} disabled={disabled}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="使用者"
            >
              {getFieldDecorator('tuser', {
                initialValue: asset.tuser,
              })(
                <AutoComplete
                  dataSource={nameSource}
                  style={{ width: 180 }}
                  onSelect={this.handleSelete}
                  onChange={this.handleChange}
                />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="使用情况"
            >
              {getFieldDecorator('usage', {
                initialValue: asset.usage,
              })(
                <Select style={{width: 180}} disabled={disabled}>
                  {ASSET_USAGE.map(it => (<Option value={it} key={it}>{it}</Option>))}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="工号"
            >
              {getFieldDecorator('employeeNum', {
                initialValue: asset.employeeNum,
              })(
                <Input style={{width: '180px'}} disabled/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="部门"
            >
              {getFieldDecorator('department', {
                initialValue: asset.department,
              })(
                <Input style={{width: '180px'}} disabled/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="MAC地址"
            >
              {getFieldDecorator('macAddress', {
                initialValue: asset.macAddress,
              })(
                <Input style={{width: '180px'}} disabled={disabled}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="快速服务码"
            >
              {getFieldDecorator('quickCode', {
                rules: [{required: true, message: '请输入型号！'}],
                initialValue: asset.quickCode,
              })(
                <Input style={{width: '180px'}} disabled={disabled}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="序列号"
            >
              {getFieldDecorator('serial', {
                rules: [{required: true, message: '请输入序列号！'}],
                initialValue: asset.serial,
              })(
                <Input style={{width: '180px'}} disabled={disabled}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="单价"
            >
              {getFieldDecorator('price', {
                initialValue: asset.price,
              })(
                <Input style={{width: '180px'}} disabled={disabled}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="固定资产编号"
            >
              {getFieldDecorator('inventarNum', {
                rules: [{required: true, message: '固定资产编号'}],
                initialValue: asset.inventarNum,
              })(
                <Input style={{width: '180px'}} disabled={disabled}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...submitFormLayout}>
              {this.isButton(disabled)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="备注"
            >
              {getFieldDecorator('remarks', {
                initialValue: asset.remarks,
              })(
                <Input style={{width: '180px'}} disabled={disabled}/>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default connect(state => ({
  disabled: state.asset.disabled,
}))(Form.create({})(AddAsset));
