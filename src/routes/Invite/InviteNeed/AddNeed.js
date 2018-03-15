import React from 'react';
import {isEmpty} from 'lodash';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import moment from 'moment';
import { Form, Input, Button, Select, DatePicker, Row, Col, notification, AutoComplete, InputNumber} from 'antd';
import {queryLike, findNeedByIdInviter, findDepartmentY, findDepartmentE} from '../../../services/api';
import {INVITE_PRIORITY, INVITE_NR, INVITE_STATIONSTATUS, INVITE_CATEGARY, INVITE_SECONDARYSECTOR, INVITE_TERTIARY} from '../../../common/constants';
// import {departMatch} from '../../../utils/defaultData';

const FormItem = Form.Item;
const {Option} = Select;
const { TextArea } = Input;
let needsValue = '';

function hasErrors(fieldsError) { // 判断是否有错误
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class AddNeed extends React.Component {
  state = {
    inviter: {},
    nameSourceDemp: [],
    departO: [],
    departT: [],
  };

  componentDidMount() {
    if (this.props.location.body) {
      this.fetchData(this.props.location.body.id);
    }
    this.needsValue = this.props.location.needsValue;
    this.fetchDepartment();
  }

  fetchData = (id) => {
    if (!isEmpty(id)) {
      findNeedByIdInviter(id)
        .then((response) => {
          this.setState({
            inviter: {
              ...response,
              hcDate: response.hcDate ? moment(response.hcDate) : null,
              hireDate: response.hireDate ? moment(response.hireDate) : null,
              entryDate: response.entryDate ? moment(response.entryDate) : null,
            },
          });
        });
    }
  }
  fetchDepartment = () => {
    findDepartmentY()
      .then((res) => {
        this.setState({departO: res});
      });
  }
  handleChangedDemp = (value) => { // AutoComplete组件数据发生改变时调用
    if (value === '') {
      this.setState({nameSourceDemp: []});
    } else {
      queryLike(value)
        .then((response) => {
          const temp = [];
          response.map((item) => {
            temp.push(item.name);
          });
          this.setState({
            nameSourceDemp: [...temp],
          });
        });
    }
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {body} = this.props.location;
        if (!isEmpty(body)) {
          values.nid = body.id;
          values.hcNo = body.hcNo;
        }
        this.props.dispatch({
          type: 'invite/saveNeedInviter',
          payload: values,
          needsValue: '',
        });
      } else {
        notification.error({
          message: '请求错误 error',
        });
      }
    });
  }
  handleChangeO = (e) => {
    this.props.form.setFieldsValue({
      sdepartment: '',
    });
    findDepartmentE(e)
      .then((res) => {
        this.setState({departT: res});
      });
  }

  // 返回上一页
  backHistory = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/tabs/invite/invite-need',
      needsValue: this.needsValue,
    }));
  }
  render() {
    const {inviter} = this.state;
    const {getFieldDecorator, getFieldsError} = this.props.form;
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
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="新增/替换"
            >
              {getFieldDecorator('nor', {
                initialValue: inviter.nor,
              })(
                <Select style={{width: 200}}>
                  {INVITE_NR.map((it, i) => {
                    return <Option value={it} key={i}>{it}</Option>;
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="职位状态"
            >
              {getFieldDecorator('postStatus', {
                initialValue: inviter.postStatus,
              })(
                <Select style={{width: 200}}>
                  {INVITE_STATIONSTATUS.map((it, i) => {
                    return <Option value={it} key={i}>{it}</Option>;
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="招聘需求有效期"
            >
              {getFieldDecorator('hcDate', {
                initialValue: inviter.hcDate,
              })(
                <DatePicker style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="一级部门"
            >
              {getFieldDecorator('odepartment', {
                rules: [{required: true, message: '请输入一级部门！'}],
                initialValue: inviter.odepartment,
              })(
                <Select
                  style={{ width: 200}}
                  onChange={this.handleChangeO}
                >
                  {this.state.departO.map((it, i) => {
                    return <Option value={it} key={i}>{it}</Option>;
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="二级部门"
            >
              {getFieldDecorator('sdepartment', {
                rules: [{required: true, message: '请输入二级部门！'}],
                initialValue: inviter.sdepartment,
              })(
                <Select
                  style={{ width: 200}}
                >
                  {this.state.departT.map((it, i) => {
                    return <Option value={it} key={i}>{it}</Option>;
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="最小部门"
            >
              {getFieldDecorator('mdepartment', {
                rules: [{required: false, message: '请输入最小部门！'}],
                initialValue: inviter.mdepartment,
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
              label="岗位职级"
            >
              {getFieldDecorator('rank', {
                rules: [{required: true, message: '请输入岗位职级！'}],
                initialValue: inviter.rank,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="岗位类别"
            >
              {getFieldDecorator('pstyle', {
                rules: [{required: true, message: '请输入岗位类别！'}],
                initialValue: inviter.pstyle,
              })(
                <Select
                  showSearch
                  style={{ width: 200 }}
                >
                  {INVITE_CATEGARY.map((it, i) => {
                    return <Option value={it} key={i}>{it}</Option>;
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="岗位名称"
            >
              {getFieldDecorator('pname', {
                rules: [{required: true, message: '请输入岗位名称！'}],
                initialValue: inviter.pname,
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
              label="岗位职责"
            >
              {
                getFieldDecorator('preposotpry', {
                  initialValue: inviter.preposotpry,
                })(
                  <TextArea rows={1} />
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="任职要求"
            >
              {
                getFieldDecorator('jobRequire', {
                  initialValue: inviter.jobRequire,
                })(
                  <TextArea rows={1} />
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="招聘数量"
            >
              {getFieldDecorator('mount', {
                rules: [{required: true, message: '请输入数字！'}],
                initialValue: inviter.mount,
              })(
                <InputNumber style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="族"
            >
              {getFieldDecorator('clan', {
                initialValue: inviter.clan,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="类"
            >
              {getFieldDecorator('clas', {
                initialValue: inviter.clas,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="子类"
            >
              {getFieldDecorator('sclas', {
                initialValue: inviter.sclas,
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
              label="级别"
            >
              {getFieldDecorator('level', {
                initialValue: inviter.level,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="招聘方式"
            >
              {getFieldDecorator('recruitmentMethod', {
                initialValue: inviter.recruitmentMethod,
              })(
                <Input style={{width: 200}}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="部门责任人/接口人"
            >
              {getFieldDecorator('departmerntPerson', {
                initialValue: inviter.departmerntPerson,
              })(
                <AutoComplete
                  dataSource={this.state.nameSourceDemp}
                  style={{ width: 200 }}
                  onChange={this.handleChangedDemp}
                  placeholder="部门责任人"
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="最迟到位时间目标"
            >
              {getFieldDecorator('lastDate', {
                initialValue: moment(inviter.lastDate),
              })(
                <DatePicker style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="寻源信息"
            >
              {getFieldDecorator('findInfo', {
                initialValue: inviter.findInfo,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="优先级"
            >
              {getFieldDecorator('priorty', {
                initialValue: inviter.priorty,
              })(
                <Select style={{width: 200}}>
                  {INVITE_PRIORITY.map((it, i) => {
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
              label="备注"
            >
              {getFieldDecorator('markes', {
                initialValue: inviter.markes,
              })(
                <TextArea rows={1} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...submitFormLayout}>
              <Button
                onClick={this.handleSubmit}
                style={{width: '200px'}}
                type="primary"
                htmlType="submit"
                disabled={hasErrors(getFieldsError())}
              >
                提交
              </Button>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...submitFormLayout}>
              <Button
                onClick={this.backHistory}
                style={{width: '200px'}}
                type="primary"
                disabled={hasErrors(getFieldsError())}
              >
                返回
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
export default connect(state => ({
  invite: state.invite,
}))(Form.create({})(AddNeed));
