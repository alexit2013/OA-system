import React from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {isEmpty} from 'lodash';
import {Form, Button, Select, Input, AutoComplete, Icon, message, DatePicker, Modal, Tooltip} from 'antd';
import {INVITE_STATUS, INVITE_RECORD, DOWNLOAD_FILE} from '../../../common/constants';
import styles from './InviteCenter.less';
import {inviterInfo, queryLike, saveCenter, findRecordInviter, judgeInviter, saveRecordInviter} from '../../../services/api';
import {formatTime, formatTimeLess, formatTimeDiff} from '../../../utils/timeUtil';
import {isAdmin, isHr, findIdentity} from '../../../utils/authority';

const FormItem = Form.Item;
const {TextArea} = Input;
const {Option} = Select;

let srchValue = '';
@connect(state => ({
  invite: state.invite,
}))
class InviteCenter extends React.Component {
  state = {
    nameSourceComp: [],
    nameSourceQual: [],
    nameSourceTech: [],
    nameSourceDuty: [],
    nameSourceRecord: [],
    inviteInformation: {},
    qualificationNo: '',
    synthesizeNo: '',
    technicalerNo: '',
    visible: false,
    recordInfo: {},
    recordNo: '',
    recordSource: [],
  }
  componentDidMount() {
    this.fetchData(this.props.location.id);
    this.fetchComRecord(this.props.location.id);
    this.srchValue = this.props.location.srchValue;
  }

  fetchData = (emid) => {
    if (isEmpty(emid)) {
      return null;
    }
    // console.log('招聘管理', this.srchValue);
    inviterInfo(emid)
      .then((response) => {
        this.setState({inviteInformation: response});
        this.setState({technicalerNo: this.state.inviteInformation.technicalerNo});
        this.setState({qualificationNo: this.state.inviteInformation.qualificationNo});
        this.setState({synthesizeNo: this.state.inviteInformation.synthesizeNo});
      });
  }
  fetchComRecord = (emid) => {
    findRecordInviter(emid)
      .then((response) => {
        this.setState({recordSource: response});
      });
  }
  handleStr = (str) => {
    if (str) {
      let resultStr = '';
      if (str !== '已保存为草稿') {
        const tempArr = str.split(',');
        resultStr = `面试结论：${tempArr[1]}；是否进入下一环节：${tempArr[0]}`;
        return resultStr;
      } else {
        return str;
      }
    } else {
      return null;
    }
  }
  readOnly = (str) => {
    if (str !== '') {
      return false;
    }
    if (isAdmin() || isHr()) {
      return false;
    } else {
      return true;
    }
  }
handleChangeTech = (value) => { // AutoComplete组件数据发生改变时调用
  if (value.trim() === '') {
    this.setState({nameSourceTech:[]});
  } else {
    queryLike(value.trim())
      .then((response) => {
        if (Object.prototype.toString.call(response) === '[object Array]') {
          const temp = [];
          response.map((item) => {
            temp.push(item.name);
            if (item.name === value) {
              this.setState({technicalerNo: item.employeeNumber});
              // this.setState({inviteInformation: React.addons.update(this.state.inviteInformation.technicalerNo: {$set: this.state.technicalerNo})});
            }
          });
          this.setState({
            nameSourceTech: [...temp],
          });
        } else if (Object.prototype.toString.call(response) === '[object Object]') {
          const temp = [];
          temp.push(response);
          this.setState({
            nameSourceTech: [response.name],
          });
        }
      });
  }
};
  handleChangeComp = (value) => { // AutoComplete组件数据发生改变时调用
    if (value.trim() === '') {
      this.setState({nameSourceComp: []});
    } else {
      queryLike(value.trim())
        .then((response) => {
          if (Object.prototype.toString.call(response) === '[object Array]') {
            const temp = [];
            response.map((item) => {
              temp.push(item.name);
              if (item.name === value) {
                this.setState({synthesizeNo: item.employeeNumber});
              }
            });
            this.setState({
              nameSourceComp: [...temp],
            });
          } else if (Object.prototype.toString.call(response) === '[object Object]') {
            const temp = [];
            temp.push(response);
            this.setState({
              nameSourceComp: [response.name],
            });
          }
        });
    }
  };
  handleChangeQual = (value) => { // AutoComplete组件数据发生改变时调用
    if (value.trim() === '') {
      this.setState({nameSourceQual: []});
    } else {
      queryLike(value.trim())
        .then((response) => {
          if (Object.prototype.toString.call(response) === '[object Array]') {
            const temp = [];
            response.map((item) => {
              temp.push(item.name);
              if (item.name === value) {
                this.setState({qualificationNo: item.employeeNumber});
              }
            });
            this.setState({
              nameSourceQual: [...temp],
            });
          } else if (Object.prototype.toString.call(response) === '[object Object]') {
            const temp = [];
            temp.push(response);
            this.setState({
              nameSourceQual: [response.name],
            });
          }
        });
    }
  };

