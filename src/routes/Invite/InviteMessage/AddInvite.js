import React from 'react';
import {isEmpty} from 'lodash';
import {routerRedux} from 'dva/router';
import {connect} from 'dva';
import moment from 'moment';
import { Form, Input, Button, Select, DatePicker, Row, Col, AutoComplete, Upload, Icon, Modal, Table, Tooltip} from 'antd';
import {inviterInfo, queryLike, hcUnique, uniquePhoneNo, uniqueId} from '../../../services/api';
import { INVITE_SOURCE, UPLOAD_FILE, INVITE_STATUS, INVITEREDUCATION} from '../../../common/constants';
import {getDownloadUrlByDocId} from '../../../utils/utils';

const FormItem = Form.Item;
const {Option} = Select;
const {Search} = Input;
let srchValue = '';

// function hasErrors(fieldsError) { // 判断是否有错误
//   return Object.keys(fieldsError).some(field => fieldsError[field]);
// }
class AddInvite extends React.Component {
  state = {
    isHc: '',
    isHcInfo: '',
    isId: '',
    isIdInfo: '',
    isPh: '',
    isPhInfo: '',
    disabled: false,
    inviter: {},
    nameSourceSta: [],
    dataEmailSource: [],
    fileList: [],
    qualificationNo: '',
    synthesizeNo: '',
    technicalerNo: '',
    visible: false,
  };

  componentDidMount() {
    this.srchValue = this.props.location.srchValue;
    this.fetchData(this.props.location);
  }

