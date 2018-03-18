import React from 'react';
import {isEmpty} from 'lodash';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import moment from 'moment';
import {Form, Button, Input, Radio, message, DatePicker, AutoComplete, Icon, Upload, Modal} from 'antd';
import {UPLOAD_FILE} from '../../../common/constants';
import {findCompInfo, queryLike} from '../../../services/api';
import {getDownloadUrlByDocId} from '../../../utils/utils';
import styles from './InviteComp.less';
import {isAdmin, isHr} from '../../../utils/authority';

const FormItem = Form.Item;
const {TextArea} = Input;
const RadioGroup = Radio.Group;
const {confirm} = Modal;


@connect(state => ({
  invite: state.invite,
}))
class InviteComp extends React.Component {
  state = {
    compInfo: {},
    compNumber: '',
    nameSource: [],
    disabled: false,
    fileList: [],
  }
  componentDidMount() {
    const {body} = this.props.location;
    if (!isEmpty(body)) {
      this.fetchData(body.synthesizeInterview);
    }
  }
  fetchData = (id) => {
    const {body} = this.props.location;
    if (isEmpty(body.synthesizeInterview)) {
      this.setState({compInfo: body});
    } else {
      findCompInfo(id)
        .then((response) => {
          console.log('res: ', response);
          this.readOnly(response);
          if (!isEmpty(response.docNo)) {
            const files = [{
              uid: 1,
              name: response.title,
              status: 'done',
              url: getDownloadUrlByDocId(response.docNo),
            }];
            this.setState({fileList: files, compInfo: response});
          } else {
            this.setState({compInfo: response});
          }
        });
    }
  }
  toBack = () => {
    const {compInfo} = this.state;
    this.props.dispatch(routerRedux.push({
      pathname: '/tabs/invite/invite-center',
      id: compInfo.zid,
    }));
  }
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
              if (value.trim() === item.name) {
                this.setState({compNumber: item.employeeNumber});
              }
            });
            this.setState({
              nameSource: [...temp],
            });
          }
        });
    }
  };
  handleSelete = (value) => { // 选择结果时调用
    queryLike(value)
      .then((response) => {
        response.map((item) => {
          this.setState({compNumber: item.employeeNumber});
        });
      });
  };
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
  readOnly = (data) => {
    if (!isEmpty(data)) {
      if (data.isDraft === '是') {
        this.setState({disabled: false});
        return;
      }
      if (!isHr() && !isAdmin()) {
        this.setState({disabled: true});
      } else {
        this.setState({disabled: false});
      }
    }
  }
  handleSubmit = () => { // 提交表单时调用
    // e.preventDefault();
    const {compInfo, compNumber} = this.state;
    const fileInfo = this.state.fileList[0];
    this.props.form.validateFields((err, values) => {
      console.log('values: ', values);
      if (!err) {
        const object = {
          title: '确定要提交吗？',
          okText: '确定',
          cancelText: '取消',
          onCancel() {
            // console.log('Cancel');
          },
        };
        object.onOk = () => {
          let postData = {};
          if (!isEmpty(fileInfo)) {
            postData = {
              ...compInfo,
              ...values,
              docNo: fileInfo.fileId,
              title: fileInfo.name,
              synthesizeEmpNo: compNumber,
            };
          } else {
            postData = {
              ...compInfo,
              ...values,
              synthesizeEmpNo: compNumber,
            };
          }
          this.props.dispatch({
            type: 'invite/saveComp',
            payload: postData,
          });
        };
        confirm(object);
      } else {
        message.error('保存失败...');
      }
    });
  }
  DraftSubmit = () => { // 提交表单时调用
    const {compInfo, compNumber} = this.state;
    const fileInfo = this.state.fileList[0];
    const values = this.props.form.getFieldsValue();
    const object = {
      title: '确定要保存为草稿吗？',
      okText: '确定',
      cancelText: '取消',
      onCancel() {
        console.log('Cancel');
      },
    };
    object.onOk = () => {
      let postData = {};
      if (!isEmpty(fileInfo)) {
        postData = {
          ...compInfo,
          ...values,
          docNo: fileInfo.fileId,
          title: fileInfo.name,
          synthesizeEmpNo: compNumber,
        };
      } else {
        postData = {
          ...compInfo,
          ...values,
          synthesizeEmpNo: compNumber,
        };
      }
      this.props.dispatch({
        type: 'invite/saveCompDraft',
        payload: postData,
      });
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
      <div >
        <h2 className={styles.title}>综合面试考核表</h2>
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
    const {getFieldDecorator} = this.props.form;
    const {compInfo, disabled} = this.state;
    return (
      <div className={styles.Main} >
        {this.renderUpload()}
        <Form onSubmit={this.handleSubmit}>
          <table border="1" className={styles.table}>
            <tbody>
              <tr height="20px">
                <td colSpan="2">
                  <div className={styles.boxLeft}>
                    <span>候选人：</span>
                    <span>{compInfo.name}</span>
                  </div>
                  <div className={styles.boxRight}>
                    <span>岗位：</span>
                    <span>{compInfo.station}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td rowSpan="2" >成长的基础(能不能干好)</td>
                <td >
                  <span className={styles.bold}>有洞察力：</span>
                  <span>有系统思维与战略思维； </span>
                  <span className={styles.bold}>有影响力：</span>
                  <span>具备良好的影响力、较强的与人连接能力； </span>
                  <span className={styles.bold}>合作性：</span>
                  <span>有很好的团队合作精神； </span>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem className={styles.formItem}>
                  评价：
                    {
                      getFieldDecorator('appraise1', {
                        initialValue: compInfo.appraise1,
                      })(
                        <TextArea rows={3} className={styles.textArea} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td rowSpan="2">成长的潜力(能不能持续干好)</td>
                <td >
                  <span className={styles.bold}>学习能力：</span>
                  <span>适应新环境新业务的快速学习能力； </span>
                  <span className={styles.bold}>开放性：</span>
                  <span>拥抱新观点新概念； </span>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem className={styles.formItem}>
                  评价：
                    {
                      getFieldDecorator('appraise2', {
                      initialValue: compInfo.appraise2,
                      })(
                        <TextArea rows={3} className={styles.textArea} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td rowSpan="2">成长的渴望(愿不愿意干好)</td>
                <td >
                  <span className={styles.bold}>成就导向：</span>
                  <span>有强烈的上进心和抱负，追求卓越，挑战自我； </span>
                  <span className={styles.bold}>坚韧性</span>
                  <span>在持续的压力和挫折下能够始终坚韧不拔； </span>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem className={styles.formItem}>
                  评价：
                    {
                      getFieldDecorator('appraise3', {
                        initialValue: compInfo.appraise3,
                      })(
                        <TextArea rows={3} className={styles.textArea} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td rowSpan="2">价值观与文化适应性</td>
                <td >
                  <span>
                  评估候选人是否认同公司核心价值观，对公司文化的适应性和适应能力；
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem className={styles.formItem}>
                  评价：
                    {
                      getFieldDecorator('appraise4', {
                        initialValue: compInfo.appraise4,
                      })(
                        <TextArea rows={3} className={styles.textArea} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td rowSpan="2">其他能力</td>
                <td >
                  <span>（如果需要考察其他能力项，请一并列出并给出评价）</span>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem className={styles.formItem}>
                    评价：
                    {
                      getFieldDecorator('appraise5', {
                      initialValue: compInfo.appraise5,
                      })(
                        <TextArea rows={3} className={styles.textArea} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td rowSpan="2">疑点澄清</td>
                <td >
                  <span>
                  （对前端各环节发现的候选人疑点进行澄清，并给出澄清结论）
                  </span>
                </td>
              </tr>
              <tr>
                <td height="120px">
                  <FormItem className={styles.formItemInline} >
                    是否存在疑点：
                    {
                      getFieldDecorator('doubtful', {
                      initialValue: compInfo.doubtful,
                      })(
                        <RadioGroup name="doubtful" disabled={disabled}>
                          <Radio value="是">是</Radio>
                          <Radio value="否">否</Radio>
                        </RadioGroup>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItemInline} >
                    疑点备注：
                    {
                      getFieldDecorator('doubtfulMarks', {
                      initialValue: compInfo.doubtfulMarks,
                      })(
                        <Input style={{width: '200px'}} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItem}>
                  澄清结论和说明：
                    {
                      getFieldDecorator('verdict', {
                        initialValue: compInfo.verdict,
                      })(
                        <TextArea rows={3} className={styles.textArea} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td colSpan="2" >
                  <FormItem className={styles.formItem}>
                  综合评价意见：
                    {
                      getFieldDecorator('qualificationOpinion', {
                        rules: [{required: true, message: '请填写综合评价意见！'}],
                        initialValue: compInfo.qualificationOpinion,
                      })(
                        <TextArea rows={3} style={{border: 'none'}} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItem}>
                    其他特殊说明：
                    {
                      getFieldDecorator('explain', {
                        initialValue: compInfo.explain,
                      })(
                        <TextArea rows={3} style={{border: 'none'}} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItemInline} >
                    综面人姓名：
                    {
                      getFieldDecorator('synthesize', {
                        rules: [{required: true, message: '请填写综面人姓名！'}],
                        initialValue: compInfo.synthesize,
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
                      getFieldDecorator('synthesizeDate', {
                      rules: [{required: true, message: '请选择日期！'}],
                      initialValue: moment(compInfo.synthesizeDate),
                      })(
                        <DatePicker style={{width: 200}} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td colSpan="2" valign="top" height="100">
                  <FormItem className={styles.formItem} >
                    面试结论：
                    {
                      getFieldDecorator('msjg', {
                      rules: [{required: true, message: '请选择等级！'}],
                      initialValue: compInfo.msjg,
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
                    是否进入下一阶段：
                    {
                      getFieldDecorator('result', {
                        rules: [{required: true, message: '请选择面试结果！'}],
                        initialValue: compInfo.result,
                      })(
                        <RadioGroup name="result" disabled={disabled}>
                          <Radio value="同意">同意</Radio>
                          <Radio value="不同意">不同意</Radio>
                        </RadioGroup>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItemInline} >
                    建议职位：
                    {
                      getFieldDecorator('positions', {
                        rules: [{required: true, message: '请填写建议职位！'}],
                        initialValue: compInfo.positions,
                      })(
                        <Input style={{width: '160px'}} disabled={disabled}/>
                      )
                    }
                  </FormItem>
                  <FormItem className={styles.formItemInline} >
                    建议职级：
                    {
                      getFieldDecorator('conversionOffer', {
                      rules: [{required: true, message: '请填写建议职级！'}],
                      initialValue: compInfo.conversionOffer,
                      })(
                        <Input style={{width: '160px'}} disabled={disabled}/>
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

export default Form.create({})(InviteComp);
