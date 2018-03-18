import React from 'react';
import {
  connect,
} from 'dva';
import {
  Button,
  DatePicker,
  Form,
  Input,
  notification,
  Select,
  Row,
  Col,
  AutoComplete,
  Icon,
} from 'antd';
import moment from 'moment';
import { isEmpty } from 'lodash';
import {
  queryUserInfo,
  findDepartmentY,
  findDepartmentE,
  findDepartmentS,
  queryLike,
} from '../../../services/api';


const FormItem = Form.Item;
const {
  Option,
} = Select;

function hasErrors(fieldsError) { // 判断是否有错误
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class UserAdd extends React.Component {
  state = {
    user: {},
    dataSource: [],
    departT: [],
    departO: [],
    departOName: '',
    departS: [],
  };

  componentDidMount() {
    // To disabled submit button at the beginning.
    // this.props.form.validateFields();
    this.fetchData(this.props.location.id); // 编辑的时候，自动获取数据
    this.fetchDepartment();
  }
  fetchDepartment = () => {
    findDepartmentY()
      .then((res) => {
        this.setState({departO: res});
      });
  }
  fetchData = (id) => {
    if (!isEmpty(id)) {
      queryUserInfo(id)
        .then((data) => {
          this.setState({
            user: {
              ...data,
              entryDate: data.entryDate ? moment(data.entryDate) : null,
              confirmDate: data.confirmDate ? moment(data.confirmDate) : null,
              birthday: data.birthday ? moment(data.birthday) : null,
              resignDate: data.resignDate ? moment(data.resignDate) : null,
              role: data.role.split(','),
            },
          });
        });
    }
  };
  handleSubmit = (e) => {
    const {user} = this.state;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const role = values.role.join(',');
        const data = {
          ...values,
          role,
          reId: '' ? '' : user.reId,
        };
        this.props.dispatch({
          type: 'user/saveUser',
          payload: data,
        });
      } else {
        notification.error({
          message: '请求错误 error',
        });
      }
    });
  };
  handleChange = (value) => {
    this.setState({
      dataSource: !value || value.indexOf('@') >= 0 ? [] : [
        `${value}@gmail.com`,
        `${value}@163.com`,
        `${value}@qq.com`,
        `${value}@surgnova.com`,
      ],
    });
  };
  handleChangeO = (e) => {
    this.props.form.setFieldsValue({
      secondDepartment: '',
    });
    this.setState({departOName: e});
    findDepartmentE(e)
      .then((res) => {
        this.setState({departT: res});
      });
  }
  handleChangeT = (e) => {
    this.props.form.setFieldsValue({
      thirdDepartment: '',
    });
    const bodyStr = `${this.state.departOName},${e}`;
    findDepartmentS(bodyStr)
      .then((res) => {
        this.setState({departS: res});
      });
  }
  directorChange = (e) => {
    const name = e.target.value.trim();
    queryLike(name)
      .then((res) => {
        res.map((it) => {
          if (it.name === name) {
            this.props.form.setFieldsValue({
              directorNumber: it.employeeNumber,
            });
          }
        });
      })
  }
  mentorChange = (e) => {
    const name = e.target.value.trim();
    queryLike(name)
      .then((res) => {
        res.map((it) => {
          if (it.name === name) {
            this.props.form.setFieldsValue({
              mentorNumber: it.employeeNumber,
            });
          }
        });
      });
  }
  render() {
    const SelectOption = Select.Option;
    const {
      getFieldDecorator,
      getFieldsError,
    } = this.props.form;
    const {
      user,
    } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 7,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 12,
        },
        md: {
          span: 10,
        },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 10,
          offset: 7,
        },
      },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="姓名"
            >
              {getFieldDecorator('name', {
                rules: [{required: true, message: '请输入姓名！'}],
                initialValue: user.name,
              })(
                <Input style={{width: '200px'}}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="工号"
            >
              {getFieldDecorator('employeeNumber', {
                initialValue: user.employeeNumber,
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} style={{width: 200}} disabled/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="密码"
            >
              {getFieldDecorator('password', {
                rules: [{required: true, message: '请输入密码！'}],
                initialValue: user.password,
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} style={{width: 200}} placeholder="Password"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="角色"
            >
              {getFieldDecorator('role', {
                rules: [{required: true, message: '请输入角色！'}],
                initialValue: user.role,
              })(
                <Select
                  placeholder="请选择角色"
                  style={{width: 200}}
                  mode="multiple"
                  maxTagCount={1}
                >
                  <Option value="general">普通用户</Option>
                  <Option value="admin">系统管理员</Option>
                  <Option value="hr_recruit">人力资源-招聘</Option>
                  <Option value="hr_study">人力资源-学发</Option>
                  <Option value="assetManager">资产管理员</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="工作地"
            >
              {getFieldDecorator('workPlace', {
                initialValue: user.workPlace,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="岗位"
            >
              {getFieldDecorator('station', {
                initialValue: user.station,
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
              label="职级"
            >
              {getFieldDecorator('grade', {
                initialValue: user.grade,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="入职日期"
            >
              {getFieldDecorator('entryDate', {
                initialValue: user.entryDate,
              })(
                <DatePicker style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="转正日期"
            >
              {getFieldDecorator('confirmDate', {
                initialValue: user.confirmDate,
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
              {getFieldDecorator('firstDepartment', {
                initialValue: user.firstDepartment,
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
              {getFieldDecorator('secondDepartment', {
                initialValue: user.secondDepartment,
              })(
                <Select
                  style={{ width: 200}}
                  onChange={this.handleChangeT}
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
              label="三级部门"
            >
              {getFieldDecorator('thirdDepartment', {
                initialValue: user.thirdDepartment,
              })(
                <Select
                  style={{ width: 200}}
                  onChange={this.handleChangeT}
                >
                  {this.state.departS.map((it, i) => {
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
              label="最小部门"
            >
              {getFieldDecorator('forthDepartment', {
                initialValue: user.forthDepartment,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="直接主管工号"
            >
              {getFieldDecorator('directorNumber', {
                initialValue: user.directorNumber,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="直接主管姓名"
            >
              {getFieldDecorator('directorName', {
                initialValue: user.directorName,
              })(
                <Input style={{width: '200px'}} onChange={this.directorChange}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="思想导师工号"
            >
              {getFieldDecorator('mentorNumber', {
                initialValue: user.mentorNumber,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="思想导师姓名"
            >
              {getFieldDecorator('mentorName', {
                initialValue: user.mentorName,
              })(
                <Input style={{width: '200px'}} onChange={this.mentorChange}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="性别"
            >
              {getFieldDecorator('sex', {
                initialValue: user.sex,
              })(
                <Select
                  showSearch
                  style={{width: '200px'}}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children
                    .toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <SelectOption value="男">男</SelectOption>
                  <SelectOption value="女">女</SelectOption>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="民族"
            >
              {getFieldDecorator('nation', {
                initialValue: user.nation,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="出生日期"
            >
              {getFieldDecorator('birthday', {
                initialValue: user.birthday,
              })(
                <DatePicker style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="身份证号"
            >
              {getFieldDecorator('cardId', {
                initialValue: user.cardId,
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
              label="婚否"
            >
              {getFieldDecorator('marriage', {
                initialValue: user.marriage,
              })(
                <Select
                  showSearch
                  style={{width: '200px'}}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children
                    .toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <SelectOption value="已婚">已婚</SelectOption>
                  <SelectOption value="未婚">未婚</SelectOption>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="电话号码"
            >
              {getFieldDecorator('phoneNumber', {
                initialValue: user.phoneNumber,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="电子邮箱"
            >
              {getFieldDecorator('email', {
                rules: [{required: true, message: '请输入邮箱！'}, {type: 'email', message: '邮箱格式错误'}],
                initialValue: user.email,
              })(
                <AutoComplete
                  dataSource={this.state.dataSource}
                  style={{ width: 200 }}
                  onChange={this.handleChange}
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
              label="备用电子邮箱"
            >
              {getFieldDecorator('secEmail', {
                initialValue: user.secEmail,
              })(
                <Input style={{width: '200px'}}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="紧急联系人"
            >
              {getFieldDecorator('emergencyContact', {
                initialValue: user.emergencyContact,
              })(
                <Input style={{width: '200px'}}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="紧急联系人电话号码"
            >
              {getFieldDecorator('emergencyNumber', {
                initialValue: user.emergencyNumber,
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
              label="户口性质"
            >
              {getFieldDecorator('householdType', {
                initialValue: user.householdType,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="户口所在地"
            >
              {getFieldDecorator('householdPlace', {
                initialValue: user.householdPlace,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="地址"
            >
              {getFieldDecorator('address', {
                initialValue: user.address,
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
              label="社保所在地"
            >
              {getFieldDecorator('socialSecurityPlace', {
                initialValue: user.socialSecurityPlace,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="招聘类型"
            >
              {getFieldDecorator('recruitmentType', {
                initialValue: user.recruitmentType,
              })(
                <Select
                  showSearch
                  style={{width: '200px'}}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children
                    .toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <SelectOption value="校招">校招</SelectOption>
                  <SelectOption value="社招">社招</SelectOption>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="信息来源"
            >
              {getFieldDecorator('recruitmentSource', {
                initialValue: user.recruitmentSource,
              })(
                <Select
                  showSearch
                  style={{width: '200px'}}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children
                    .toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <SelectOption value="内部推荐">内部推荐</SelectOption>
                  <SelectOption value="猎头推荐">猎头推荐</SelectOption>
                  <SelectOption value="招聘网站">招聘网站</SelectOption>
                  <SelectOption value="其他">其他</SelectOption>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="内部推荐人"
            >
              {getFieldDecorator('referrer', {
                initialValue: user.referrer,
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
              {getFieldDecorator('highestEducation', {
                initialValue: user.highestEducation,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="最高学历是否统招"
            >
              {getFieldDecorator('highestEducationType', {
                initialValue: user.highestEducationType,
              })(
                <Select
                  showSearch
                  style={{width: '200px'}}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children
                    .toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <SelectOption value="是">是</SelectOption>
                  <SelectOption value="否">否</SelectOption>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="最高学历学习方式"
            >
              {getFieldDecorator('highestEducationStudyType', {
                initialValue: user.highestEducationStudyType,
              })(
                <Select
                  showSearch
                  style={{width: '200px'}}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children
                    .toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <SelectOption value="全日制">全日制</SelectOption>
                  <SelectOption value="非全日制">非全日制</SelectOption>
                  <SelectOption value="辅修">辅修</SelectOption>
                  <SelectOption value="在职">在职</SelectOption>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="雇佣关系"
            >
              {getFieldDecorator('employmentType', {
                initialValue: user.employeeStatus,
              })(
                <Select
                  showSearch
                  style={{width: '200px'}}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children
                    .toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <SelectOption value="全职">全职</SelectOption>
                  <SelectOption value="实习生">实习</SelectOption>
                  <SelectOption value="兼职">兼职</SelectOption>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="离职日期"
            >
              {getFieldDecorator('resignDate', {
                initialValue: user.resignDate,
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
              label="离职类型"
            >
              {getFieldDecorator('resignType', {
                initialValue: user.resignType,
              })(
                <Select
                  showSearch
                  style={{width: '200px'}}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children
                    .toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <SelectOption value="主动离职">主动离职</SelectOption>
                  <SelectOption value="被动离职">被动离职</SelectOption>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="个人反馈离职原因"
            >
              {getFieldDecorator('resignReasonFromSelf', {
                initialValue: user.resignReasonFromSelf,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="主管获取离职原因"
            >
              {getFieldDecorator('resignReasonFromDirector', {
                initialValue: user.resignReasonFromDirector,
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
              label="HR获取离职原因"
            >
              {getFieldDecorator('resignReasonFromHR', {
                initialValue: user.resignReasonFromHR,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="发薪账号"
            >
              {getFieldDecorator('payrollAccount', {
                initialValue: user.payrollAccount,
              })(
                <Input style={{width: '200px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="当前状态"
            >
              {getFieldDecorator('employeeStatus', {
                initialValue: user.basicSalary,
              })(
                <Select
                  style={{width: '200px'}}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children
                    .toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <SelectOption value="试用中">试用中</SelectOption>
                  <SelectOption value="已转正">已转正</SelectOption>
                  <SelectOption value="已离职">已离职</SelectOption>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem {...submitFormLayout}>
              <Button
                style={{width: '200px'}}
                type="primary"
                htmlType="submit"
                disabled={hasErrors(getFieldsError())}
              >
                提交
              </Button>
            </FormItem>
          </Col>
          <Col span={8}>{}</Col>
          <Col span={8}>
            <FormItem {...submitFormLayout}>
              <Button
                style={{width: '200px'}}
                type="primary"
                onClick={() => this.props.history.goBack()}
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

export default connect()(Form.create({})(UserAdd));
