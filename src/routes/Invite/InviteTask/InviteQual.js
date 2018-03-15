import React from 'react';
import moment from 'moment';
import {
  Form,
  Button,
  Input,
  Radio,
  Checkbox,
  message,
  DatePicker,
  AutoComplete,
  Upload,
  Icon,
  Modal,
} from 'antd';
import {routerRedux} from 'dva/router';
import {isEmpty} from 'lodash';
import {connect} from 'dva';
import {getDownloadUrlByDocId} from '../../../utils/utils';
import {UPLOAD_FILE} from '../../../common/constants';
import {
  queryLike,
  findQualInfo,
} from '../../../services/api';
import styles from './InviteQual.less';
import {isAdmin, isHr} from '../../../utils/authority';

const {TextArea} = Input;
const FormItem = Form.Item;
const {confirm} = Modal;
const RadioGroup = Radio.Group;

@connect(state => ({
  invite: state.invite,
}))
class InviteTech extends React.Component {
  state = {
    qualInfo: {},
    qualNumber: '',
    nameSource: [],
    disabled: false,
    fileList: [],
  }
  componentDidMount() {
    const {body} = this.props.location;
    if (!isEmpty(body)) {
      this.fetchData(body.qualificationInterview);
    }
  }
  fetchData = (id) => {
    const {body} = this.props.location;
    if (isEmpty(body.qualificationInterview)) {
      this.setState({qualInfo: body});
    } else {
      findQualInfo(id)
        .then((response) => {
          this.readOnly(response);
          if (response.papersVaildate1) {
            const papersVaildate1 = response.papersVaildate1.split(',');
            response.papersVaildate1 = papersVaildate1;
          }
          if (response.docNo != null) {
            const files = [{
              uid: 1,
              name: response.title,
              status: 'done',
              url: getDownloadUrlByDocId(response.docNo),
            }];
            this.setState({fileList: files, qualInfo: response});
          } else {
            this.setState({qualInfo: response});
          }
        });
    }
  }
  toBack = () => {
    const {qualInfo} = this.state;
    this.props.dispatch(routerRedux.push({
      pathname: '/tabs/invite/invite-center',
      id: qualInfo.zid,
    }));
  }
  readOnly = (data) => {
    if (!isEmpty(data)) {
      if (!isHr() && !isAdmin()) {
        this.setState({disabled: true});
      }
    }
  }
  changData = (value) => {
    return value.split(',');
  }
  handleFileInfoChange = (info) => {
    let {fileList} = info;
    // console.log('info: ', info);
    // 1. Limit the number of uploaded files
    //    Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-1);

    // 2. read from response and show file link
    fileList = fileList.map((it) => {
      const fileInfo = {...it};
      if (fileInfo.response && fileInfo.response.id) {
        // Component will show file.url as link
        fileInfo.url = getDownloadUrlByDocId(fileInfo.response.id);
        fileInfo.name = fileInfo.response.fileName;
        fileInfo.fileId = fileInfo.response.id;
      }
      return fileInfo;
    });

    this.setState({fileList});
  };
  handleChange = (value) => { // AutoComplete组件数据发生改变时调用
    this.setState({ nameSource: [] });
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
              nameSource: [...temp],
            });
          }
        });
    }
  };
  handleSelete = (value) => {
    queryLike(value)
      .then((response) => {
        response.map((item) => {
          this.setState({qualNumber: item.employeeNumber});
        });
      });
  };
  handleSubmit = () => {
    const {qualInfo, qualNumber} = this.state;
    const fileInfo = this.state.fileList[0];
    this.props.form.validateFields((err, values) => {
      console.log('values.papersVaildate1', values.papersVaildate1);
      let papersVaildate1 = '';
      if (values.papersVaildate1 !== undefined) {
        papersVaildate1 = values.papersVaildate1.join(',');
      }
      if (!err) {
        const object = {
          title: '确定要提交吗？',
          okText: '确定',
          cancelText: '取消',
          onCancel() {
            console.log('Cancel');
          },
        };
        object.onOk = () => {
          // this.handleSubmit();
          let postData = {};
          if (fileInfo) {
            postData = {
              ...qualInfo,
              ...values,
              papersVaildate1,
              docNo: fileInfo.fileId,
              title: fileInfo.name,
              qualificationEmpNo: qualNumber,
            };
          } else {
            postData = {
              ...qualInfo,
              ...values,
              papersVaildate1,
              qualificationEmpNo: qualNumber,
            };
          }
          this.props.dispatch({
            type: 'invite/saveQual',
            payload: postData,
          });
        };
        confirm(object);
      } else {
        message.error('保存失败...');
      }
    });
  };
  DraftSubmit = () => {
    const {qualInfo, qualNumber} = this.state;
    const fileInfo = this.state.fileList[0];
    this.props.form.validateFields((err, values) => {
      console.log('values.papersVaildate1', values);
      let papersVaildate1 = '';
      if (values.papersVaildate1 !== undefined) {
        papersVaildate1 = values.papersVaildate1.join(',');
      }
      if (!err) {
        const object = {
          title: '确定要保存为草稿吗吗？',
          okText: '确定',
          cancelText: '取消',
          onCancel() {
            console.log('Cancel');
          },
        };
        object.onOk = () => {
          // this.handleSubmit();
          let postData = {};
          if (fileInfo) {
            postData = {
              ...qualInfo,
              ...values,
              papersVaildate1,
              docNo: fileInfo.fileId,
              title: fileInfo.name,
              qualificationEmpNo: qualNumber,
            };
          } else {
            postData = {
              ...qualInfo,
              ...values,
              papersVaildate1,
              qualificationEmpNo: qualNumber,
            };
          }
          this.props.dispatch({
            type: 'invite/saveQualDraft',
            payload: postData,
          });
        };
        confirm(object);
      } else {
        message.error('保存失败...');
      }
    });
  };

  showConfirm = () => {
    const object = {
      title: '确定要提交吗？',
      okText: '确定',
      cancelText: '取消',
      onCancel() {
        console.log('Cancel');
      },
    };
    object.onOk = () => {
      this.handleSubmit();
    };
    confirm(object);
  }
  renderButton = () => {
    const {disabled} = this.state;
    if (disabled) {
      return (
        <Button
          type="primary"
          style={{width: 250, marginLeft: '40%', marginTop: 10}}
          onClick={() => { this.toBack(); }}
        >
        返回
        </Button>
      );
    } else {
      return (
        <div style={{width: '360px', margin: '0 auto'}}>
          <Button
            type="primary"
            // htmlType="submit"
            onClick={this.handleSubmit}
            style={{width: 110, marginTop: 25}}
          > 提交面试信息
          </Button>
          <Button
            type="primary"
            style={{width: 100, marginLeft: 25}}
            onClick={this.DraftSubmit}
          >
            保存为草稿
          </Button>
          <Button
            type="primary"
            style={{width: 100, marginLeft: 25}}
            onClick={() => { this.toBack(); }}
          >
            返回
          </Button>
        </div>
      );
    }
  }
  renderUpload = () => {
    const {disabled} = this.state;
    const props = {
      action: UPLOAD_FILE,
      onChange: this.handleFileInfoChange,
      headers: {
        authorization: 'authorization-text',
      },
      showUploadList: { showPreviewIcon: true, showRemoveIcon: !disabled },
    };
    return (
      <div className={styles.uploadContainer}>
        <h2 className={styles.title}>资格面试考核表</h2>
        <div style={{float: 'right'}}>
          <Upload {...props} fileList={this.state.fileList} >
            <Button
              style={{width: '180px', border: '1px solid #000'}}
              disabled={disabled}
            >
              <Icon type="upload"/> 上传附件
            </Button>
          </Upload>
        </div>
      </div>
    );
  };
  render() {
    const {
      getFieldDecorator,
    } = this.props.form;
    const {qualInfo, disabled} = this.state;
    return (
      <div className={styles.Main}>
        {this.renderUpload()}
        <Form>
          <table border="1" className={styles.table}>
            <tbody>
              <tr height="20px">
                <td colSpan="2">
                  <div className={styles.boxLeft}>
                    <span>候选人：</span>
                    <span>{qualInfo.name}</span>
                  </div>
                  <div className={styles.boxRight}>
                    <span>岗位：</span>
                    <span>{qualInfo.station}</span>
                  </div>
                </td>
              </tr>
              <tr height="190">
                <td className={styles.tableLeft}>专业及教育背景与岗位要求的符合程度</td>
                <td valign="top">
                  <FormItem className={styles.formItem} >
                    学历：
                    {
                      getFieldDecorator('education', {
                        initialValue: qualInfo.education,
                      })(
                        <RadioGroup name="radiogroup" disabled={disabled}>
                          <Radio value="博士">博士</Radio>
                          <Radio value="硕士">硕士</Radio>
                          <Radio value="本科">本科</Radio>
                          <Radio value="大中专">大中专</Radio>
                          <Radio value="其他">其他</Radio>
                        </RadioGroup>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItem} >
                    毕业院校/专业：
                    {
                      getFieldDecorator('school', {
                        initialValue: qualInfo.school,
                      })(
                        <Input style={{width: '200px'}} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItem}>
                    若学业有中断或无学位，请说明原因：
                    {
                      getFieldDecorator('studyRemark', {
                        initialValue: qualInfo.studyRemark,
                      })(
                        <TextArea rows={4} className={styles.textArea} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItem} >
                    与岗位要求的符合度：
                    {
                      getFieldDecorator('conformity1', {
                        initialValue: qualInfo.conformity1,
                      })(
                        <RadioGroup name="conformity1" disabled={disabled}>
                          <Radio value="非常符合">非常符合</Radio>
                          <Radio value="基本符合">基本符合</Radio>
                          <Radio value="不符合">不符合</Radio>
                        </RadioGroup>
                      )
                    }
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td className={styles.tableLeft}>工作经历及经验与岗位要求的符合度</td>
                <td valign="top" height="305">
                  <span>（从候选人所在行业、公司中与岗位密切相关的工作或项目经验初步判断候选人与岗位的符合度）</span>
                  <FormItem className={styles.formItem}>
                    与岗位相关的工作经历、经验与突出贡献：
                    {
                      getFieldDecorator('contribution', {
                      initialValue: qualInfo.contribution,
                      })(
                        <TextArea rows={4} className={styles.textArea} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItem}>
                    若工作经历中断超过3个月、频繁跳槽等，请说明原因：
                    {
                      getFieldDecorator('jobMark', {
                        initialValue: qualInfo.jobMark,
                      })(
                        <TextArea rows={4} className={styles.textArea} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItem} >
                    与岗位要求的符合度：
                    {
                      getFieldDecorator('conformity2', {
                        initialValue: qualInfo.conformity2,
                      })(
                        <RadioGroup name="conformity2" disabled={disabled}>
                          <Radio value="非常符合">非常符合</Radio>
                          <Radio value="基本符合">基本符合</Radio>
                          <Radio value="不符合">不符合</Radio>
                        </RadioGroup>
                      )
                    }
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td className={styles.tableLeft}>必备专业知识/技能/语言与岗位要求的符合度</td>
                <td valign="top" height="130">
                  <FormItem className={styles.formItem} >
                      外部第三方机构颁发的专业认证等级与证书：
                    {
                      getFieldDecorator('techinalCre', {
                      initialValue: qualInfo.techinalCre,
                      })(
                        <Input style={{width: '200px'}} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItemBlock} >
                    是否符合岗位要求：
                    {
                      getFieldDecorator('conformity3', {
                      initialValue: qualInfo.conformity3,
                      })(
                        <RadioGroup name="conformity3" disabled={disabled}>
                          <Radio value="非常符合">非常符合</Radio>
                          <Radio value="基本符">基本符合</Radio>
                          <Radio value="不符合">不符合</Radio>
                        </RadioGroup>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItem} >
                    必备语种：
                    {
                      getFieldDecorator('mustLanguage', {
                      initialValue: qualInfo.mustLanguage,
                      })(
                        <Input style={{width: '200px'}} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItem} >
                    必备语言等级与证书：
                    {
                      getFieldDecorator('languageBook', {
                        initialValue: qualInfo.languageBook,
                      })(
                        <Input style={{width: '200px'}} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItemBlock} >
                    是否符合岗位要求：
                    {
                      getFieldDecorator('conformity4', {
                        initialValue: qualInfo.conformity4,
                      })(
                        <RadioGroup name="conformity4" disabled={disabled}>
                          <Radio value="非常符合">非常符合</Radio>
                          <Radio value="基本符">基本符合</Radio>
                          <Radio value="不符合">不符合</Radio>
                        </RadioGroup>
                      )
                    }
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td className={styles.tableLeft}>证件验证</td>
                <td valign="top" height="30">
                  <FormItem className={styles.formItem} >
                    {
                      getFieldDecorator('papersVaildate1', {
                        initialValue: qualInfo.papersVaildate1,
                      })(
                        <Checkbox.Group disabled={disabled}>
                          <Checkbox value="毕业证">毕业证</Checkbox>
                          <Checkbox value="学位证">学位证</Checkbox>
                          <Checkbox value="有效身份证件">有效身份证件：</Checkbox>
                        </Checkbox.Group>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItem} >
                    {
                      getFieldDecorator('papersVaildate2', {
                      initialValue: qualInfo.papersVaildate2,
                      })(
                        <Input style={{width: '200px', height: '30px'}} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td className={styles.tableLeft}>
                  加入公司的意愿与考虑赛诺微机会的原因
                </td>
                <td valign="top" height="150">
                  <FormItem className={styles.formItemBlock} >
                      加入公司的意愿度：
                    {
                      getFieldDecorator('join', {
                      initialValue: qualInfo.join,
                      })(
                        <RadioGroup name="join" disabled={disabled}>
                          <Radio value="比较强烈">比较强烈</Radio>
                          <Radio value="一般，但愿意接">一般，但愿意接触</Radio>
                          <Radio value="暂无意愿">暂无意愿</Radio>
                        </RadioGroup>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItem}>
                    考虑公司机会或暂无意愿的原因：
                    {
                      getFieldDecorator('unjoinMark', {
                      initialValue: qualInfo.unjoinMark,
                      })(
                        <TextArea rows={4} className={styles.textArea} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td className={styles.tableLeft}>
                  应聘者愿意接受的工作地点
                </td>
                <td valign="top" height="60">
                  <FormItem className={styles.formItemBlock} >
                    {
                      getFieldDecorator('jobAddress', {
                        initialValue: qualInfo.jobAddress,
                      })(
                        <RadioGroup name="jobAddress" disabled={disabled}>
                          <Radio value="全球各地">全球各地</Radio>
                          <Radio value="海外部分地区">海外部分地区</Radio>
                          <Radio value="国内各地">国内各地</Radio>
                          <Radio value="国内某些城市">国内某些城市</Radio>
                        </RadioGroup>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItem} >
                  其他说明：
                    {
                      getFieldDecorator('jobAddressMark', {
                        initialValue: qualInfo.jobAddressMark,
                      })(
                        <Input style={{width: '200px', height: '30px'}} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td className={styles.tableLeft}>薪资情况了解</td>
                <td valign="top" height="80">
                  <FormItem className={styles.formItem} >
                    目前薪资状况：
                    {
                      getFieldDecorator('nowSalary', {
                        initialValue: qualInfo.nowSalary,
                      })(
                        <Input style={{width: '150px', height: '30px'}} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItem} >
                  元/月，年终奖：
                    {
                      getFieldDecorator('endBonus', {
                      initialValue: qualInfo.endBonus,
                      })(
                        <Input style={{width: '150px', height: '30px'}} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItem} >
                  元/年，其他：
                    {
                      getFieldDecorator('rests', {
                        initialValue: qualInfo.rests,
                      })(
                        <Input style={{width: '150px', height: '30px'}} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItem} >
                  目前年收入：
                    {
                      getFieldDecorator('newYearSalary', {
                      initialValue: qualInfo.newYearSalary,
                      })(
                        <Input style={{width: '150px', height: '30px'}} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItemBlock} >
                  期望薪资：
                    {
                      getFieldDecorator('hopeSalary', {
                        initialValue: qualInfo.hopeSalary,
                      })(
                        <Input style={{width: '150px', height: '30px'}} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td className={styles.tableLeft}>
                  其他
                </td>
                <td valign="top" height="30">
                  <FormItem className={styles.formItemBlock} >
                      性格是否过于孤僻或有其他明显缺陷：
                    {
                      getFieldDecorator('personality', {
                        initialValue: qualInfo.personality,
                      })(
                        <RadioGroup name="personality" disabled={disabled}>
                          <Radio value="是">是</Radio>
                          <Radio value="否">否</Radio>
                        </RadioGroup>
                      )
                    }
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td colSpan="2" valign="top">
                  <FormItem className={styles.formItemBlock} >
                      审查意见：
                    {
                        getFieldDecorator('examineOpinion', {
                        rules: [{required: true, message: '请选择等级！'}],
                        initialValue: qualInfo.examineOpinion,
                      })(
                        <RadioGroup name="examineOpinion" disabled={disabled}>
                          <Radio value="杰出">A杰出</Radio>
                          <Radio value="优秀">B+优秀</Radio>
                          <Radio value="良好">B良好</Radio>
                          <Radio value="一般">C一般</Radio>
                          <Radio value="不合格">D不合格</Radio>
                        </RadioGroup>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItemBlock} >
                    是否进入下一环节：
                    {
                      getFieldDecorator('result', {
                      rules: [{required: true, message: '请选择面试结果！'}],
                      initialValue: qualInfo.result,
                      })(
                        <RadioGroup name="result" disabled={disabled}>
                          <Radio value="同意">同意</Radio>
                          <Radio value="不同意">不同意</Radio>
                        </RadioGroup>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItem}>
                    审查主要依据：
                    {
                      getFieldDecorator('according', {
                        initialValue: qualInfo.according,
                      })(
                        <TextArea rows={4} className={styles.textAreaLong} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItem}>
                    建议后续关注的疑点：
                    {
                      getFieldDecorator('follow', {
                        initialValue: qualInfo.follow,
                      })(
                        <TextArea rows={4} className={styles.textAreaLong} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItem} >
                    资格审查人姓名：
                    {
                      getFieldDecorator('qualification', {
                        rules: [{required: true, message: '请填写姓名！'}],
                        initialValue: qualInfo.qualification,
                      })(
                        <AutoComplete
                          disabled={disabled}
                          dataSource={this.state.nameSource}
                          placeholder="面试官姓名"
                          onChange={this.handleChange}
                          onSelect={this.handleSelete}
                          style={{display: 'inline-block', width: 180}}
                        />
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItem} >
                  日期（年/月/日）：
                    {
                      getFieldDecorator('qualificationDate', {
                        rules: [{required: true, message: '请选择日期！'}],
                        initialValue: moment(qualInfo.qualificationDate),
                      })(
                        <DatePicker style={{width: 200}} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                </td>
              </tr>
            </tbody>
          </table>
          {this.renderButton()}
        </Form>
      </div>
    );
  }
}

export default Form.create({})(InviteTech);
