import React, {Component} from 'react';
import {connect} from 'dva';
import {Anchor, Card, Divider, Table} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './Profile.less';
import {renderRoute} from '../../utils/routeUtil';
import {formatTimeLess} from '../../utils/timeUtil';

const {Description} = DescriptionList;
const {Link} = Anchor;

@connect(state => ({
  profile: state.profile,
  currentUser: state.user.currentUser,
}))

export default class Profile extends Component {
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'profile/fetchEmployee',
      // payload: this.props.currentUser.userid,
    });
  }

  getAge = (idNo) => {
    if (!idNo) {
      return null;
    }
    const newDate = new Date();
    const month = newDate.getMonth() + 1;
    const day = newDate.getDate();
    let age = newDate.getFullYear() - idNo.substring(6, 10) - 1;
    if (idNo.substring(10, 12) < month || idNo.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
      age++;
    }
    return age;
  };

  renderContent = () => {
    const {profile} = this.props;
    // console.log(profile);

    const educationExperience = [{
      title: '就学期间',
      dataIndex: 'studyRange',
      key: 'studyRange',
    }, {
      title: '学校名称',
      dataIndex: 'schoolName',
      key: 'schoolName',
    }, {
      title: '专业',
      dataIndex: 'major',
      key: 'major',
    }, {
      title: '学位',
      dataIndex: 'degree',
      key: 'degree',
    }, {
      title: '学历',
      dataIndex: 'background',
      key: 'background',
    }, {
      title: '是否统招',
      dataIndex: 'unified',
      key: 'unified',
    }, {
      title: '学习方式',
      dataIndex: 'studyType',
      key: 'studyType',
    }];

    const jobChange = [{
      title: '变动前部门',
      dataIndex: 'preDepartment',
      key: 'preDepartment',
    }, {
      title: '变动后部门',
      dataIndex: 'folDepartment',
      key: 'folDepartment',
    }, {
      title: '变动前岗位',
      dataIndex: 'preJob',
      key: 'preJob',
    }, {
      title: '变动后岗位',
      dataIndex: 'folJob',
      key: 'folJob',
    }, {
      title: '变动生效时间',
      dataIndex: 'occurrenceTime',
      key: 'occurrenceTime',
    }];

    const familyInformation = [{
      title: '家庭成员姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '家庭成员出生日期',
      dataIndex: 'birthday',
      key: 'birthday',
    }, {
      title: '家庭成员工作单位',
      dataIndex: 'companyName',
      key: 'companyName',
    }, {
      title: '家庭成员职业',
      dataIndex: 'job',
      key: 'job',
    }, {
      title: '家庭成员与本人关系',
      dataIndex: 'relationship',
      key: 'relationship',
    }];

    const workExperience = [{
      title: '单位名称',
      dataIndex: 'companyName',
      key: 'companyName',
    }, {
      title: '起止时间',
      dataIndex: 'period',
      key: 'period',
    }, {
      title: '岗位',
      dataIndex: 'job',
      key: 'job',
    }, {
      title: '主要指责',
      dataIndex: 'duty',
      key: 'duty',
    }];

    const performanceInformation = [{
      title: '考核周期',
      dataIndex: 'period',
      key: 'period',
    }, {
      title: '绩效考核结果',
      dataIndex: 'performanceResult',
      key: 'performanceResult',
    }, {
      title: '绩效考核评语',
      dataIndex: 'performanceComment',
      key: 'performanceComment',
    }, {
      title: '劳动态度考核结果',
      dataIndex: 'attitudeResult',
      key: 'attitudeResult',
    }, {
      title: '劳动态度考核评语',
      dataIndex: 'attitudeComment',
      key: 'attitudeComment',
    }];

    const acceptanceInformation = [{
      title: '奖项名称',
      dataIndex: 'title',
      key: 'title',
    }, {
      title: '获奖时间',
      dataIndex: 'time',
      key: 'time',
    }, {
      title: '奖励情况',
      dataIndex: 'info',
      key: 'info',
    }, {
      title: '获奖评语',
      dataIndex: 'comment',
      key: 'comment',
    }];

    const trainingInformation = [{
      title: '培训课程名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '培训日期',
      dataIndex: 'time',
      key: 'time',
    }, {
      title: '培训时长',
      dataIndex: 'timeLength',
      key: 'timeLength',
    }, {
      title: '考核方式',
      dataIndex: 'assessmentType',
      key: 'assessmentType',
    }, {
      title: '考核成绩',
      dataIndex: 'assessmentResult',
      key: 'assessmentResult',
    }];

    const salaryAdjustment = [{
      title: '调薪时间',
      dataIndex: 'time',
      key: 'time',
    }, {
      title: '调薪变动',
      dataIndex: 'change',
      key: 'change',
    }, {
      title: '变动后薪酬',
      dataIndex: 'folSalary',
      key: 'folSalary',
    }];

    return (
      <div>
        <Anchor className={styles.anchor}>
          <Link href="#basic-info" title="基本信息"/>
          <Link href="#education-info" title="教育经历"/>
          <Link href="#role-change-info" title="调动/任命/岗位变动信息"/>
          <Link href="#employee-state" title="员工状态信息"/>
          <Link href="#contract-info" title="合同信息"/>
          <Link href="#attendance-info" title="考勤信息"/>
          <Link href="#family-info" title="家庭信息"/>
          <Link href="#work-experience" title="工作经历"/>
          <Link href="#interview-record" title="面试记录"/>
          <Link href="#probation-info" title="试用期信息"/>
          <Link href="#performance-info" title="绩效信息"/>
          <Link href="#prize-info" title="获奖信息"/>
          <Link href="#training-info" title="培训信息"/>
          <Link href="#payment-info" title="薪酬社保信息"/>
          <Link href="#salary-adjustment-record" title="调薪记录"/>
          <Link href="#other-welfare" title="其他福利"/>
        </Anchor>
        <div className={styles.content}>
          <div id="basic-info">
            <PageHeaderLayout title="基本信息">
              <Card>
                <DescriptionList size="large" title="个人信息">
                  <Description term="员工工号">{profile.employeeNumber}</Description>
                  <Description term="员工姓名">{profile.name}</Description>
                  <Description term="员工角色">{profile.role === 'general' ? '普通用户' : '管理员'}</Description>
                  <Description term="工作地">{profile.workPlace}</Description>
                  <Description term="岗位">{profile.station}</Description>
                  <Description term="职级">{profile.grade}</Description>
                  <Description term="入职日期">{formatTimeLess(profile.entryDate)}</Description>
                  <Description term="转正日期">{formatTimeLess(profile.confirmDate)}</Description>
                  <Description term="一级部门">{profile.firstDepartment}</Description>
                  <Description term="二级部门">{profile.secondDepartment}</Description>
                  <Description term="三级部门">{profile.thirdDepartment}</Description>
                  <Description term="最小部门">{profile.forthDepartment}</Description>
                  <Description term="直接主管工号">{profile.directorNumber}</Description>
                  <Description term="直接主管姓名">{profile.directorName}</Description>
                  <Description term="思想导师工号">{profile.mentorNumber}</Description>
                  <Description term="思想导师姓名">{profile.mentorName}</Description>
                  <Description term="性别">{profile.sex}</Description>
                  <Description term="民族">{profile.nation}</Description>
                  <Description term="出生日期">{formatTimeLess(profile.birthday)}</Description>
                  <Description term="年龄">{this.getAge(profile.cardId)}</Description>
                  <Description term="身份证号码">{profile.cardId}</Description>
                  <Description term="婚姻状况">{profile.marriage}</Description>
                  <Description term="手机号码">{profile.phoneNumber}</Description>
                  <Description term="公司电子邮箱">{profile.email}</Description>
                  <Description term="备用电子邮箱">{profile.secemail}</Description>
                  <Description term="紧急联系人">{profile.emergencyContact}</Description>
                  <Description term="紧急联系电话">{profile.emergencyNumber}</Description>
                  <Description term="户口性质">{profile.householdType}</Description>
                  <Description term="户口所在地">{profile.householdPlace}</Description>
                  <Description term="居住地地址">{profile.address}</Description>
                  <Description term="社保所在地">{profile.socialSecurityPlace}</Description>
                  <Description term="招聘类型">{profile.recruitmentType}</Description>
                  <Description term="信息来源">{profile.recruitmentSource}</Description>
                  <Description term="内部推荐人姓名&工号">{profile.referrer}</Description>
                  <Description term="最高学历">{profile.highestEducation}</Description>
                  <Description term="最高学历是否统招">{profile.highestEducationType}</Description>
                  <Description term="最高学历学习方式">{profile.highestEducationStudyType}</Description>
                  <Description term="离职日期">{formatTimeLess(profile.resignDate)}</Description>
                </DescriptionList>
              </Card>
            </PageHeaderLayout>
          </div>
          <div id="education-info">
            <PageHeaderLayout title="教育经历">
              <Card>
                <Table columns={educationExperience} />
              </Card>
            </PageHeaderLayout>
          </div>
          <div id="role-change-info">
            <PageHeaderLayout title="调动/任命/岗位变动信息">
              <Card>
                <Table columns={jobChange} />
              </Card>
            </PageHeaderLayout>
          </div>
          <div id="employee-state">
            <PageHeaderLayout title="员工状态信息">
              <Card>
                <DescriptionList size="large" title="员工状态信息">
                  <Description term="员工状态">{profile.employeeStatus}</Description>
                  <Description term="离职日期">{formatTimeLess(profile.resignDate)}</Description>
                  <Description term="离职类型">{profile.resignType}</Description>
                  <Description term="个人反馈离职原因">{profile.resignReasonFromSelf}</Description>
                  <Description term="主管获取离职原因">{profile.resignReasonFromDirector}</Description>
                  <Description term="HR获取离职原因">{profile.resignReasonFromHR}</Description>
                </DescriptionList>
              </Card>
            </PageHeaderLayout>
          </div>
          <div id="contract-info">
            <PageHeaderLayout title="合同信息">
              <Card>
                <DescriptionList size="large" title="合同信息">
                  <Description term="合同编码"/>
                  <Description term="合同期限(月)"/>
                  <Description term="合同生效日期"/>
                  <Description term="合同到期日期"/>
                </DescriptionList>
              </Card>
            </PageHeaderLayout>
          </div>
          <div id="attendance-info">
            <PageHeaderLayout title="考勤信息">
              <Card>
                <DescriptionList size="large" title="加班调休">
                  <Description term="累计加班小时"/>
                  <Description term="已调休小时"/>
                  <Description term="剩余可调休小时"/>
                </DescriptionList>
                <Divider style={{marginBottom: 32}}/>
                <DescriptionList size="large" title="年假及全薪病假">
                  <Description term="2017年带薪年休假总额"/>
                  <Description term="2017年已休带薪病假"/>
                  <Description term="2017年剩余带薪病假"/>
                  <Description term="2017年年假总额"/>
                  <Description term="2017年已休年假"/>
                  <Description term="2017年剩余年假"/>
                  <Description term="2017年忘刷卡次数"/>
                </DescriptionList>
                <Divider style={{marginBottom: 32}}/>
                <DescriptionList size="large" title="请假记录">
                  <Description term="请假时间日期"/>
                  <Description term="请假类别"/>
                  <Description term="请假时长"/>
                </DescriptionList>
              </Card>
            </PageHeaderLayout>
          </div>
          <div id="family-info">
            <PageHeaderLayout title="家庭信息">
              <Card>
                <Table columns={familyInformation} />
              </Card>
            </PageHeaderLayout>
          </div>
          <div id="work-experience">
            <PageHeaderLayout title="工作经历">
              <Card>
                <Table columns={workExperience} />
              </Card>
            </PageHeaderLayout>
          </div>
          <div id="interview-record">
            <PageHeaderLayout title="面试记录">
              <Card>
                <DescriptionList size="large" title="面试记录">
                <Description term="员工状态">{profile.employeeStatus}</Description>
                  <Description term="技术面试官姓名">{profile.technicalerName}</Description>
                  <Description term="技术面试官工号">{profile.technicalerNo}</Description>
                  <Description term="技术面试结论">{profile.technicalResult}</Description>
                  {/* <Description term="技术面试评语"/> */}
                  <Description term="资格面试官姓名">{profile.qualificationName}</Description>
                  <Description term="资格面试官工号">{profile.qualificationNo}</Description>
                  <Description term="资格面试结论">{profile.qualificationResult}</Description>
                  {/* <Description term="资格面试评语"/> */}
                  <Description term="综合面试官姓名">{profile.synthesizeName}</Description>
                  <Description term="综合面试官工号">{profile.synthesizeNo}</Description>
                  <Description term="综合面试官结论">{profile.synthesizeResult}</Description>
                  {/* <Description term="综合面试官评语"/> */}
                </DescriptionList>
              </Card>
            </PageHeaderLayout>
          </div>
          <div id="probation-info">
            <PageHeaderLayout title="试用期信息">
              <Card>
                <DescriptionList size="large" title="试用期信息">
                  <Description term="试用期辅导阶段"/>
                  <Description term="第一阶段绩效考核结果"/>
                  <Description term="第一阶段绩效考核评语"/>
                  <Description term="第一阶段劳动态度考核结果"/>
                  <Description term="第一阶段劳动态度考核评语"/>
                </DescriptionList>
              </Card>
            </PageHeaderLayout>
          </div>
          <div id="performance-info">
            <PageHeaderLayout title="绩效信息">
              <Card>
                <Table columns={performanceInformation} />
              </Card>
            </PageHeaderLayout>
          </div>
          <div id="prize-info">
            <PageHeaderLayout title="获奖信息">
              <Card>
                <Table columns={acceptanceInformation} />
              </Card>
            </PageHeaderLayout>
          </div>
          <div id="training-info">
            <PageHeaderLayout title="培训信息">
              <Card>
                <Table columns={trainingInformation} />
              </Card>
            </PageHeaderLayout>
          </div>
          <div id="payment-info">
            <PageHeaderLayout title="薪酬社保信息">
              <Card>
                <DescriptionList size="large" title="薪酬社保信息">
                  <Description term="发薪账号">{profile.payrollAccount}</Description>
                  <Description term="月基本工资">{profile.basicSalary}</Description>
                  <Description term="社保基数"/>
                  <Description term="公积金基数"/>
                  <Description term="公司缴纳医疗保险"/>
                  <Description term="公司缴纳养老保险"/>
                  <Description term="公司缴纳失业保险"/>
                  <Description term="公司缴纳工伤保险"/>
                  <Description term="公司缴纳生育保险"/>
                  <Description term="公司缴纳公积金"/>
                  <Description term="个人缴纳医疗保险"/>
                  <Description term="个人缴纳养老保险"/>
                  <Description term="公司缴纳失业保险"/>
                  <Description term="个人缴纳公积金"/>
                  <Description term="补缴社保"/>
                  <Description term="补缴公积金"/>
                  <Description term="补发/扣工资"/>
                  <Description term="其他所得"/>
                  <Description term="应纳税所得额"/>
                  <Description term="个人所得税"/>
                  <Description term="实发工资"/>
                </DescriptionList>
              </Card>
            </PageHeaderLayout>
          </div>
          <div id="salary-adjustment-record">
            <PageHeaderLayout title="调薪记录">
              <Card>
                <Table columns={salaryAdjustment} />
              </Card>
            </PageHeaderLayout>
          </div>
          <div id="other-welfare">
            <PageHeaderLayout title="其他福利">
              <Card>
                <DescriptionList size="large" title="补充医疗保障">
                  <Description term="补充医疗免赔额"/>
                  <Description term="补充医疗报销比例"/>
                  <Description term="补充医疗保额"/>
                </DescriptionList>
                <Divider style={{marginBottom: 32}}/>
                <DescriptionList size="large" title="意外风险保障">
                  <Description term="一般意外保额"/>
                  <Description term="附加意外医疗保额"/>
                  <Description term="意外住院津贴"/>
                  <Description term="飞机意外保额"/>
                  <Description term="火车意外保额"/>
                  <Description term="轮船意外保额"/>
                  <Description term="乘坐汽车意外保额"/>
                  <Description term="自驾车意外保额"/>
                  <Description term="疾病身故或全残保额"/>
                </DescriptionList>
                <Divider style={{marginBottom: 32}}/>
                <DescriptionList size="large" title="重大疾病保障">
                  <Description term="重大疾病保障"/>
                </DescriptionList>
              </Card>
            </PageHeaderLayout>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return renderRoute(this.props, this.renderContent);
  }
}