  fetchData = (value) => {
    if (!isEmpty(value.id)) {
      inviterInfo(value.id)
        .then((response) => {
          if (!isEmpty(response.docNo)) {
            const files = [{
              uid: 1,
              name: response.title,
              status: 'done',
              url: getDownloadUrlByDocId(response.docNo),
            }];
            this.setState({fileList: files});
          }
          this.setState({
            inviter: {
              ...response,
              birth: response.birth ? moment(response.birth) : null,
              touchRecordDate: response.touchRecordDate ? moment(response.touchRecordDate) : null,
            },
          });
        });
    } else {
      if (isEmpty(value.body)) {
        return null;
      }
      if (value.body.docNo !== '') {
        const files = [{
          uid: 1,
          name: value.body.title,
          status: 'done',
          url: getDownloadUrlByDocId(value.body.docNo),
        }];
        this.setState({fileList: files});
      }
      this.setState({
        inviter: {
          ...value.body,
          birth: value.body.birth ? moment(value.body.birth) : null,
          touchRecordDate: value.body.touchRecordDate ? moment(value.body.touchRecordDate) : null,
        },
      });
    }
  }
  // 返回上一页
  backHistory = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/tabs/invite/invite-message',
      srchValue: this.srchValue,
    }));
  }
  handleFileInfoChange = (info) => {
    // console.log('info: ', info);
    let {fileList} = info;
    fileList = fileList.slice(-1);
    fileList = fileList.map((it) => {
      const fileInfo = {...it};
      if (fileInfo.response && fileInfo.response.id) {
        fileInfo.url = getDownloadUrlByDocId(fileInfo.response.id);
        fileInfo.name = fileInfo.response.fileName;
        fileInfo.fileId = fileInfo.response.id;
      }
      return fileInfo;
    });
    this.setState({fileList});
  }
  handleCancel = () => {
    this.setState({visible: false});
  };
  handleSelectHc = (item) => {
    this.props.form.setFieldsValue({
      hcCode: item.hcNo,
    });
    this.setState({visible: false});
  }
  layoutModal = () => {
    const {invite: {needlist}} = this.props;
    needlist.map((it) => {
      it.key = it.nid;
    });
    const columns = [{
      title: '招聘需求编码',
      dataIndex: 'hcNo',
      key: 'hcNo',
    }, {
      title: '一级部门',
      dataIndex: 'odepartment',
      key: 'odepartment',
    }, {
      title: '二级部门',
      dataIndex: 'sdepartment',
      key: 'sdepartment',
    }, {
      title: '岗位名称',
      dataIndex: 'pname',
      key: 'pname',
    }, {
      title: '职位状态',
      dataIndex: 'postStatus',
      key: 'postStatus',
    }, {
      title: '操作',
      align: 'center',
      render: item => (
        <div>
          <a onClick={() => { this.handleSelectHc(item); }}>选择</a>
        </div>
      ),
    }];
    if (needlist.length !== 0) {
      let switchs = true;
      if (needlist.length <= 10) {
        switchs = false;
      }
      return (
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleCancel}
          onCancel={this.handleCancel}
          width={1000}
        >
          <Table
            columns={columns}
            dataSource={needlist}
            pagination={switchs}
            onRow={(record) => { // 点击行onClick事件
              return {
                onClick: () => { this.handleSelectHc(record); },   
              };
            }}
          />
        </Modal>
      );
    } else {
      return (
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleCancel}
          onCancel={this.handleCancel}
          width={1000}
        >
          <h3 style={{color: 'red'}}>需求表中没有该需求</h3>
        </Modal>
      );
    }
  }
  handleChangeSta = (value) => { // AutoComplete组件数据发生改变时调用
    if (value.trim() === '') {
      this.setState({nameSourceSta: []});
    } else {
      queryLike(value.trim())
        .then((response) => {
          if (Object.prototype.toString.call(response) === '[object Array]') {
            const temp = [];
            response.map((item) => {
              temp.push(item.name);
            });
            this.setState({
              nameSourceSta: [...temp],
            });
          } else if (Object.prototype.toString.call(response) === '[object Object]') {
            const temp = [];
            temp.push(response);
            this.setState({
              nameSourceSta: [response.name],
            });
          }
        });
    }
  };
  handleBlurHc = (e) => {
    const valueStr = e.target.value.trim();
    if (valueStr === '' || valueStr === undefined) {
      this.setState({isHc: 'error', isHcInfo: '招聘需求编号不能为空', disabled: true});
    } else {
      hcUnique(valueStr)
        .then((response) => {
          if (response.status === 'error') {
            this.setState({isHc: 'error', isHcInfo: '招聘需求编号错误', disabled: true});
          } else {
            this.setState({isHc: 'success', isHcInfo: '', disabled: false});
          }
        });
    }
  }
  handleBlurPhNo = (e) => {
    const valueStr = e.target.value.trim();
    if (valueStr === '' || valueStr === undefined) {
      this.setState({isPh: 'error', isPhInfo: '手机号不能为空', disabled: true});
    } else {
      uniquePhoneNo(valueStr)
        .then((response) => {
          if (response.status === 'error') {
            this.setState({isPh: 'error', isPhInfo: '手机号重复', disabled: true});
          } else {
            this.setState({isPh: 'success', isPhInfo: '', disabled: false});
          }
        });
    }
  }
  handleBlurIdNo = (e) => {
    const valueStr = e.target.value.trim();
    if (valueStr === '' || valueStr === undefined) {
      this.setState({isId: ''});
    } else {
      uniqueId(valueStr)
        .then((response) => {
          if (response.status === 'error') {
            this.setState({isId: 'error', isIdInfo: '身份证号重复', disabled: true});
          } else {
            this.setState({isId: 'success', isIdInfo: '', disabled: false});
          }
        });
    }
  }
  handleSearch = (e) => {
    this.setState({visible: true});
    const {value} = e.target;
    this.props.dispatch({
      type: 'invite/sortInviter',
      payload: value.trim(),
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const fileInfo = this.state.fileList[0];
    const {qualificationNo, synthesizeNo, technicalerNo, inviter} = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let body = {};
        if (!isEmpty(fileInfo)) {
          body = {
            ...inviter,
            ...values,
            zid: this.props.location.id,
            docNo: fileInfo.fileId,
            title: fileInfo.name,
            technicalerNo,
            qualificationNo,
            synthesizeNo,
          };
        } else {
          body = {
            ...inviter,
            ...values,
            zid: this.props.location.id,
            technicalerNo,
            qualificationNo,
            synthesizeNo,
          };
        }
        this.props.dispatch({
          type: 'invite/saveInviter',
          payload: body,
        });
      } else {
        return null;
      }
    });
  }
  handleEmailChange = (value) => {
    this.setState({
      dataEmailSource: !value || value.indexOf('@') >= 0 ? [] : [
        `${value}@gmail.com`,
        `${value}@163.com`,
        `${value}@qq.com`,
        `${value}@surgnova.com`,
      ],
    });
  };
  renderUpload = () => {
    const props = {
      action: UPLOAD_FILE,
      onChange: this.handleFileInfoChange,
      showUploadList: true,
      headers: {
        authorization: 'authorization-text',
      },
    };
    return (
      <div >
        <Upload {...props} fileList={this.state.fileList}>
          <Button style={{width: '200px'}}>
            <Icon type="upload"/> 上传文档
          </Button>
        </Upload>
      </div>
    );
  };
  render() {
    const {inviter} = this.state;
    // console.log('inviter: ', inviter.name);
    const {getFieldDecorator} = this.props.form;
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
        {this.layoutModal()}
        <Row>
          <Col span={8}>
            <Tooltip title="点击返回上一页面" arrowPointAtCenter><a style={{float: 'left'}} onClick={this.backHistory}><Icon type="backward" /></a></Tooltip>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="姓名"
            >
              {getFieldDecorator('name', {
                rules: [{required: true, message: '请输入姓名！'}],
                initialValue: inviter.name,
              })(
                <Input style={{width: '200px'}} autoComplete="off"/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="手机号码"
              hasFeedback
              validateStatus={this.state.isPh}
              help={this.state.isPhInfo}
            >
              {getFieldDecorator('phoneNo', {
                rules: [{required: true, message: '请输入手机号！'}],
                initialValue: inviter.phoneNo,
              })(
                <Input
                  style={{width: '200px'}}
                  onBlur={this.handleBlurPhNo}
                />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="邮箱"
            >
              {getFieldDecorator('email', {
                rules: [{required: false, message: '请输入邮箱！'}, {type: 'email', message: '邮箱格式不正确'}],
                initialValue: inviter.email,
              })(
                <AutoComplete
                  dataSource={this.state.dataEmailSource}
                  style={{ width: 200 }}
                  onChange={this.handleEmailChange}
                  placeholder="Email"
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="招聘需求编号"
              hasFeedback
              validateStatus={this.state.isHc}
              help={this.state.isHcInfo}
            >
              {getFieldDecorator('hcCode', {
                rules: [{required: true, message: '请输入招聘需求编号！'}],
                initialValue: inviter.hcCode,
              })(
                <Search
                  onPressEnter={this.handleSearch}
                  onBlur={this.handleBlurHc}
                />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="身份证"
              hasFeedback
              validateStatus={this.state.isId}
              help={this.state.isIdInfo}
            >
              {getFieldDecorator('idNo', {
                rules: [{required: false, message: '请输入身份证号码！'}],
                initialValue: inviter.idNo,
              })(
                <Input
                  style={{width: 200}}
                  onBlur={this.handleBlurIdNo}
                />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="候选人来源"
            >
              {getFieldDecorator('source', {
                initialValue: inviter.source,
              })(
                <Select
                  showSearch
                  style={{ width: 200}}
                >
                  {INVITE_SOURCE.map((it, i) => {
                    return <Option value={it} key={i}>{it}</Option>;
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="来源信息备注"
            >
              {getFieldDecorator('sourceMarks', {
                initialValue: inviter.sourceMarks,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="最高学历"
            >
              {getFieldDecorator('bastEducation', {
                initialValue: inviter.bastEducation,
              })(
                <Select
                  showSearch
                  style={{ width: 200}}
                >
                  {INVITEREDUCATION.map((it, i) => {
                    return <Option value={it} key={i}>{it}</Option>;
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="当前状态"
            >
              {getFieldDecorator('nowStatus', {
                rules: [{required: true, message: '请选择候选人当前状态'}],
                initialValue: inviter.nowStatus,
              })(
                <Select
                  style={{ width: 200 }}
                >
                  {INVITE_STATUS.map((it) => {
                    return <Option value={it} key={Date.parse(new Date())}>{it}</Option>;
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="出生日期"
            >
              {getFieldDecorator('birth', {
                initialValue: inviter.birth,
              })(
                <DatePicker style={{width: 200}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="性别"
            >
              {getFieldDecorator('sex', {
                initialValue: inviter.sex,
              })(
                <Select style={{width: 200}}>
                  <Option value="男" key="男">男</Option>
                  <Option value="女" key="女">女</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="工龄"
            >
              {getFieldDecorator('jobAge', {
                initialValue: inviter.jobAge,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="婚姻状况"
            >
              {getFieldDecorator('maritalStatus', {
                initialValue: inviter.maritalStatus,
              })(
                <Select style={{width: 200}}>
                  <Option value="已婚">已婚</Option>
                  <Option value="未婚">未婚</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="户口所在地"
            >
              {getFieldDecorator('comeFrom', {
                initialValue: inviter.comeFrom,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="居住地地址"
            >
              {getFieldDecorator('address', {
                initialValue: inviter.address,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="工作单位1"
            >
              {getFieldDecorator('company1', {
                initialValue: inviter.company1,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="任职起止时间1"
            >
              {getFieldDecorator('jobDate1', {
                initialValue: inviter.jobDate1,
              })(
                <Input style={{width: '200px'}} placeholder="xxxx年xx月—xxxx年xx月"/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="岗位1"
            >
              {getFieldDecorator('station1', {
                initialValue: inviter.station1,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="工作单位2"
            >
              {getFieldDecorator('company2', {
                initialValue: inviter.company2,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="任职起止时间2"
            >
              {getFieldDecorator('jobDate2', {
                initialValue: inviter.jobDate2,
              })(
                <Input style={{width: '200px'}} placeholder="xxxx年xx月—xxxx年xx月"/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="岗位2"
            >
              {getFieldDecorator('station2', {
                initialValue: inviter.station2,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="工作单位3"
            >
              {getFieldDecorator('company3', {
                initialValue: inviter.company3,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="任职起止时间3"
            >
              {getFieldDecorator('jobDate3', {
                initialValue: inviter.jobDate3,
              })(
                <Input style={{width: '200px'}} placeholder="xxxx年xx月—xxxx年xx月"/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="岗位3"
            >
              {getFieldDecorator('station3', {
                initialValue: inviter.station3,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="毕业学校1"
            >
              {getFieldDecorator('graduation1', {
                initialValue: inviter.graduation1,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="就读起止时间1"
            >
              {getFieldDecorator('graduationDate1', {
                initialValue: inviter.graduationDate1,
              })(
                <Input style={{width: '200px'}} placeholder="xxxx年xx月—xxxx年xx月"/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="专业1"
            >
              {getFieldDecorator('major1', {
                initialValue: inviter.major1,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="毕业学校2"
            >
              {getFieldDecorator('graduation2', {
                initialValue: inviter.graduation2,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="就读起止时间2"
            >
              {getFieldDecorator('graduationDate2', {
                initialValue: inviter.graduationDate2,
              })(
                <Input style={{width: '200px'}} placeholder="xxxx年xx月—xxxx年xx月"/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="专业2"
            >
              {getFieldDecorator('major2', {
                initialValue: inviter.major2,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="毕业学校3"
            >
              {getFieldDecorator('graduation3', {
                initialValue: inviter.graduation3,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="就读起止时间3"
            >
              {getFieldDecorator('graduationDate3', {
                initialValue: inviter.graduationDate3,
              })(
                <Input style={{width: '200px'}} placeholder="xxxx年xx月—xxxx年xx月"/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="专业3"
            >
              {getFieldDecorator('major3', {
                initialValue: inviter.major3,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="技术面试官"
            >
              {getFieldDecorator('technicalerName', {
                initialValue: inviter.technicalerName,
              })(
                // <AutoComplete
                //   dataSource={this.state.nameSourceTech}
                //   style={{ width: 200 }}
                //   onChange={this.handleChangeTech}
                //   onSelect={this.handleSelectTech}
                //   placeholder="技术面试官姓名"
                // />
                <Input disabled/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="资格面试官"
            >
              {getFieldDecorator('qualificationName', {
                initialValue: inviter.qualificationName,
              })(
                // <AutoComplete
                //   dataSource={this.state.nameSourceQual}
                //   style={{ width: 200 }}
                //   onChange={this.handleChangeQual}
                //   onSelect={this.handleSelectQual}
                //   placeholder="资格面试官姓名"
                // />
                <Input disabled/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="综合面试官"
            >
              {getFieldDecorator('synthesizeName', {
                initialValue: inviter.synthesizeName,
              })(
                <Input disabled/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="技术面试时间"
            >
              {getFieldDecorator('technicalerDate', {
                initialValue: inviter.technicalerDate,
              })(
                <DatePicker style={{width: 200}} format="YYYY-MM-DD HH:mm:ss" showTime/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="资格面试时间"
            >
              {getFieldDecorator('qualificationDate', {
                initialValue: inviter.qualificationDate,
              })(
                <DatePicker style={{width: 200}} format="YYYY-MM-DD HH:mm:ss" showTime/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="综合面试时间"
            >
              {getFieldDecorator('synthesizeDate', {
                initialValue: inviter.synthesizeDate,
              })(
                <DatePicker style={{width: 200}} format="YYYY-MM-DD HH:mm:ss" showTime/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row >
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="部门接口人"
            >
              {getFieldDecorator('departmentInterface', {
                initialValue: inviter.departmentInterface,
              })(
                <AutoComplete
                  dataSource={this.state.nameSourceSta}
                  style={{ width: 200 }}
                  onChange={this.handleChangeSta}
                  placeholder="部门接口人姓名"
                />
              )}
            </FormItem>
          </Col>
          <Col span={8} >
            <FormItem
              {...formItemLayout}
              label="推荐岗位"
            >
              {getFieldDecorator('recommendJobs', {
                initialValue: inviter.recommendJobs,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{height: '64px'}}>
            <FormItem
              {...formItemLayout}
              label="上传附件"
            >
              {this.renderUpload()}
            </FormItem>
          </Col>
        </Row>
        <Col span={8}>
          <FormItem {...submitFormLayout}>
            <Button
              style={{width: '200px'}}
              type="primary"
              htmlType="submit"
              disabled={this.state.disabled}
            >
              提交
            </Button>
          </FormItem>
        </Col>
        <Col span={8}></Col>
        <Col span={8}>
          <FormItem {...submitFormLayout}>
            <Button
              onClick={() => this.props.history.goBack()}
              style={{width: '200px'}}
              type="primary"
            >
              返回
            </Button>
          </FormItem>
        </Col>
      </Form>
    );
  }
}
export default connect(state => ({
  invite: state.invite,
}))(Form.create({})(AddInvite));
