import React from 'react';
import { connect } from 'dva';
import {routerRedux} from 'dva/router';
import {isEmpty} from 'lodash';
import moment from 'moment';
import { Steps, Button, message, Input, Form, Radio, Icon, DatePicker } from 'antd';
import {postGoal, queryLike, postAuthor, postSummarize, postEvaluate, postConfirm, returntosummarize} from '../../../services/api';
import {formatTimeLess} from '../../../utils/timeUtil';
import styles from './style.less';

const FormItem = Form.Item;
const {TextArea} = Input;
const {Step} = Steps;
const RadioGroup = Radio.Group;
let stepRecord = [];
// const {confirm} = Modal;


@connect(state => ({
  probation: state.probation,
}))
class StepForm extends React.Component {
  state = {
    idNumber1: '',
    idNumber2: '',
    idNumber3: '',
    idNumber4: '',
    idNumber5: '',
    idNumber6: '',
    authorresult: '', // 员工定目标结果message
    attitude: '',
    attitudeValue: '',
    rank: '',
    rankValue: '',
    authorresultValue: '',
    evaluatecomment: '', // 主管评价2message
    summarize: '', // 员工总结message
    authorcoment: '', // 主管评价1message
    isZGYZ: '',
    isZJYZ: '',
    result9: '',
    result10: '',
  }
  componentDidMount() {
    this.fetchStepData(this.props.location.id);
  }
  getStepRecordId = (no) => {
    const {probation: {probationInfo}} = this.props;
    let stepId = '';
    if (!isEmpty(probationInfo.stepRecords)) {
      console.log('value: ', probationInfo.stepRecords);
      probationInfo.stepRecords.map((it) => {
        if (it.no === no) {
          stepId = it.id;
        } else {
          return null;
        }
      });
    } else {
      return null;
    }
    return stepId;
  }