  handleChangeRecord = (value) => { // AutoComplete组件数据发生改变时调用
    if (value.trim() === '') {
      this.setState({nameSourceRecord: []});
    } else {
      queryLike(value.trim())
        .then((response) => {
          if (Object.prototype.toString.call(response) === '[object Array]') {
            const temp = [];
            response.map((item) => {
              temp.push(item.name);
              if (item.name === value) {
                this.setState({recordNo: item.employeeNumber});
              }
            });
            this.setState({
              nameSourceRecord: [...temp],
            });
          }
        });
    }
  }
  handleChangeDuty = (value) => { // AutoComplete组件数据发生改变时调用
    if (value.trim() === '') {
      this.setState({nameSourceRecord: []});
    } else {
      queryLike(value.trim())
        .then((response) => {
          if (Object.prototype.toString.call(response) === '[object Array]') {
            const temp = [];
            response.map((item) => {
              temp.push(item.name);
            });
            this.setState({
              nameSourceDuty: [...temp],
            });
          } else if (Object.prototype.toString.call(response) === '[object Object]') {
            const temp = [];
            temp.push(response);
            this.setState({
              nameSourceDuty: [response.name],
            });
          }
        });
    }
  };
  skip = (str) => {
    const {dispatch} = this.props;
    const {inviteInformation} = this.state;
    const body = {
      name: inviteInformation.name,
      station: inviteInformation.pname,
    };
    if (str === 'tech') {
      body.view = inviteInformation.technical;
      body.technicalInterview = inviteInformation.technicalInterview;
      body.zid = inviteInformation.zid;
      dispatch(routerRedux.push({
        pathname: '/tabs/invite/invite-task/tech-invite',
        body,
      }));
    } else if (str === 'qual') {
      body.education = inviteInformation.bastEducation;
      body.school = inviteInformation.graduation3;
      body.qualificationInterview = inviteInformation.qualificationInterview;
      body.zid = inviteInformation.zid;
      dispatch(routerRedux.push({
        pathname: '/tabs/invite/invite-task/qual-invite',
        body,
      }));
    } else {
      body.view = inviteInformation.synthesize;
      body.synthesizeInterview = inviteInformation.synthesizeInterview;
      body.zid = inviteInformation.zid;
      dispatch(routerRedux.push({
        pathname: '/tabs/invite/invite-task/comp-invite',
        body,
      }));
    }
  }
  // 编辑沟通记录
  // id:沟通记录id，用于后台对应记录的权限
  // recordNo：沟通人工号
  skipRecord = (value, i) => {
    const {recordSource} = this.state;
    judgeInviter(value.id)
      .then((response) => {
        if (response.status === 'error') {
          message.error('对不起不是本人操作没有权限');
        } else {
          this.setState({visible: true, recordNo: value.toucherNo, recordInfo: recordSource[i]});
        }
      });
  }
  recordLayout = () => {
    const {recordSource} = this.state;
    if (recordSource.length === 0) {
      return (
        <tr>
          <td colSpan="24" className={styles.td} height="35">
              暂无沟通记录！
          </td>
        </tr>
      );
    } else {
      return recordSource.map((it, i) => {
        it.key = it.id;
        return (
          <tr height="40" onClick={() => { this.skipRecord(it, i); }} style={{cursor: 'pointer'}} key={it.id}>
            <td colSpan="4" className={styles.td}>{it.toucherName}</td>
            <td colSpan="4" className={styles.td}>{it.touchType}</td>
            <td colSpan="4" className={styles.td}>{formatTime(it.touchDate)}</td>
            <td colSpan="12" className={styles.td}>{it.touchContext}</td>
          </tr>
        );
      });
    }
  }
  putDate = (data) => {
    const {recordInfo} = this.state;
    if (isEmpty(recordInfo)) {
      return findIdentity().name;
    } else {
      return data;
    }
  }
  record = () => {
    this.setState({visible: true});
  }
  // 沟通记录保存
  handleOk = (e) => {
    const {recordNo, inviteInformation} = this.state;
    const { invite: { loading } } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.state.recordInfo.id !== undefined) { // 编辑沟通记录
          values.zid = inviteInformation.zid;
          values.toucherNo = this.state.recordNo;
          values.id = this.state.recordInfo.id;
          saveRecordInviter(values)
            .then((res) => {
              if (res.status === 'ok') {
                this.fetchComRecord(this.props.location.id);
              }
            })
        } else {  // 新增沟通记录
          values.zid = inviteInformation.zid;
          if (recordNo !== '') {
            values.toucherNo = recordNo;
          } else {
            values.toucherNo = findIdentity().employeeNumber;
          }
          saveRecordInviter(values)
            .then((res) => {
              if (res.status === 'ok') {
                this.fetchComRecord(this.props.location.id);
              }
            });
          this.setState({recordNo: ''}); // 联系人工号置空;
        }
        this.setState({visible: false});
      }
      values = null;
    });
    if (loading) {
      this.fetchComRecord(this.props.location.id);
    }
    this.setState({recordInfo: {}});
  }
  handleCancel = () => {
    this.setState({visible: false, recordInfo: {}});
  }

  handleSubmit = (e) => {
    const {inviteInformation, qualificationNo, technicalerNo, synthesizeNo} = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const postBody = {
          ...inviteInformation,
          ...values,
          technicalerNo,
          qualificationNo,
          synthesizeNo,
        };
        // console.log('postData: ', postBody);
        saveCenter(postBody)
          .then((response) => {
            if (response.status === 'ok') {
              message.success('操作成功');
              this.props.dispatch(routerRedux.push('/tabs/invite/invite-message'));
            }
          });
      }
    });
  }
  footerLayout = (value) => {
    const {getFieldDecorator} = this.props.form;
    if (!isEmpty(value)) {
      return (
        <div className={styles.inviteFooter}>
          <FormItem
            style={{ margin: 0, padding: 0}}
          >
            {getFieldDecorator('nowStatus', {
              initialValue: value.nowStatus,
            })(
              <Select
                style={{ width: 200, marginLeft: '9%' }}
                placeholder="请选择候选人下一步状态"
                onSelect={this.handleSelete}
              >
                {INVITE_STATUS.map((it, i) => {
                  return <Option value={it} key={i}>{it}</Option>
                })}
              </Select>
            )}
          </FormItem>
          <FormItem
            style={{ margin: 0, padding: 0}}
          >
            {getFieldDecorator('chargePerson', {
              initialValue: value.chargePerson,
            })(
              <AutoComplete
                dataSource={this.state.nameSourceDuty}
                className={styles.auto}
                placeholder="当前责任人"
                onChange={this.handleChangeDuty}
              />
            )}
          </FormItem>
          <div>
            <Button onClick={this.handleSubmit} style={{width: 100}} type="primary">确定</Button>
            <Button onClick={this.backHistory} style={{width: 100}} type="default">返回</Button>
          </div>
        </div>
      );
    }
  }
  backHistory = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/tabs/invite/invite-message',
      srchValue: this.srchValue,
    }));
  }
  // 沟通记录页面
  modalLayout = (bool) => {
    if (bool) {
      const {getFieldDecorator} = this.props.form;
      const {recordInfo} = this.state;
      return (
        <div className={styles.modal}>
          <Modal
            title="新增沟通记录"
            style={{ top: '25%' }}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={680}
          >
            <Form style={{marginLeft: 40}}>
              <table border="1" style={{border: '1px solid #eee'}}>
                <tbody>
                  <tr height="25px">
                    <td >
                      <FormItem style={{ margin: 0}}>
                        {getFieldDecorator('toucherName', {
                          initialValue: this.putDate(recordInfo.toucherName),
                        })(
                          <AutoComplete
                            dataSource={this.state.nameSourceRecord}
                            onChange={this.handleChangeRecord}
                            placeholder="请输入沟通人姓名"
                          />
                        )}
                      </FormItem>
                    </td>
                    <td>
                      <FormItem style={{margin: 0}}>
                        {getFieldDecorator('touchDate', {
                          rules: [{required: true, message: '请选择沟通时间！'}],
                          initialValue: moment(recordInfo.touchDate),
                        })(
                          <DatePicker placeholder="沟通时间" />
                        )}
                      </FormItem>
                    </td>
                    <td>
                      <FormItem style={{margin: 0}}>
                        {getFieldDecorator('touchType', {
                          initialValue: recordInfo.touchType === undefined ? "电话" : recordInfo.touchType,
                          rules: [{required: true, message: '请选择沟通方式！'}],
                        })(
                          <Select style={{width: 180}} placeholder="请选择沟通方式" >
                            {INVITE_RECORD.map(it => (<Option value={it} key={it}>{it}</Option>))}
                          </Select>
                        )}
                      </FormItem>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3">
                      <FormItem style={{margin: 0}}>
                        {
                          getFieldDecorator('touchContext', {
                            rules: [{required: true, message: '请填写沟通内容！'}],
                            initialValue: recordInfo.touchContext,
                          })(
                            <TextArea rows={8} placeholder="请填写相关沟通内容" />
                          )
                        }
                      </FormItem>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Form>
          </Modal>
        </div>
      );
    } else {
      return null;
    }
  }
  contentLayout = () => {
    const {getFieldDecorator} = this.props.form;
    const {inviteInformation} = this.state;
    if (inviteInformation) {
      return (
        <div className={styles.Invitecontent}>
          <Form onSubmit={this.handleSubmit}>
            <table border='1' width="100%" className={styles.table}>
              <tbody>
                <tr height="40" className={styles.head}>
                  <td colSpan="24" align="center" >基本信息</td>
                  {/* <Tooltip title="点击返回上一页面" arrowPointAtCenter><a style={{float: 'left'}} onClick={this.backHistory}><Icon type="backward" /></a></Tooltip>  */}
                </tr>
                <tr height="40" >
                  <td colSpan='3' className={styles.td}>候选人姓名</td>
                  <td colSpan='3' className={styles.td}>{inviteInformation.name}</td>
                  <td colSpan='3' className={styles.td}>联系方式</td>
                  <td colSpan='3' className={styles.td}>{inviteInformation.phoneNo}</td>
                  <td colSpan='3' className={styles.td}>邮箱</td>
                  <td colSpan='3' className={styles.td}>{inviteInformation.email}</td>
                  <td colSpan='3' className={styles.td}>婚姻状况</td>
                  <td colSpan='3' className={styles.td}>{inviteInformation.maritalStatus}</td>
                </tr>
                <tr height="40">
                  <td colSpan='3' className={styles.td}>岗位类别</td>
                  <td colSpan='3' className={styles.td}>{inviteInformation.positionType}</td>
                  <td colSpan='3' className={styles.td} >岗位名称</td>
                  <td colSpan='3' className={styles.td}>{inviteInformation.pname}</td>
                  <td colSpan='3' className={styles.td} >候选人来源</td>
                  <td colSpan='3' className={styles.td}>{inviteInformation.source}</td>
                  <td colSpan='3' className={styles.td}>出生日期</td>
                  <td colSpan='3' className={styles.td}>{formatTimeLess(inviteInformation.birth)}</td>
                </tr>
                <tr height="40">
                  <td colSpan='3' className={styles.td} >户口所在地</td>
                  <td colSpan='3' className={styles.td}>{inviteInformation.comeFrom}</td>
                  <td colSpan='3' className={styles.td}>附件</td>
                  <td colSpan='3' className={styles.td}><a href={`${DOWNLOAD_FILE}\\\\${inviteInformation.docNo}`}>{inviteInformation.title}</a></td>
                  <td colSpan='3' className={styles.td} >最高学历</td>
                  <td colSpan='3' className={styles.td}>{inviteInformation.bastEducation}</td>
                  <td colSpan='3' className={styles.td}>录入信息</td>
                  <td colSpan='3' className={styles.td}>{inviteInformation.createEmpName},{formatTimeDiff(inviteInformation.createDate)}</td>
                </tr>
                <tr height="40">
                  <td colSpan="24" align="center" className={styles.head}>面试信息</td>
                </tr>
                <tr height="40">
                  <td colSpan="4" className={styles.tdm} >面试记录</td>
                  <td colSpan="4" className={styles.tdm} >面试官</td>
                  <td colSpan="4" className={styles.tdm} >计划面试时间</td>
                  <td colSpan="4" className={styles.tdm} >开始面试</td>
                  <td colSpan="8" className={styles.tdml}>结果</td>
                </tr>
                <tr height="40">
                  <td colSpan="4" className={styles.td}>技术面试</td>
                  <td colSpan="4" className={styles.td}>
                    <FormItem style={{height: 40, margin: 0}}
                    >
                      {getFieldDecorator('technicalerName', {
                        initialValue: inviteInformation.technicalerName,

                      })(
                        <AutoComplete
                          dataSource={this.state.nameSourceTech}
                          style={{height: '40px', marginTop: 5}}
                          onChange={this.handleChangeTech}
                          placeholder="技术面试官姓名"
                          disabled={this.readOnly(inviteInformation.technicalerName)}
                        />
                      )}
                    </FormItem>
                  </td>
                  <td colSpan="4" className={styles.td}>
                    <FormItem style={{height: 40, margin: 0}}
                    >
                      {getFieldDecorator('technicalerPlan', {
                        initialValue: moment(inviteInformation.technicalerPlan),
                      })(
                        <DatePicker placeholder="计划面试时间" />
                      )}
                    </FormItem>
                  </td>
                  <td colSpan="4" className={styles.td}><a onClick={() => {this.skip('tech')}}>技术面试</a></td>
                  <td colSpan="8" className={styles.td}>
                    {this.handleStr(inviteInformation.technicalResult)}
                  </td>
                </tr>
                <tr height="40">
                  <td colSpan="4" className={styles.td}>资格面试</td>
                  <td colSpan="4" className={styles.td}>
                    <FormItem
                      style={{height: 40, margin: 0, padding: 0}}
                    >
                      {getFieldDecorator('qualificationName', {
                        initialValue: inviteInformation.qualificationName,
                      })(
                        <AutoComplete
                          dataSource={this.state.nameSourceQual}
                          style={{height: '40px', marginTop: 5}}
                          onChange={this.handleChangeQual}
                          placeholder="资格面试官姓名"
                          disabled={this.readOnly(inviteInformation.qualificationName)}
                        />
                      )}
                    </FormItem>
                  </td>
                  <td colSpan="4" className={styles.td}>
                    <FormItem style={{height: 40, margin: 0}}
                    >
                      {getFieldDecorator('qualificationPlan', {
                        initialValue: moment(inviteInformation.qualificationPlan),
                      })(
                        <DatePicker placeholder="计划面试时间" />
                      )}
                    </FormItem>
                  </td>
                  <td colSpan="4" className={styles.td}><a onClick={() => { this.skip('qual'); }}>资格面试</a></td>
                  <td colSpan="8" className={styles.td}>{this.handleStr(inviteInformation.qualificationResult)}</td>
                </tr>
                <tr height="40">
                  <td colSpan="4" className={styles.td}>综合面试</td>
                  <td colSpan="4" className={styles.td}>
                    <FormItem
                      style={{height: 40, margin: 0}}
                    >
                      {getFieldDecorator('synthesizeName', {
                        initialValue: inviteInformation.synthesizeName,
                      })(
                        <AutoComplete
                          dataSource={this.state.nameSourceComp}
                          style={{height: '40px', marginTop: 5}}
                          onChange={this.handleChangeComp}
                          placeholder="综合面试官姓名"
                          disabled={this.readOnly(inviteInformation.synthesizeName)}
                        />
                      )}
                    </FormItem>
                  </td>
                  <td colSpan="4" className={styles.td}>
                    <FormItem style={{height: 40, margin: 0}}
                    >
                      {getFieldDecorator('synthesizePlan', {
                        initialValue: moment(inviteInformation.synthesizePlan),
                      })(
                        <DatePicker placeholder="计划面试时间" />
                      )}
                    </FormItem>
                  </td>
                  <td colSpan="4" className={styles.td}><a onClick={() => {this.skip('comp'); }}>综合面试</a></td>
                  <td colSpan="8" className={styles.td}>{this.handleStr(inviteInformation.synthesizeResult)}</td>
                </tr>
                <tr height="40">
                  <td colSpan="24" align="center" className={styles.head}>
                    <Tooltip title="点击新增沟通记录" arrowPointAtCenter>
                      <a onClick={this.record}>沟通记录</a>
                    </Tooltip>
                  </td>
                </tr>
                <tr height="40" >
                  <td colSpan="4" className={styles.td}>
                    <span >沟通人姓名</span>
                  </td>
                  <td colSpan="4" className={styles.td}>沟通方式</td>
                  <td colSpan="4" className={styles.td}>沟通时间</td>
                  <td colSpan="12" className={styles.td}>沟通内容</td>
                </tr>
                {this.recordLayout()}
              </tbody>
            </table>
          </Form>
        </div>
      );
    } else {
      return null;
    }
  }
  render() {
    return (
      <div className={styles.inviteMain}>
        {this.modalLayout(this.state.visible)}
        {this.contentLayout()}
        {this.footerLayout(this.state.inviteInformation)}
      </div>
    );
  }
}

export default Form.create({})(InviteCenter);
