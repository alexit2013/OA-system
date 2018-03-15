import React from 'react';
import {isEmpty} from 'lodash';
import {connect} from 'dva';
import moment from 'moment';
import {
  Upload,
  Icon,
  Form,
  Button,
  Input,
  Radio,
  message,
  AutoComplete,
  DatePicker,
  Modal,
} from 'antd';
import {routerRedux} from 'dva/router';
import {getDownloadUrlByDocId} from '../../../utils/utils';
import {UPLOAD_FILE} from '../../../common/constants';
import {queryLike, findTechInfo} from '../../../services/api';
import styles from './InviteTech.less';
import {isAdmin, isHr} from '../../../utils/authority';

const {
  TextArea,
} = Input;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const {confirm} = Modal;

@connect(state => ({
  invite: state.invite,
}))
class InviteTech extends React.Component {
  state = {
    techInfo: {},
    techNumber: '',
    nameSource: [],
    fileList: [],
    disabled: false,
  }
  componentDidMount() {
    const {body} = this.props.location;
    if (!isEmpty(body)) {
      this.fetchData(body.technicalInterview);
    }
  }
  fetchData = (id) => {
    const {body} = this.props.location;
    if (isEmpty(body.technicalInterview)) {
      this.setState({techInfo: body});
    } else {
      findTechInfo(id)
        .then((response) => {
          this.readOnly(response);
          if (response.docNo != null) {
            const files = [{
              uid: 1,
              name: response.title,
              status: 'done',
              url: getDownloadUrlByDocId(response.docNo),
            }];
            this.setState({fileList: files, techInfo: response});
          } else {
            this.setState({techInfo: response});
          }
        });
    }
  }
  toBack = () => {
    const {techInfo} = this.state;
    this.props.dispatch(routerRedux.push({
      pathname: '/tabs/invite/invite-center',
      id: techInfo.zid,
    }));
  }
  readOnly = (data) => {
    if (!isEmpty(data)) {
      if (!isHr() && !isAdmin()) {
        this.setState({disabled: true});
      }
    }
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
        // console.log('file: ', fileInfo.response);
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
          } else if (Object.prototype.toString.call(response) === '[object Object]') {
            const temp = [];
            temp.push(response);
            this.setState({
              nameSource: [response.name],
            });
          }
        });
    }
  };
  handleSelete = (value) => {
    queryLike(value)
      .then((response) => {
        response.map((item) => {
          this.setState({ techNumber: item.employeeNumber });
        });
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
  handleSubmit = () => {
    const {techInfo, techNumber} = this.state;
    const fileInfo = this.state.fileList[0];
    console.log('fileInfo: ', fileInfo);
    this.props.form.validateFields((err, values) => {
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
          let postData = {};
          if (fileInfo) {
            postData = {
              ...techInfo,
              ...values,
              docNo: fileInfo.fileId,
              title: fileInfo.name,
              technicalEmpNo: techNumber,
            };
          } else {
            postData = {
              ...techInfo,
              ...values,
              technicalEmpNo: techNumber,
            };
          }
          this.props.dispatch({
            type: 'invite/saveTech',
            payload: postData,
          });
        };
        confirm(object);
      } else {
        message.error('保存失败...');
      }
    });
  }
  DraftSubmit = () => {
    const {techInfo, techNumber} = this.state;
    const fileInfo = this.state.fileList[0];
    console.log('fileInfo: ', fileInfo);
    this.props.form.validateFields((err, values) => {
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
          let postData = {};
          if (fileInfo) {
            postData = {
              ...techInfo,
              ...values,
              docNo: fileInfo.fileId,
              title: fileInfo.name,
              technicalEmpNo: techNumber,
            };
          } else {
            postData = {
              ...techInfo,
              ...values,
              technicalEmpNo: techNumber,
            };
          }
          this.props.dispatch({
            type: 'invite/saveTechDraft',
            payload: postData,
          });
        };
        confirm(object);
      } else {
        message.error('保存失败...');
      }
    });
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
        <h2 className={styles.title}>业务面试考查表</h2>
        <div style={{float: 'right'}}>
          <Upload {...props} fileList={this.state.fileList} >
            <Button style={{width: '180px', border: '1px solid #000'}} disabled={disabled}>
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
    const { techInfo, disabled } = this.state;
    return (
      <div className={styles.Main}>
        {this.renderUpload()}
        <Form>
          <table border="1" className={styles.table}>
            <tbody>
              <tr>
                <td colSpan="6" valign="top">
                  <div className={styles.boxLeft}>
                    <span>候选人：</span>
                    <span>{techInfo.name}</span>
                  </div>
                  <div className={styles.boxRight}>
                    <span>岗位：</span>
                    <span>{techInfo.station}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td valign="top" colSpan="6" height="130">
                  <FormItem className={styles.formItem}>
                    过往承担的工作责任与取得的成绩：
                    {
                      getFieldDecorator('jobResponsility', {
                        initialValue: techInfo.jobResponsility,
                      })(
                        <TextArea rows={4} className={styles.textArea} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td colSpan="6">
                  <span style={{fontWeight: 600}}>专业知识：</span>
                  <span>专业领域所必须掌握的知识（根据对应评估等级描述对候选人专业知识进行考察与评价，打“√”标识）</span>
                </td>
              </tr>
              <tr>
                <td width="100">{}</td>
                <td width="100">
                  <span className={styles.bold}>0级</span>
                  <span>具有一般概念方面的知识</span>
                </td>
                <td width="100">
                  <span className={styles.bold}>1级</span>
                  <span>拥有实践方面的专业知识</span>
                </td>
                <td width="100">
                  <span className={styles.bold}>2级</span>
                  <span>拥有独立运作的专业知识</span>
                </td>
                <td width="100">
                  <span className={styles.bold}>3级</span>
                  <span>拥有全面广博的专业知识</span>
                </td>
                <td width="100">
                  <span className={styles.bold}>4级</span>
                  <span>拥有本领域前沿的专业知识</span>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <FormItem className={styles.formItem}>
                    {
                      getFieldDecorator('knowledge1', {
                        initialValue: techInfo.knowledge1,
                      })(
                        <TextArea rows={1} placeholder="知识点1" disabled={disabled}/>
                      )
                    }
                  </FormItem>
                </td>
                <td colSpan="5">
                  <FormItem className={styles.formItem} >
                    {
                      getFieldDecorator('knowledgeCon1', {
                      initialValue: techInfo.knowledgeCon1,
                      })(
                        <RadioGroup name="radiogroup" disabled={disabled}>
                          <Radio value="0" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                          <Radio value="1" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                          <Radio value="2" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                          <Radio value="3" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                          <Radio value="4" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                        </RadioGroup>
                      )
                    }
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <FormItem className={styles.formItem}>
                    {
                      getFieldDecorator('knowledge2', {
                        initialValue: techInfo.knowledge2,
                      })(
                        <TextArea rows={1} placeholder="知识点2" disabled={disabled}/>
                      )
                    }
                  </FormItem>
                </td>
                <td colSpan="5">
                  <FormItem className={styles.formItem} >
                    {
                      getFieldDecorator('knowledgeCon2', {
                        initialValue: techInfo.knowledgeCon2,
                      })(
                        <RadioGroup name="knowledgeCon2" disabled={disabled}>
                          <Radio value="0" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                          <Radio value="1" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                          <Radio value="2" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                          <Radio value="3" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                          <Radio value="4" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                        </RadioGroup>
                      )
                    }
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <FormItem className={styles.formItem}>
                    {
                      getFieldDecorator('knowledge3', {
                        initialValue: techInfo.knowledge3,
                      })(
                        <TextArea rows={1} placeholder="知识点3" disabled={disabled}/>
                      )
                    }
                  </FormItem>
                </td>
                <td colSpan="5">
                  <FormItem className={styles.formItem} >
                    {
                      getFieldDecorator('knowledgeCon3', {
                        initialValue: techInfo.knowledgeCon3,
                      })(
                        <RadioGroup name="knowledgeCon3" disabled={disabled}>
                          <Radio value="0" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                          <Radio value="1" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                          <Radio value="2" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                          <Radio value="3" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                          <Radio value="4" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                        </RadioGroup>
                      )
                    }
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td colSpan="6">
                  <span style={{fontWeight: 600}}>关键技能：</span>
                  <span>专业领域内保障工作质量的能力要求（根据对应评估等级描述对候选人业务技能进行考察与评价，打“√”标识）</span>
                </td>
              </tr>
              <tr>
                <td>{}</td>
                <td>
                  <span className={styles.bold}>0级</span>
                  <span>需要在他人指导下开展工作</span>
                </td>
                <td>
                  <span className={styles.bold}>1级</span>
                  <span>能够独立地开展工作</span>
                </td>
                <td>
                  <span className={styles.bold}>2级</span>
                  <span>能够带领他人工作</span>
                </td>
                <td>
                  <span className={styles.bold}>3级</span>
                  <span>能够承担并设计流程指导多模块综合业务开展</span>
                </td>
                <td>
                  <span className={styles.bold}>4级</span>
                  <span>领域专家，能够在本领域提出前瞻性的指导意见</span>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <FormItem className={styles.formItem}>
                    {
                      getFieldDecorator('techniacals1', {
                        initialValue: techInfo.techniacals1,
                      })(
                        <TextArea rows={1} placeholder="技能项1" disabled={disabled}/>
                      )
                    }
                  </FormItem>
                </td>
                <td colSpan="5">
                  <FormItem className={styles.formItem} >
                    {
                      getFieldDecorator('techniacalsCon1', {
                        initialValue: techInfo.techniacalsCon1,
                      })(
                        <RadioGroup name="techniacalsCon1" disabled={disabled}>
                          <Radio value="0" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                          <Radio value="1" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                          <Radio value="2" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                          <Radio value="3" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                          <Radio value="4" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                        </RadioGroup>
                      )
                    }
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <FormItem className={styles.formItem}>
                    {
                      getFieldDecorator('techniacals2', {
                        initialValue: techInfo.techniacals2,
                      })(
                        <TextArea rows={1} placeholder="技能项2" disabled={disabled}/>
                      )
                    }
                  </FormItem>
                </td>
                <td colSpan="5">
                  <FormItem className={styles.formItem} >
                    {
                      getFieldDecorator('techniacalsCon2', {
                      initialValue: techInfo.techniacalsCon2,
                      })(
                        <RadioGroup name="techniacalsCon2" disabled={disabled}>
                          <Radio value="0" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                          <Radio value="1" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                          <Radio value="2" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                          <Radio value="3" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                          <Radio value="4" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                        </RadioGroup>
                      )
                    }
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <FormItem className={styles.formItem}>
                    {
                      getFieldDecorator('techniacals3', {
                        initialValue: techInfo.techniacals3,
                      })(
                        <TextArea rows={1} placeholder="技能项3" disabled={disabled}/>
                      )
                    }
                  </FormItem>
                </td>
                <td colSpan="5">
                  <FormItem className={styles.formItem} >
                    {
                      getFieldDecorator('techniacalsCon3', {
                        initialValue: techInfo.techniacalsCon3,
                      })(
                        <RadioGroup name="techniacalsCon3" disabled={disabled}>
                          <Radio value="0" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                          <Radio value="1" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                          <Radio value="2" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                          <Radio value="3" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                          <Radio value="4" style={{width: 140, textAlign: 'center'}}>{}</Radio>
                        </RadioGroup>
                      )
                    }
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td colSpan="6">
                  <FormItem className={styles.formItem} >
                    岗位所需的其他专项测试：
                    {
                      getFieldDecorator('elseTest', {
                      initialValue: techInfo.elseTest,
                      })(
                        <Input style={{width: '200px'}} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td colSpan="6">
                  <FormItem className={styles.formItemInline} >
                      笔试/机试成绩：
                    {
                      getFieldDecorator('penGradle', {
                        initialValue: techInfo.penGradle,
                      })(
                        <Input style={{width: '250px'}} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItemInline} >
                    测试结论：
                    {
                      getFieldDecorator('penCon', {
                        initialValue: techInfo.penCon,
                      })(
                        <RadioGroup name="penCon" disabled={disabled}>
                          <Radio value="通过">通过</Radio>
                          <Radio value="不通过">不通过</Radio>
                        </RadioGroup>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItemInline} >
                    语言测试成绩：
                    {
                      getFieldDecorator('language', {
                        initialValue: techInfo.language,
                      })(
                        <Input style={{width: '255px'}} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItemInline} >
                    测试结论：
                    {
                      getFieldDecorator('languageCon', {
                        initialValue: techInfo.languageCon,
                      })(
                        <RadioGroup name="languageCon" disabled={disabled}>
                          <Radio value="通过">通过</Radio>
                          <Radio value="不通过">不通过</Radio>
                        </RadioGroup>
                      )
                    }
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td colSpan="6" >
                  <FormItem className={styles.formItem}>
                    评价意见：
                    {
                      getFieldDecorator('opinion', {
                      rules: [{required: true, message: '请填写评价意见！'}],
                      initialValue: techInfo.opinion,
                      })(
                        <TextArea rows={4} className={styles.textArea} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItem}>
                    不足之处：
                    {
                      getFieldDecorator('deficiency', {
                      initialValue: techInfo.deficiency,
                      })(
                        <TextArea rows={4} className={styles.textArea} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItem}>
                    建议后续关注的疑点：
                    {
                      getFieldDecorator('suggest', {
                        initialValue: techInfo.suggest,
                      })(
                        <TextArea rows={4} className={styles.textArea} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItemInline} >
                    业面人（姓名/工号）：
                    {
                      getFieldDecorator('technical', {
                        rules: [{required: true, message: '请输入姓名！'}],
                        initialValue: techInfo.technical,
                      })(
                        <AutoComplete
                          dataSource={this.state.nameSource}
                          placeholder="面试官姓名"
                          onChange={this.handleChange}
                          onSelect={this.handleSelete}
                          style={{display: 'inline-block', width: 180}}
                          disabled={disabled}
                        />
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItemInline} >
                    日期（年/月/日）：
                    {
                      getFieldDecorator('technicalDate', {
                        rules: [{required: true, message: '请选择日期！'}],
                        initialValue: moment(techInfo.technicalDate),
                      })(
                        <DatePicker style={{width: 200}} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td colSpan="6">
                  <FormItem className={styles.formItem} >
                      面试结论：
                    {
                      getFieldDecorator('msjg', {
                        rules: [{required: true, message: '请选择等级！'}],
                        initialValue: techInfo.msjg,
                      })(
                        <RadioGroup name="msjg" disabled={disabled}>
                          <Radio value="杰出">A杰出</Radio>
                          <Radio value="优秀">B+优秀</Radio>
                          <Radio value="良好">B良好</Radio>
                          <Radio value="一般">C一般</Radio>
                          <Radio value="不合格">D不合格</Radio>
                        </RadioGroup>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItem} >
                    是否进入下一环节：
                    {
                      getFieldDecorator('result', {
                      rules: [{required: true, message: '请选择面试结果！'}],
                      initialValue: techInfo.result,
                      })(
                        <RadioGroup name="radiogroup" disabled={disabled}>
                          <Radio value="同意">同意</Radio>
                          <Radio value="不同意">不同意</Radio>
                        </RadioGroup>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItem} >
                    建议初始专业任职资格等级：
                    {
                      getFieldDecorator('grade', {
                        initialValue: techInfo.grade,
                      })(
                        <Input style={{width: '200px'}} disabled={disabled}/>
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