  fetchStepData = (id) => { // 获取每个环节的信息
    if (!isEmpty(id)) {
      this.props.dispatch({
        type: 'probation/fetchStep',
        payload: id,
      });
    } else {
      this.props.dispatch(routerRedux.push('/tabs/probation/probation-table'));
    }
  }
  handleSubmitStep1 = (e) => { // 员工定目标表单提交
    const {probation: {probationInfo}} = this.props;
    const {idNumber1, idNumber2, idNumber3, idNumber4, idNumber5, idNumber6} = this.state;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let stepRecords = [];
      stepRecords = [
        {id: this.getStepRecordId('1'), recordid: this.props.location.id, no: '1', activity: values.measure1, oname: values.dutyPerson1, plan: values.accomplishDate1, oid: idNumber1},
        {id: this.getStepRecordId('2'), recordid: this.props.location.id, no: '2', activity: values.measure2, oname: values.dutyPerson2, plan: values.accomplishDate2, oid: idNumber2},
        {id: this.getStepRecordId('3'), recordid: this.props.location.id, no: '3', activity: values.measure3, oname: values.dutyPerson3, plan: values.accomplishDate3, oid: idNumber3},
        {id: this.getStepRecordId('4'), recordid: this.props.location.id, no: '4', activity: values.measure4, oname: values.dutyPerson4, plan: values.accomplishDate4, oid: idNumber4},
        {id: this.getStepRecordId('5'), recordid: this.props.location.id, no: '5', activity: values.measure5, oname: values.dutyPerson5, plan: values.accomplishDate5, oid: idNumber5},
        {id: this.getStepRecordId('6'), recordid: this.props.location.id, no: '6', activity: values.measure6, oname: values.dutyPerson6, plan: values.accomplishDate6, oid: idNumber6},
      ];
      probationInfo.stepRecords = stepRecords;
      probationInfo.trainRecord.goal = values.goal;
      probationInfo.trainPlan.totalgoal = values.totalgoal;
      probationInfo.employee.workPlace = values.workPlace;
      probationInfo.employee.directorName = values.directorName;
      probationInfo.employee.directorNumber = values.directorNumber;
      probationInfo.employee.mentorName = values.mentorName;
      probationInfo.employee.mentorNumber = values.mentorNumber;
      console.log('probationInfo: ', probationInfo);
      if (!err) {
        postGoal(probationInfo)
          .then((res) => {
            if (res.status === 'ok') {
              message.success('提交成功！');
              setTimeout(() => {
                this.props.dispatch(routerRedux.push('/tabs/probation/probation-table'));
              }, 1000);
            }
          });
      }
    });
  }
  handleSubmitStep2 = (e) => {
    e.preventDefault();
    const {probation: {probationInfo}} = this.props;
    probationInfo.trainRecord.authorresult = this.state.authorresultValue;
    probationInfo.trainRecord.authorcoment = e.target.authorcoment.value;
    // console.log('probationInfo: ', probationInfo.trainRecord);
    if (this.state.authorresultValue === '' || e.target.authorcoment.value === '') {
      if (this.state.authorresultValue === '') {
        this.setState({authorresult: '请输入结果'});
      }
      if (e.target.authorcoment.value === '') {
        this.setState({authorcoment: '请输入结果'});
      }
    } else {
      postAuthor(probationInfo.trainRecord)
        .then((res) => {
          if (res.status === 'ok') {
            message.success('提交成功！');
            setTimeout(() => {
              this.props.dispatch(routerRedux.push('/tabs/probation/probation-table'));
            }, 1000);
          }
        });
    }
  }
  handleSubmitStep3 = (e) => {
    e.preventDefault();
    const {probation: {probationInfo}} = this.props;
    probationInfo.trainRecord.summarize = e.target.summarize.value;
    probationInfo.stepRecords = stepRecord;
    if (e.target.summarize.value === '') {
      this.setState({summarize: '请输入结果'});
    } else {
      postSummarize(probationInfo)
        .then((res) => {
          if (res.status === 'ok') {
            message.success('提交成功！');
            setTimeout(() => {
              this.props.dispatch(routerRedux.push('/tabs/probation/probation-table'));
            }, 1000);
          }
        });
    }
  }
  handleSubmitStep4 = (e) => {
    e.preventDefault();
    const {probation: {probationInfo}} = this.props;
    probationInfo.trainRecord.rank = this.state.rankValue;
    probationInfo.trainRecord.attitude = this.state.attitudeValue;
    probationInfo.trainRecord.evaluatecomment = e.target.evaluatecomment.value;
    probationInfo.trainRecord.isZGYZ = this.state.isZGYZ;
    probationInfo.trainRecord.isZJYZ = this.state.isZJYZ;
    if (this.state.rankValue === '' || this.state.attitudeValue === '' || e.target.evaluatecomment.value === '' || this.state.isZGYZ === '' || this.state.isZJYZ === '') {
      console.log('rankValue: ', this.state.rankValue, 'attitudeValue: ', this.state.attitudeValue, 'evaluatecomment: ', e.target.evaluatecomment.value, 'result9: ', this.state.result9, 'result10: ', this.state.result10);
      if (this.state.rankValue === '') {
        this.setState({rank: '请输入结果！'});
      }
      if (this.state.attitudeValue === '') {
        this.setState({attitude: '请输入劳动态度！'});
      }
      if (e.target.evaluatecomment.value === '') {
        this.setState({evaluatecomment: '请输入主管评语！'});
      }
      if (this.state.isZGYZ === '') {
        this.setState({result9: '请确认是否与矩阵主管达成一致！'});
      }
      if (this.state.isZJYZ === '') {
        this.setState({result10: '请确认是否与总监达成一致！'});
      }
    } else {
      console.log('probationInfo: ', probationInfo.trainRecord);
      postEvaluate(probationInfo.trainRecord)
        .then((res) => {
          if (res.status === 'ok') {
            message.success('提交成功！');
            setTimeout(() => {
              this.props.dispatch(routerRedux.push('/tabs/probation/probation-table'));
            }, 1000);
          }
        });
    }
  }
  returnEvaluatecomment = () => {
    const {probation: {probationInfo}} = this.props;
    const idNo = probationInfo.trainRecord.id;
    returntosummarize(idNo)
      .then((res) => {
        console.log('res: ', res);
        if (res.status === 'ok') {
          this.props.dispatch(routerRedux('/tabs/probation/probation-table'));
        }
      });
  }
  handleSubmitStep5 = () => {
    const {probation: {probationInfo}} = this.props;
    postConfirm(probationInfo.trainRecord)
      .then((res) => {
        if (res.status === 'ok') {
          message.success('提交成功！');
          setTimeout(() => {
            this.props.dispatch(routerRedux.push('/tabs/probation/probation-table'));
          }, 1000);
        }
      });
  }
  handleChange1 = (e) => {
    if (e.target.value === '') {
      return null;
    }
    queryLike(e.target.value)
      .then((response) => {
        response.map((it) => {
          this.setState({idNumber1: it.employeeNumber})
        });
      });
  }
  handleChange2 = (e) => {
    if (e.target.value === '') {
      return null;
    }
    queryLike(e.target.value.trim())
      .then((response) => {
        response.map((it) => {
          this.setState({idNumber2: it.employeeNumber});
        });
      });
  }
  handleChange3 = (e) => {
    if (e.target.value === '') {
      return null;
    }
    queryLike(e.target.value.trim())
      .then((response) => {
        response.map((it) => {
          this.setState({idNumber3: it.employeeNumber});
        });
      });
  }
  handleChange4 = (e) => {
    if (e.target.value === '') {
      return null;
    }
    queryLike(e.target.value.trim())
      .then((response) => {
        response.map((it) => {
          this.setState({idNumber4: it.employeeNumber});
        });
      });
  }
  handleChange5 = (e) => {
    if (e.target.value === '') {
      return null;
    }
    queryLike(e.target.value.trim())
      .then((response) => {
        response.map((it) => {
          this.setState({idNumber5: it.employeeNumber});
        });
      });
  }
  handleChange6 = (e) => {
    if (e.target.value === '') {
      return null;
    }
    queryLike(e.target.value.trim())
      .then((response) => {
        response.map((it) => {
          this.setState({idNumber6: it.employeeNumber});
        });
      });
  }
  radioChange = (e) => {
    if (e.target.value !== '') {
      this.setState({authorresult: ''});
    }
    this.setState({authorresultValue: e.target.value});
  }
  radio2Change = (e) => {
    if (e.target.value !== '') {
      this.setState({rank: ''});
    }
    this.setState({rankValue: e.target.value});
  }
  radio3Change = (e) => {
    if (e.target.value !== '') {
      this.setState({attitude: ''});
    }
    this.setState({attitudeValue: e.target.value});
  }
  radio4Change = (e) => {
    if (e.target.value !== '') {
      this.setState({result9: ''});
    }
    this.setState({isZGYZ: e.target.value});
  }
  radio5Change = (e) => {
    if (e.target.value !== '') {
      this.setState({result10: ''});
    }
    console.log('e: ', e.target.value);
    this.setState({isZJYZ: e.target.value});
  }
  verify = (messages) => {
    if (message === '') {
      return null;
    }
    return (
      <span className={styles.verify}>{messages}</span>
    );
  }
  inputChange = (e) => {
    const tag = e.target.name;
    const tagValue = e.target.value;
    stepRecord[tag].result = tagValue;
    console.log('stepRecord: ', stepRecord);
  }
  changeVerify = (e) => { // 主管评语的onChange事件
    const resultValue = e.target.name;
    if (e.target.value !== '') {
      if (resultValue === 'authorcoment') {
        this.setState({authorcoment: ''});
      } else if (resultValue === 'result') {
        this.setState({authorresult: ''});
      } else if (resultValue === 'summarize') {
        this.setState({summarize: ''});
      } else if (resultValue === 'evaluatecomment') {
        this.setState({evaluatecomment: ''});
      }
    }
  }
  authorcoment = () => {
    const {probation: {probationInfo}} = this.props; // 员工基本信息表
    if (probationInfo.trainRecord.authorresult === '不通过') {
      return (
        <table style={{width: '90%', margin: '0 auto', borderTop: 'none'}} border="1">
          <tbody>
            <tr><td className={styles.bgcolorNow} colSpan="8">主管审核结果</td></tr>
            <tr>
              <td colSpan="8">
                审核结果：{probationInfo.trainRecord.authorresult}<br/>
                主管评语：<p style={{color: 'red', textIndent: '2em'}}>{probationInfo.trainRecord.authorcoment} </p>
              </td>
            </tr>
          </tbody>
        </table>
      );
    } else {
      return null;
    }
  }
  summarize = () => {
    const {probation: {probationInfo}} = this.props; // 员工基本信息表
    if (probationInfo.trainRecord.authorresult === '不通过') {
      return (
        <table style={{width: '90%', margin: '0 auto', borderTop: 'none'}} border="1">
          <tbody>
            <tr><td className={styles.bgcolorNow} colSpan="8">主管评价结果</td></tr>
            <tr>
              <td colSpan="8">
                <span style={{fontSize: '15px', fontWeight: '600'}}>绩效：</span>{probationInfo.trainRecord.rank}<br/>
                <span style={{fontSize: '15px', fontWeight: '600'}}>劳动态度：</span> {probationInfo.trainRecord.attitude}<br/>
                <span style={{fontSize: '15px', fontWeight: '600'}}>主管评语：</span> <p style={{textIndent: '2em'}}>{probationInfo.trainRecord.evaluatecomment}</p>
              </td>
            </tr>
          </tbody>
        </table>
      );
    } else {
      return null;
    }
  }
  showInfo = (value) => {
    if (value === undefined) {
      return '--';
    } else if (value === null) {
      return null;
    } else {
      return value;
    }
  }
  showDateInfo = (value) => {
    if (value === null) {
      return null;
    } else {
      return moment(value);
    }
  }
  basicInfo = () => {
    const {probation: {probationInfo}} = this.props; // 员工基本信息表
    if (!isEmpty(probationInfo)) {
      return (
        <table border="1" style={{width: '90%', margin: '0 auto'}} frame="vsides">
          <tbody>
            <tr height="35">
              <td colSpan="8" className={styles.bgcolor}>基本信息</td>
            </tr>
            <tr height="35" align="center">
              <td className={styles.name}>姓名</td>
              <td width="85">{probationInfo.trainPlan.empname}</td>
              <td width="95"className={styles.name}>工号</td>
              <td>{probationInfo.trainPlan.emid}</td>
              <td className={styles.name}>招聘类型</td>
              <td width="85">{probationInfo.employee.recruitmentType}</td>
              <td className={styles.name}>入职日期</td>
              <td>{formatTimeLess(probationInfo.employee.entryDate)}</td>
            </tr>
            <tr height="35" align="center">
              <td className={styles.name}>岗位</td>
              <td colSpan="2">{probationInfo.employee.station}</td>
              <td className={styles.name}>部门</td>
              <td colSpan="2">{probationInfo.employee.secondDepartment}</td>
              <td className={styles.name}>工作地</td>
              <td>{probationInfo.employee.workPlace}</td>
            </tr>
            <tr height="35" align="center">
              <td className={styles.name}>主管</td>
              <td>{probationInfo.employee.directorName}</td>
              <td className={styles.name}>工号</td>
              <td>{probationInfo.employee.directorNumber}</td>
              <td className={styles.name}>思想导师</td>
              <td>{probationInfo.employee.mentorName}</td>
              <td className={styles.name}>工号</td>
              <td>{probationInfo.employee.mentorNumber}</td>
            </tr>
            <tr height="35">
              <td className={styles.bgcolor} colSpan="8">试用期总体目标</td>
            </tr>
            <tr>
              <td colSpan="8" height="35">
                {probationInfo.trainPlan.totalgoal}
              </td>
            </tr>
            <tr height="35">
              <td colSpan="8" className={styles.bgcolor}>第{probationInfo.trainRecord.phase}阶段培养目标及计划（{formatTimeLess(probationInfo.trainRecord.starttime)} - {formatTimeLess(probationInfo.trainRecord.endtime)}）</td>
            </tr>
            <tr>
              <td width="121" align="center"><span style={{ fontSize: '15px', fontWeight: '600'}}>目标</span></td>
              <td colSpan="7" height="35px">
                {/* <TextArea value={probationInfo.trainRecord.goal} style={{paddingLeft: '5px'}} autosize={{ minRows: 2, maxRows: 20 }} disabled={true}/> */}
                {probationInfo.trainRecord.goal}
              </td>
            </tr>
          </tbody>
        </table>
      );
    }
  }
  step1 = () => { // 员工定目标环节页面显示代码
    const {getFieldDecorator} = this.props.form;
    const {probation: {probationInfo}} = this.props;
    if (!isEmpty(probationInfo)) {
      return (
        <div className={styles.content}>
          <Form onSubmit={this.handleSubmitStep1} name="step1">
            <table border="1" style={{width: '90%', margin: '0 auto', backgroundColor: '#fff'}}>
              <tbody>
                <tr height="35">
                  <td colSpan="8" className={styles.bgcolor}>基本信息</td>
                </tr>
                <tr height="35" align="center">
                  <td width="120" className={styles.name}>姓名</td>
                  <td width="120">{probationInfo.trainPlan.empname}</td>
                  <td width="120" className={styles.name}>工号</td>
                  <td width="120">{probationInfo.trainPlan.emid}</td>
                  <td className={styles.name}>招聘类型</td>
                  <td width="100">
                    {probationInfo.employee.recruitmentType}
                  </td>
                  <td className={styles.name}>入职日期</td>
                  <td>{formatTimeLess(probationInfo.employee.entryDate)}</td>
                </tr>
                <tr height="35" align="center">
                  <td className={styles.name}>岗位</td>
                  <td colSpan="2">{probationInfo.employee.station}</td>
                  <td className={styles.name}>部门</td>
                  <td colSpan="2">{probationInfo.employee.secondDepartment}</td>
                  <td className={styles.name}>工作地</td>
                  <td>
                    {probationInfo.employee.workPlace}
                  </td>
                </tr>
                <tr height="35" align="center">
                  <td className={styles.name}>主管</td>
                  <td>
                    {probationInfo.employee.directorName}
                  </td>
                  <td className={styles.name}>工号</td>
                  <td>
                    {probationInfo.employee.directorNumber}
                  </td>
                  <td className={styles.name}>思想导师</td>
                  <td>
                    {probationInfo.employee.mentorName}
                  </td>
                  <td className={styles.name}>工号</td>
                  <td>
                    {probationInfo.employee.mentorNumber}
                  </td>
                </tr>
                <tr height="35">
                  <td className={styles.bgcolorNow} colSpan="8">试用期总体目标</td>
                </tr>
                <tr>
                  <td colSpan="8">
                    <FormItem className={styles.formItem}>
                      {
                        getFieldDecorator('totalgoal', {
                         initialValue: probationInfo.trainPlan.totalgoal,
                         rules: [{required: true, message: '请输入试用期总体目标！'}], 
                        })(
                          <TextArea rows={3} className={styles.textArea} placeholder="（部门主管与试用期员工沟通后制定）"/>
                        )
                      }
                    </FormItem>
                  </td>
                </tr>
                <tr height="35">
                  <td colSpan="8" className={styles.bgcolorNow}>第{probationInfo.trainRecord.phase}阶段培养目标及计划（{formatTimeLess(probationInfo.trainRecord.starttime)} - {formatTimeLess(probationInfo.trainRecord.endtime)}）</td>
                </tr>
                <tr>
                  <td colSpan="8">
                    <FormItem className={styles.formItem}>
                    目标：<span style={{color: '#bbb'}}>（从能力提升、绩效成果及输出维度分别描述，充分沟通保证对目标和具体措施达成共识）</span>
                      {
                        getFieldDecorator('goal', {
                         initialValue: probationInfo.trainRecord.goal,
                         rules: [{required: true, message: '请输入阶段目标！'}],
                        })(
                          <TextArea rows={3} className={styles.textArea} />
                        )
                      }
                    </FormItem>
                  </td>
                </tr>
                <tr height="35" align="center">
                  <td colSpan="2" width="121">序号</td>
                  <td colSpan="4">具体措施</td>
                  <td colSpan="1">责任人</td>
                  <td colSpan="1">完成时间</td>
                </tr>
                <tr>
                  <td colSpan="2" align="center">
                    1
                  </td>
                  <td colSpan="4">
                    <FormItem className={styles.formItem}>
                      {
                        getFieldDecorator('measure1', {
                          initialValue: this.showInfo(probationInfo.stepRecords[0].activity),
                        })(
                          <Input className={styles.Input} autoComplete="off"/>
                        )
                      }
                    </FormItem>
                  </td>
                  <td colSpan="1">
                    <FormItem className={styles.formItem}>
                      {
                        getFieldDecorator('dutyPerson1', {
                          initialValue: this.showInfo(probationInfo.stepRecords[0].oname),
                        })(
                          <Input className={styles.Input} onChange={(e) => { this.handleChange1(e); }} autoComplete="off"/>
                        )
                      }
                    </FormItem>
                  </td>
                  <td colSpan="1">
                    <FormItem className={styles.formItem}>
                      {
                        getFieldDecorator('accomplishDate1', {
                         initialValue: this.showDateInfo(probationInfo.stepRecords[0].plan), 
                        })(
                          <DatePicker style={{width: '100%'}}/>
                        )
                      }
                    </FormItem>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" align="center">
                    2
                  </td>
                  <td colSpan="4">
                    <FormItem className={styles.formItem}>
                      {
                        getFieldDecorator('measure2', {
                         initialValue: this.showInfo(probationInfo.stepRecords[1].activity), 
                        })(
                          <Input className={styles.Input} autoComplete="off"/>
                        )
                      }
                    </FormItem>
                  </td>
                  <td colSpan="1">
                    <FormItem className={styles.formItem}>
                      {
                        getFieldDecorator('dutyPerson2', {
                          initialValue: this.showInfo(probationInfo.stepRecords[1].oname),
                        })(
                          <Input className={styles.Input} onChange={this.handleChange2} autoComplete="off"/>
                        )
                      }
                    </FormItem>
                  </td>
                  <td colSpan="1">
                    <FormItem className={styles.formItem}>
                      {
                        getFieldDecorator('accomplishDate2', {
                         initialValue: this.showDateInfo(probationInfo.stepRecords[1].plan), 
                        })(
                          <DatePicker style={{width: '100%'}}/>
                        )
                      }
                    </FormItem>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" align="center">
                    3
                  </td>
                  <td colSpan="4">
                    <FormItem className={styles.formItem}>
                      {
                        getFieldDecorator('measure3', {
                          initialValue: this.showInfo(probationInfo.stepRecords[2].activity),
                        })(
                          <Input className={styles.Input} autoComplete="off"/>
                        )
                      }
                    </FormItem>
                  </td>
                  <td colSpan="1">
                    <FormItem className={styles.formItem}>
                      {
                        getFieldDecorator('dutyPerson3', {
                         initialValue: this.showInfo(probationInfo.stepRecords[2].oname), 
                        })(
                          <Input className={styles.Input} onChange={this.handleChange3} autoComplete="off"/>
                        )
                      }
                    </FormItem>
                  </td>
                  <td colSpan="1">
                    <FormItem className={styles.formItem}>
                      {
                        getFieldDecorator('accomplishDate3', {
                          initialValue: this.showDateInfo(probationInfo.stepRecords[2].plan),
                        })(
                          <DatePicker style={{width: '100%'}}/>
                        )
                      }
                    </FormItem>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" align="center">
                    4
                  </td>
                  <td colSpan="4">
                    <FormItem className={styles.formItem}>
                      {
                        getFieldDecorator('measure4', {
                          initialValue: this.showInfo(probationInfo.stepRecords[3].activity),
                        })(
                          <Input className={styles.Input} autoComplete="off"/>
                        )
                      }
                    </FormItem>
                  </td>
                  <td colSpan="1">
                    <FormItem className={styles.formItem}>
                      {
                        getFieldDecorator('dutyPerson4', {
                          initialValue: this.showInfo(probationInfo.stepRecords[3].oname),
                        })(
                          <Input className={styles.Input} onChange={this.handleChange4} autoComplete="off"/>
                        )
                      }
                    </FormItem>
                  </td>
                  <td colSpan="1">
                    <FormItem className={styles.formItem}>
                      {
                        getFieldDecorator('accomplishDate4', {
                          initialValue: this.showDateInfo(probationInfo.stepRecords[3].plan),
                        })(
                          <DatePicker style={{width: '100%'}} />
                        )
                      }
                    </FormItem>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" align="center">
                    5
                  </td>
                  <td colSpan="4">
                    <FormItem className={styles.formItem}>
                      {
                        getFieldDecorator('measure5', {
                         initialValue: this.showInfo(probationInfo.stepRecords[4].activity), 
                        })(
                          <Input className={styles.Input} autoComplete="off"/>
                        )
                      }
                    </FormItem>
                  </td>
                  <td colSpan="1">
                    <FormItem className={styles.formItem}>
                      {
                        getFieldDecorator('dutyPerson5', {
                          initialValue: this.showInfo(probationInfo.stepRecords[4].oname),
                        })(
                          <Input className={styles.Input} onChange={this.handleChange5}/>
                        )
                      }
                    </FormItem>
                  </td>
                  <td colSpan="1">
                    <FormItem className={styles.formItem}>
                      {
                        getFieldDecorator('accomplishDate5', {
                          initialValue: this.showDateInfo(probationInfo.stepRecords[4].plan),
                        })(
                          <DatePicker style={{width: '100%'}}/>
                        )
                      }
                    </FormItem>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" align="center">
                    6
                  </td>
                  <td colSpan="4">
                    <FormItem className={styles.formItem}>
                      {
                        getFieldDecorator('measure6', {
                          initialValue: this.showInfo(probationInfo.stepRecords[5].activity),
                        })(
                          <Input className={styles.Input} autoComplete="off"/>
                        )
                      }
                    </FormItem>
                  </td>
                  <td colSpan="1">
                    <FormItem className={styles.formItem}>
                      {
                        getFieldDecorator('dutyPerson6', {
                          initialValue: this.showInfo(probationInfo.stepRecords[5].oname),
                        })(
                          <Input className={styles.Input} onChange={this.handleChange6} autoComplete="off"/>
                        )
                      }
                    </FormItem>
                  </td>
                  <td colSpan="1">
                    <FormItem className={styles.formItem}>
                      {
                        getFieldDecorator('accomplishDate6', {
                         initialValue: this.showDateInfo(probationInfo.stepRecords[5].plan), 
                        })(
                          <DatePicker style={{width: '100%'}}/>
                        )
                      }
                    </FormItem>
                  </td>
                </tr>
              </tbody>
            </table>
            {this.authorcoment()}
            <FormItem>
              <Button
                style={{width: '200px', margin: '20px auto', display: 'block'}}
                type="primary"
                htmlType="submit"
              >
                提交
              </Button>
            </FormItem>
          </Form>
        </div>
      );
    }
    // } else {
    //   console.log('aaaaaaaa: ', probationInfo.stepRecords);
    //     return (
    //     <div className={styles.content}>
    //       <Form onSubmit={this.handleSubmitStep1} name="step1">
    //         <table border="1" style={{width: '90%', margin: '0 auto', backgroundColor: '#fff'}}>
    //           <tbody>
    //             <tr height="35">
    //               <td colSpan="8" className={styles.bgcolor}>基本信息</td>
    //             </tr>
    //             <tr height="35" align="center">
    //               <td width="120" className={styles.name}>姓名</td>
    //               <td width="120">{probationInfo.trainPlan.empname}</td>
    //               <td width="120" className={styles.name}>工号</td>
    //               <td width="120">{probationInfo.trainPlan.emid}</td>
    //               <td className={styles.name}>招聘类型</td>
    //               <td width="120">
    //                 {probationInfo.employee.recruitmentType}
    //               </td>
    //               <td className={styles.name}>入职日期</td>
    //               <td>{formatTimeLess(probationInfo.employee.entryDate)}</td>
    //             </tr>
    //             <tr height="35" align="center">
    //               <td className={styles.name}>岗位</td>
    //               <td colSpan="2">{probationInfo.employee.station}</td>
    //               <td className={styles.name}>部门</td>
    //               <td colSpan="2">{probationInfo.employee.secondDepartment}</td>
    //               <td className={styles.name}>工作地</td>
    //               <td>
    //                 {probationInfo.employee.workPlace}
    //               </td>
    //             </tr>
    //             <tr height="35" align="center">
    //               <td className={styles.name}>主管</td>
    //               <td>
    //                 {probationInfo.employee.directorName}
    //               </td>
    //               <td className={styles.name}>工号</td>
    //               <td>
    //                 {probationInfo.employee.directorNumber}
    //               </td>
    //               <td className={styles.name}>思想导师</td>
    //               <td>
    //                 {probationInfo.employee.mentorName}
    //               </td>
    //               <td className={styles.name}>工号</td>
    //               <td>
    //                 {probationInfo.employee.mentorNumber}
    //               </td>
    //             </tr>
    //             <tr height="35">
    //               <td className={styles.bgcolorNow} colSpan="8">试用期总体目标</td>
    //             </tr>
    //             <tr>
    //               <td colSpan="8">
    //                 <FormItem className={styles.formItem}>
    //                   {
    //                     getFieldDecorator('totalgoal', {
    //                      initialValue: probationInfo.trainPlan.totalgoal,
    //                      rules: [{required: true, message: '请填写该阶段总体目标'}], 
    //                     })(
    //                       <TextArea rows={3} className={styles.textArea} placeholder="（部门主管与试用期员工沟通后制定）"/>
    //                     )
    //                   }
    //                 </FormItem>
    //               </td>
    //             </tr>
    //             <tr height="35">
    //               <td colSpan="8" className={styles.bgcolorNow}>第{probationInfo.trainRecord.phase}阶段培养目标及计划（{formatTimeLess(probationInfo.trainRecord.starttime)} - {formatTimeLess(probationInfo.trainRecord.endtime)}）</td>
    //             </tr>
    //             <tr>
    //               <td colSpan="8">
    //                 <FormItem className={styles.formItem}>
    //                 目标：<span style={{color: '#bbb'}}>（从能力提升、绩效成果及输出维度分别描述，充分沟通保证对目标和具体措施达成共识）</span>
    //                   {
    //                     getFieldDecorator('goal', {
    //                      initialValue: probationInfo.trainRecord.goal,
    //                      rules: [{required: true, message: '请输入阶段目标！'}], 
    //                     })(
    //                       <TextArea rows={3} className={styles.textArea} />
    //                     )
    //                   }
    //                 </FormItem>
    //               </td>
    //             </tr>
    //             <tr height="35" align="center">
    //               <td colSpan="2">序号</td>
    //               <td colSpan="4">具体措施</td>
    //               <td colSpan="1">责任人</td>
    //               <td colSpan="1">完成时间</td>
    //             </tr>
    //             <tr>
    //               <td colSpan="2" align="center">
    //                 1
    //               </td>
    //               <td colSpan="4">
    //                 <FormItem className={styles.formItem}>
    //                   {
    //                     getFieldDecorator('measure1', {
    //                       initialValue: '',
    //                     })(
    //                       <Input className={styles.Input} autoComplete="off"/>
    //                     )
    //                   }
    //                 </FormItem>
    //               </td>
    //               <td colSpan="1">
    //                 <FormItem className={styles.formItem}>
    //                   {
    //                     getFieldDecorator('dutyPerson1', {
    //                       initialValue: '',
    //                     })(
    //                       <Input className={styles.Input} onChange={(e) => { this.handleChange1(e); }}/>
    //                     )
    //                   }
    //                 </FormItem>
    //               </td>
    //               <td colSpan="1">
    //                 <FormItem className={styles.formItem}>
    //                   {
    //                     getFieldDecorator('accomplishDate1', {
    //                       initialValue: null,
    //                     })(
    //                       <DatePicker style={{width: '100%'}}/>
    //                     )
    //                   }
    //                 </FormItem>
    //               </td>
    //             </tr>
    //             <tr>
    //               <td colSpan="2" align="center">
    //                 2
    //               </td>
    //               <td colSpan="4">
    //                 <FormItem className={styles.formItem}>
    //                   {
    //                     getFieldDecorator('measure2', {
    //                       initialValue: '',
    //                     })(
    //                       <Input className={styles.Input} autoComplete="off"/>
    //                     )
    //                   }
    //                 </FormItem>
    //               </td>
    //               <td colSpan="1">
    //                 <FormItem className={styles.formItem}>
    //                   {
    //                     getFieldDecorator('dutyPerson2', {
    //                       initialValue: '',
    //                     })(
    //                       <Input className={styles.Input} onChange={this.handleChange2}/>
    //                     )
    //                   }
    //                 </FormItem>
    //               </td>
    //               <td colSpan="1">
    //                 <FormItem className={styles.formItem}>
    //                   {
    //                     getFieldDecorator('accomplishDate2', {
    //                       initialValue: null,
    //                     })(
    //                       <DatePicker style={{width: '100%'}}/>
    //                     )
    //                   }
    //                 </FormItem>
    //               </td>
    //             </tr>
    //             <tr>
    //               <td colSpan="2" align="center">
    //                 3
    //               </td>
    //               <td colSpan="4">
    //                 <FormItem className={styles.formItem}>
    //                   {
    //                     getFieldDecorator('measure3', {
    //                       initialValue: '',
    //                     })(
    //                       <Input className={styles.Input} autoComplete="off"/>
    //                     )
    //                   }
    //                 </FormItem>
    //               </td>
    //               <td colSpan="1">
    //                 <FormItem className={styles.formItem}>
    //                   {
    //                     getFieldDecorator('dutyPerson3', {
    //                       initialValue: '',
    //                     })(
    //                       <Input className={styles.Input} onChange={this.handleChange3} autoComplete="off"/>
    //                     )
    //                   }
    //                 </FormItem>
    //               </td>
    //               <td colSpan="1">
    //                 <FormItem className={styles.formItem}>
    //                   {
    //                     getFieldDecorator('accomplishDate3', {
    //                       initialValue: null,
    //                     })(
    //                       <DatePicker style={{width: '100%'}}/>
    //                     )
    //                   }
    //                 </FormItem>
    //               </td>
    //             </tr>
    //             <tr>
    //               <td colSpan="2" align="center">
    //                 4
    //               </td>
    //               <td colSpan="4">
    //                 <FormItem className={styles.formItem}>
    //                   {
    //                     getFieldDecorator('measure4', {
    //                       initialValue: '',
    //                     })(
    //                       <Input className={styles.Input} autoComplete="off"/>
    //                     )
    //                   }
    //                 </FormItem>
    //               </td>
    //               <td colSpan="1">
    //                 <FormItem className={styles.formItem}>
    //                   {
    //                     getFieldDecorator('dutyPerson4', {
    //                       initialValue: '',
    //                     })(
    //                       <Input className={styles.Input} onChange={this.handleChange4} autoComplete="off"/>
    //                     )
    //                   }
    //                 </FormItem>
    //               </td>
    //               <td colSpan="1">
    //                 <FormItem className={styles.formItem}>
    //                   {
    //                     getFieldDecorator('accomplishDate4', {
    //                       initialValue: null,
    //                     })(
    //                       <DatePicker style={{width: '100%'}}/>
    //                     )
    //                   }
    //                 </FormItem>
    //               </td>
    //             </tr>
    //             <tr>
    //               <td colSpan="2" align="center">
    //                 5
    //               </td>
    //               <td colSpan="4">
    //                 <FormItem className={styles.formItem}>
    //                   {
    //                     getFieldDecorator('measure5', {
    //                       initialValue: '',
    //                     })(
    //                       <Input className={styles.Input} autoComplete="off"/>
    //                     )
    //                   }
    //                 </FormItem>
    //               </td>
    //               <td colSpan="1">
    //                 <FormItem className={styles.formItem}>
    //                   {
    //                     getFieldDecorator('dutyPerson5', {
    //                       initialValue: '',
    //                     })(
    //                       <Input className={styles.Input} onChange={this.handleChange5}/>
    //                     )
    //                   }
    //                 </FormItem>
    //               </td>
    //               <td colSpan="1">
    //                 <FormItem className={styles.formItem}>
    //                   {
    //                     getFieldDecorator('accomplishDate5', {
    //                       initialValue: null,
    //                     })(
    //                       <DatePicker style={{width: '100%'}}/>
    //                     )
    //                   }
    //                 </FormItem>
    //               </td>
    //             </tr>
    //             <tr>
    //               <td colSpan="2" align="center">
    //                 6
    //               </td>
    //               <td colSpan="4">
    //                 <FormItem className={styles.formItem}>
    //                   {
    //                     getFieldDecorator('measure6', {
    //                       initialValue: '',
    //                     })(
    //                       <Input className={styles.Input} autoComplete="off"/>
    //                     )
    //                   }
    //                 </FormItem>
    //               </td>
    //               <td colSpan="1">
    //                 <FormItem className={styles.formItem}>
    //                   {
    //                     getFieldDecorator('dutyPerson6', {
    //                       initialValue: '',
    //                     })(
    //                       <Input className={styles.Input} onChange={this.handleChange6} autoComplete="off"/>
    //                     )
    //                   }
    //                 </FormItem>
    //               </td>
    //               <td colSpan="1">
    //                 <FormItem className={styles.formItem}>
    //                   {
    //                     getFieldDecorator('accomplishDate6', {
    //                       initialValue: null,
    //                     })(
    //                       <DatePicker style={{width: '100%'}}/>
    //                     )
    //                   }
    //                 </FormItem>
    //               </td>
    //             </tr>
    //           </tbody>
    //         </table>
    //         {this.authorcoment()}
    //         <FormItem>
    //           <Button
    //             style={{width: '200px', margin: '20px auto', display: 'block'}}
    //             type="primary"
    //             htmlType="submit"
    //           >
    //             提交
    //           </Button>
    //         </FormItem>
    //       </Form>
    //     </div>
    //   );
    // }
  }
  dataMap = (sheet = 'none', isValue = false) => {
    const {probation: {probationInfo}} = this.props;
    if (!isEmpty(probationInfo)) {
      return probationInfo.stepRecords.map((it, i) => {
        if (it.activity === null) {
          return null;
        }
        return (
          <tr style={{cursor: 'pointer'}} key={it.id}>
            <td colSpan="1" align="center" className={styles.cuoshi} width="121">
              {it.no}
            </td>
            <td colSpan="4" className={styles.cuoshi}>
              {it.activity}
            </td>
            <td colSpan="2" align="center" className={styles.cuoshi}>
              {it.oname}
            </td>
            <td colSpan="1" align="center" className={styles.cuoshi}>
              {formatTimeLess(it.plan)}
            </td>
            <td colSpan="1" align="center" className={styles.cuoshi} style={{display: sheet}}>
              {
                isValue ? it.result : <Input name={i} placeholder="请输入完成情况" style={{border: 'none'}} onChange={this.inputChange}/>
              }
            </td>
          </tr>
        );
      });
    }
  }
  step2 = () => { // 主管审核环节页面显示代码
    return (
      <div className={styles.content}>
        {this.basicInfo()}
        <form onSubmit={this.handleSubmitStep2}>
          <table border="1" style={{width: '90%', margin: '0 auto'}}>
            <tbody>
              <tr>
                <td colSpan="1" align="center" className={styles.cuoshi} style={{fontSize: '15px', fontWeight: '600'}} width="121">序号</td>
                <td colSpan="4" align="center" className={styles.cuoshi} style={{fontSize: '15px', fontWeight: '600', width: '200px'}}>具体措施</td>
                <td colSpan="2" align="center" className={styles.cuoshi} style={{fontSize: '15px', fontWeight: '600', width: '100px'}}>责任人</td>
                <td colSpan="1" align="center" className={styles.cuoshi} style={{fontSize: '15px', fontWeight: '600', width: '200px'}}>完成时间</td>
              </tr>
              {this.dataMap()}
              <tr><td className={styles.bgcolorNow} colSpan="8">主管审核</td></tr>
              <tr>
                <td colSpan="8">
                  <FormItem className={styles.formItem} >
                    是否进入下一环节：
                    <RadioGroup name="authorresult" onChange={this.radioChange}>
                      <Radio value="通过" name="radio1">同意</Radio>
                      <Radio value="不通过" name="radio2">不同意</Radio>
                    </RadioGroup>
                    {this.verify(this.state.authorresult)}
                  </FormItem>
                  <FormItem className={styles.formItem}>
                    主管评语：
                    <TextArea rows={3} className={styles.textArea} name="authorcoment" onChange={this.changeVerify}/>
                    {this.verify(this.state.authorcoment)}
                  </FormItem>
                </td>
              </tr>
            </tbody>
          </table>
          <FormItem>
            <Button
              style={{width: '200px', margin: '20px auto', display: 'block'}}
              type="primary"
              htmlType="submit"
            >
                提交
            </Button>
          </FormItem>
        </form>
      </div>
    );
  }
  step3 = () => { // 员工总结环节页面显示代码
    const {probation: {probationInfo}} = this.props;
    stepRecord = probationInfo.stepRecords;
    if (!isEmpty(probationInfo)) {
      return (
        <div className={styles.content}>
          {this.basicInfo()}
          <form onSubmit={this.handleSubmitStep3}>
            <table border="1" style={{width: '90%', margin: '0 auto'}}>
              <tbody>
                <tr>
                  <td colSpan="1" align="center" className={styles.cuoshi} style={{fontSize: '15px', fontWeight: '600'}} width="121">序号</td>
                  <td colSpan="4" align="center" className={styles.cuoshi} style={{fontSize: '15px', fontWeight: '600', width: '100px'}}>具体措施</td>
                  <td colSpan="2" align="center" className={styles.cuoshi} style={{fontSize: '15px', fontWeight: '600'}}>责任人</td>
                  <td colSpan="1" align="center" className={styles.cuoshi} style={{fontSize: '15px', fontWeight: '600', width: '200px'}}>完成时间</td>
                  <td colSpan="1" align="center" className={styles.cuoshi} style={{fontSize: '15px', fontWeight: '600', width: '200px'}}>完成情况</td>
                </tr>
                {this.dataMap('bolck')}
                <tr><td className={styles.bgcolor} colSpan="9" >主管确认计划</td></tr>
                <tr><td colSpan="8" height="35" className={styles.indent}>{probationInfo.trainRecord.authorcoment}</td></tr>
                <tr><td className={styles.bgcolorNow} colSpan="9">员工总结</td></tr>
                <tr>
                  <td colSpan="9">
                    <FormItem className={styles.formItem}>
                    员工总结：<span style={{color: '#bbb'}}>（员工从绩效产出、个人技能提升、团队贡献、下一阶段改进方向等方面总结给出）</span>
                      <TextArea rows={3} className={styles.textArea} name="summarize" onChange={this.changeVerify} />
                      {this.verify(this.state.summarize)}
                    </FormItem>
                  </td>
                </tr>
              </tbody>
            </table>
            <FormItem>
              <Button
                style={{width: '200px', margin: '20px auto', display: 'block'}}
                type="primary"
                htmlType="submit"
              >
                  提交
              </Button>
            </FormItem>
          </form>
        </div>
      );
    }
  }
  step4 = () => { // 主管评价环节页面显示
    const {probation: {probationInfo}} = this.props;
    if (!isEmpty(probationInfo)) {
      return (
        <div className={styles.content}>
          {this.basicInfo()}
          <form onSubmit={this.handleSubmitStep4}>
            <table border="1" style={{width: '90%', margin: '0 auto'}}>
              <tbody>
                <tr>
                  <td colSpan="1" align="center" className={styles.cuoshi} style={{fontSize: '15px', fontWeight: '600'}} width="121">序号</td>
                  <td colSpan="4" align="center" className={styles.cuoshi} style={{fontSize: '15px', fontWeight: '600', width: '100px'}}>具体措施</td>
                  <td colSpan="2" align="center" className={styles.cuoshi} style={{fontSize: '15px', fontWeight: '600'}}>责任人</td>
                  <td colSpan="1" align="center" className={styles.cuoshi} style={{fontSize: '15px', fontWeight: '600', width: '200px'}}>完成时间</td>
                  <td colSpan="1" align="center" className={styles.cuoshi} style={{fontSize: '15px', fontWeight: '600', width: '200px'}}>完成情况</td>
                </tr>
                {this.dataMap('inlineBlock', true)}
                <tr><td className={styles.bgcolor} colSpan="9">员工总结</td></tr>
                <tr height="35">
                  <td colSpan="9" >
                    <span style={{fontSize: '15px', fontWeight: '600'}}>员工总结：</span> <p style={{textIndent: '2em'}}>{probationInfo.trainRecord.summarize}</p>
                    {/* {probationInfo.trainRecord.summarize} */}
                    {/* <TextArea value={probationInfo.trainRecord.summarize} style={{paddingLeft: '5px'}} autosize={{ minRows: 2, maxRows: 20 }}/> */}
                  </td>
                </tr>
                <tr><td className={styles.bgcolorNow} colSpan="9">主管评价</td></tr>
                <tr>
                  <td colSpan="9">
                    <FormItem className={styles.formItem} >
                      绩效：
                      <RadioGroup name="rank" onChange={this.radio2Change}>
                        <Radio value="A">A优秀</Radio>
                        <Radio value="B+">B+良好</Radio>
                        <Radio value="B">B达标</Radio>
                        <Radio value="B-">B-勉强达标</Radio>
                        <Radio value="C">C待改进</Radio>
                        <Radio value="D">D不可接受</Radio>
                      </RadioGroup>
                      {this.verify(this.state.rank)}
                    </FormItem>
                    <FormItem className={styles.formItem} >
                      劳动态度：
                      <RadioGroup name="attitude" onChange={this.radio3Change}>
                        <Radio value="良好">良好</Radio>
                        <Radio value="符合">符合</Radio>
                        <Radio value="需改进">需改进</Radio>
                        <Radio value="不可接受">不可接受</Radio>
                      </RadioGroup>
                      {this.verify(this.state.attitude)}
                    </FormItem>
                    <FormItem className={styles.formItem}>
                      已与矩阵主管沟通并达成一致：
                      <RadioGroup name="result9" onChange={this.radio4Change}>
                        <Radio value="是">是</Radio>
                        <Radio value="不涉及">不涉及</Radio>
                      </RadioGroup>
                      {this.verify(this.state.result9)}
                    </FormItem>
                    <FormItem className={styles.formItem}>
                      已与总监沟通并达成一致：
                      <RadioGroup name="result10" onChange={this.radio5Change}>
                        <Radio value="是">是</Radio>
                        <Radio value="不涉及">不涉及</Radio>
                      </RadioGroup>
                      {this.verify(this.state.result10)}
                    </FormItem>
                    <FormItem className={styles.formItem}>
                    主管评语：
                      <TextArea rows={3} className={styles.textArea} name="evaluatecomment" onChange={this.changeVerify}/>
                      {this.verify(this.state.evaluatecomment)}
                    </FormItem>
                  </td>
                </tr>
              </tbody>
            </table>
            <FormItem style={{textAlign: 'center', height: '90px', paddingTop: '30px'}}>
              <Button
                style={{width: '200px', marginRight: '20px'}}
                type="primary"
                htmlType="submit"
              >
                  提交
              </Button>
              <Button
                style={{width: '200px'}}
                type="danger"
                onClick={this.returnEvaluatecomment}
              >
                  驳回
              </Button>
            </FormItem>
          </form>
        </div>
      );
    }
  }
  step5 = () => { // 员工确认阶段页面展示
    const {probation: {probationInfo}} = this.props;
    if (!isEmpty(probationInfo)) {
      return (
        <div className={styles.content}>
          {this.basicInfo()}
          <form>
            <table border="1" style={{width: '90%', margin: '0 auto'}}>
              <tbody>
                <tr><td className={styles.bgcolor} colSpan="8">主管评价</td></tr>
                <tr>
                  <td colSpan="8">
                    <span style={{fontSize: '15px', fontWeight: '600'}}>绩效：</span>{probationInfo.trainRecord.rank}<br/>
                    <span style={{fontSize: '15px', fontWeight: '600'}}>劳动态度：</span> {probationInfo.trainRecord.attitude}<br/>
                    <span style={{fontSize: '15px', fontWeight: '600'}}>主管评语：</span> <p style={{textIndent: '2em'}}>{probationInfo.trainRecord.evaluatecomment}</p>
                  </td>
                </tr>
                <tr><td className={styles.bgcolorNow} colSpan="8">员工确认（已就主管评价达成一致）</td></tr>
              </tbody>
            </table>
            <FormItem>
              <Button
                style={{width: '200px', margin: '20px auto', display: 'block'}}
                type="primary"
                onClick={this.handleSubmitStep5}
              >
                  确认
              </Button>
            </FormItem>
          </form>
        </div>
      );
    }
  }
  stepLast = () => {
    const {probation: {probationInfo}} = this.props;
    return (
      <div className={styles.successDiv}>
        <div style={{textAlign: 'center'}}>
          <Icon className={styles.success} type="check-circle" />
          <span className={styles.successFont}>第{probationInfo.trainRecord.phase}阶段已完成</span>
        </div>
        {this.basicInfo()}
        <form onSubmit={this.handleSubmitStep2}>
          <table border="1" style={{width: '90%', margin: '0 auto'}}>
            <tbody>
              <tr>
                <td colSpan="1" align="center" className={styles.cuoshi} style={{fontSize: '15px', fontWeight: '600'}} width="121">序号</td>
                <td colSpan="4" align="center" className={styles.cuoshi} style={{fontSize: '15px', fontWeight: '600'}}>具体措施</td>
                <td colSpan="2" align="center" className={styles.cuoshi} style={{fontSize: '15px', fontWeight: '600'}}>责任人</td>
                <td colSpan="1" align="center" className={styles.cuoshi} style={{fontSize: '15px', fontWeight: '600'}}>完成时间</td>
              </tr>
              {this.dataMap()}
              <tr><td className={styles.bgcolor} colSpan="8" >主管确认计划</td></tr>
              <tr><td colSpan="8" height="35" className={styles.indent}>{probationInfo.trainRecord.authorcoment}</td></tr>
              <tr><td className={styles.bgcolor} colSpan="8">员工总结</td></tr>
              <tr height="35">
                <td colSpan="8" >
                  <span style={{fontSize: '15px', fontWeight: '600'}}>完成情况： </span>probationInfo.trainRecord.rank<br/>
                  <span style={{fontSize: '15px', fontWeight: '600'}}>员工总结：</span> <p style={{textIndent: '2em'}}>{probationInfo.trainRecord.summarize}</p>
                  {/* <TextArea value={probationInfo.trainRecord.summarize} style={{paddingLeft: '5px'}} autosize={{ minRows: 2, maxRows: 20 }}/> */}
                  {/* {probationInfo.trainRecord.summarize} */}
                </td>
              </tr>
              <tr><td className={styles.bgcolor} colSpan="8">主管评价</td></tr>
              <tr>
                <td colSpan="8">
                  <span style={{fontSize: '15px', fontWeight: '600'}}>绩效：</span>{probationInfo.trainRecord.rank}<br/>
                  <span style={{fontSize: '15px', fontWeight: '600'}}>劳动态度：</span> {probationInfo.trainRecord.attitude}<br/>
                  <span style={{fontSize: '15px', fontWeight: '600'}}>主管评语：</span> <p style={{textIndent: '2em'}}>{probationInfo.trainRecord.evaluatecomment}</p>
                </td>
              </tr>
            </tbody>
          </table>
          <FormItem>
            <Button
              style={{width: '200px', margin: '20px auto', display: 'block'}}
              type="primary"
              onClick={() => this.props.dispatch(routerRedux.push('/tabs/probation/probation-table'))}
            >
                返回
            </Button>
          </FormItem>
        </form>
      </div>
    );
  }
  // PageHeader = () => {
  //   return (
  //     <div style={{width: '70%', backgroundColor: '#fff', margin: '0 auto'}}>
  //       <table border="1" style={{width: '100%'}}>
  //         <tbody>
  //           <tr>
  //             <td colSpan="8">基本信息</td>
  //           </tr>
  //           <tr>
  //             <td>姓名</td>
  //             <td>冯宝宝</td>
  //             <td>工号</td>
  //             <td>8105623</td>
  //             <td>招聘类型</td>
  //             <td>社招</td>
  //             <td>入职日期</td>
  //             <td>2018-9-20</td>
  //           </tr>
  //           <tr>
  //             <td>姓名</td>
  //             <td>冯宝宝</td>
  //             <td>工号</td>
  //             <td>8105623</td>
  //             <td>招聘类型</td>
  //             <td>社招</td>
  //             <td>入职日期</td>
  //             <td>2018-9-20</td>
  //           </tr>
  //           <tr>
  //             <td>姓名</td>
  //             <td>冯宝宝</td>
  //             <td>工号</td>
  //             <td>8105623</td>
  //             <td>招聘类型</td>
  //             <td>社招</td>
  //             <td>入职日期</td>
  //             <td>2018-9-20</td>
  //           </tr>
  //           <tr>
  //             <td>试用期总体目标</td>
  //             <td colSpan="7">冯宝宝</td>
  //           </tr>
  //         </tbody>
  //       </table>
  //     </div>
  //   );
  // }
  render() {
    const {probation: {probationInfo}} = this.props;
    let current = 0;
    let stepStatus = '';
    if (!isEmpty(probationInfo.trainRecord)) {
      if (probationInfo.trainRecord.status === '待员工制定目标') {
        current = 0;
        if (probationInfo.trainRecord.authorresult === '不通过') {
          stepStatus = 'error';
        }
      } else if (probationInfo.trainRecord.status === '待主管审核') {
        current = 1;
      } else if (probationInfo.trainRecord.status === '待员工阶段总结') {
        current = 2;
        if (probationInfo.trainRecord.evaluateResult === '驳回') {
          stepStatus = 'error';
        }
      } else if (probationInfo.trainRecord.status === '待主管评价') {
        current = 3;
      } else if (probationInfo.trainRecord.status === '待员工确认') {
        current = 4;
      } else {
        current = 5;
      }
    } else {
      return (
        <div><header>不知道原因啊！！！！！！</header></div>
      );
    }
    const steps = [{
      title: '员工定目标',
      content: this.step1(),
    }, {
      title: '主管审核',
      content: this.step2(),
    }, {
      title: '员工总结',
      content: this.step3(),
    }, {
      title: '主管评价',
      content: this.step4(),
    }, {
      title: '员工确认',
      content: this.step5(),
    }, {
      title: '完成',
      content: this.stepLast(),
    }];
    // const { current } = this.state;
    return (
      <div>
        {/* {this.PageHeader()} */}
        <div style={{width: '100%', margin: '0 auto', padding: '35px'}}>
          <Steps current={current} status={stepStatus} className={styles.Steps}>
            {steps.map(item => <Step key={item.title} title={item.title}/>)}
          </Steps>
          <div className="steps-content">{steps[current].content}</div>
        </div>
      </div>
    );
  }
}

export default Form.create({})(StepForm);

