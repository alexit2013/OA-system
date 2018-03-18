import React from 'react';
import {connect} from 'dva';
import moment from 'moment';
import {queryLike} from '../../../services/api';
import {Table, Modal, Form, Col, Row, AutoComplete, DatePicker, Select, Input} from 'antd';

const FormItem = Form.Item;
const {Option} = Select;

@connect(state => ({invite: state.invite}))
class InviteEntry extends React.Component {
  state = {
    visible: false,
    id: '',
    leaderSource: [],
    vpSource: [],
    coachSource: [],
    leadeid: '', // 主管工号
    vpid: '', // 总监工号
    coachid: '', // 思想导师工号
  }
  componentDidMount() {
    this.fectData();
  }
  fectData = () => { // 获取跟进入职人员
    this.props.dispatch({
      type: 'invite/fetchEntry',
    });
  }
  entry = (id) => { // show Modal
    this.setState({id, visible: true});
  }
  submitEntry = () => { // 提交补充信息
    const {id, leadeid, vpid, coachid} = this.state;
    this.props.form.validateFields((err, values) => {
      const putData = {
        ...values,
        reId: id,
        vpId: vpid,
        directorNumber: leadeid,
        mentorNumber: coachid,
      };
      if (!err) {
        console.log('putData: ', putData);
        this.props.dispatch({
          type: 'invite/isEntry',
          payload: putData,
        });
      }
    });
    this.setState({visible: false});
    this.props.form.resetFields();
  }
  hideModal = () => { // 隐藏Modal
    this.setState({visible: false});
    this.props.form.resetFields();
  }
  leaderChange = (value) => { // 获取主管工号，并联想
    const name = value.trim();
    if (name === '') {
      return;
    }
    const leaderSource = [];
    let leadeid = '';
    queryLike(name)
      .then((res) => {
        res.map((it) => {
          leaderSource.push(it.name);
          leadeid = it.employeeNumber;
        });
        this.setState({leaderSource, leadeid});
      });
  }
  vpChange = (value) => { // 获取总监工号并联想
    const name = value.trim();
    if (name === '') {
      return;
    }
    console.log('aaaaa: ', name);
    const vpSource = [];
    let vpid = '';
    queryLike(name)
      .then((res) => {
        res.map((it) => {
          vpSource.push(it.name);
          vpid = it.employeeNumber;
        });
        this.setState({vpSource, vpid});
      });
  };
  cocahChange = (value) => { // 获取思想导师工号并联想
    const name = value.trim();
    if (name === '') {
      return;
    }
    const coachSource = [];
    let coachid = '';
    queryLike(name)
      .then((res) => {
        res.map((it) => {
          coachSource.push(it.name);
          coachid = it.employeeNumber;
        });
        this.setState({coachSource, coachid});
      });
  }
  render() {
    const {leaderSource, vpSource, coachSource} = this.state;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 10},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
        md: {span: 10},
      },
    };
    const verifyModal = () => {
      const {getFieldDecorator} = this.props.form;
      return (
        <Modal
          title="信息补充"
          visible={this.state.visible}
          onOk={this.submitEntry}
          onCancel={this.hideModal}
          okText="提交"
          cancelText="取消"
          width="650px"
        >
          <Form>
            <Row>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="主管姓名"
                >
                  {getFieldDecorator('directorName', {

                    initialValue: '',
                  })(
                    <AutoComplete
                      dataSource={leaderSource}
                      onChange={this.leaderChange}
                      placeholder="主管姓名"
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="总监姓名"
                >
                  {getFieldDecorator('vp', {
                    initialValue: '',
                  })(
                    <AutoComplete
                      dataSource={vpSource}
                      onChange={this.vpChange}
                      placeholder="总监姓名"
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="思想导师姓名"
                >
                  {getFieldDecorator('mentorName', {
                    initialValue: '',
                  })(
                    <AutoComplete
                      dataSource={coachSource}
                      onChange={this.cocahChange}
                      placeholder="思想导师姓名"
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="入职时间"
                >
                  {getFieldDecorator('entryDate', {
                    initialValue: moment(),
                  })(
                    <DatePicker />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="招聘类型"
                >
                  {getFieldDecorator('recruitmentType', {

                  })(
                    <Select>
                      <Option value="社招">社招</Option>
                      <Option value="应届">应届</Option>
                      <Option value="猎头">猎头</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="雇佣关系"
                >
                  {getFieldDecorator('employmentType', {
                  })(
                    <Select>
                      <Option value="全职">全职</Option>
                      <Option value="实习">实习</Option>
                      <Option value="兼职">兼职</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="工作地"
                >
                  {getFieldDecorator('workPlace')(
                    <Input autoComplete="off"/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    };
    const {invite: { entrylist, loading }} = this.props;
    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '需求',
      dataIndex: 'hcCode',
      key: 'hcCode',
    }, {
      title: '二级部门',
      dataIndex: 'secondDept',
      key: 'sdepartment',
    }, {
      title: '最小部门',
      dataIndex: 'mdepartment',
      key: 'mdepartment',
    }, {
      title: '岗位类别',
      dataIndex: 'positionType',
      key: 'pstyle',
    }, {
      title: '岗位名称',
      dataIndex: 'pname',
      key: 'pname',
    }, {
      title: '计划入职时间',
      dataIndex: 'jobAge',
      key: 'jobAge',
    }, {
      title: '操作',
      align: 'center',
      width: 180,
      render: item => (
        <a onClick={() => { this.entry(item.zid); }}>确定入职</a>
      ),
    }];
    return (
      <div>
        {verifyModal()}
        <Table
          rowKey={record => record.zid}
          columns={columns}
          dataSource={entrylist}
          loading={loading}
        />
      </div>
    );
  }
}

export default Form.create({})(InviteEntry);
