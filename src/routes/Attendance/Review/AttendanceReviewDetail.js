import React, {Component} from 'react';
import {connect} from 'dva';
import {Button, Card, Form, Input} from 'antd';
import {get} from 'lodash';
import {getAttendanceById} from '../../../services/api';
import DescriptionList from '../../../components/DescriptionList/DescriptionList';
import Description from '../../../components/DescriptionList/Description';
import {getShowText} from '../../../utils/utils';
import {formatTime} from '../../../utils/timeUtil';

const {TextArea} = Input;
const FormItem = Form.Item;

@connect(state => ({
  attendance: state.attendance, // mapStateToProps
}))
@Form.create()
class AttendaceReviewDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {},
      approving: false,
      rejecting: false,
    };
  }

  componentDidMount() {
    const {match: {params: {id}}} = this.props;
    if (id) {
      getAttendanceById(id).then((response) => {
        this.setState({
          item: response,
        });
      });
    }
  }

  handlerApprove = (id) => {
    this.doReview(id, '审批通过');
  }

  handlerReject = (id) => {
    this.doReview(id, '拒绝');
  }

  doReview = (id, state) => {
    const {form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        attendanceId: id,
        approvalStatus: state,
        approvalComment: fieldsValue.comment,
      };

      this.props.dispatch({
        type: 'attendance/setReviewStates',
        payload: values,
      });
    });
  }


  renderDetail = () => {
    const getType = (it) => {
      if (it === 'leave') {
        return '请假';
      } else if (it === 'workOvertime') {
        return '加班';
      }
      return '--';
    };

    const {item} = this.state;
    const {form: {getFieldDecorator}} = this.props;
    const showLeaveType = (get(item, 'attendanceType') === 'leave');
    return (
      <div>
        <Card id="basic-info">
          <DescriptionList size="large" title="" col={1}>
            <Description term="类型">{getType(item.attendanceType)}</Description>
            <Description term="申请人姓名">{getShowText(item.applicantName)}</Description>
            <Description term="申请人工号">{getShowText(item.applicantId)}</Description>
            <Description term="起始时间">{formatTime(item.startTime)}</Description>
            <Description term="结束时间">{formatTime(item.endTime)}</Description>
            <Description term="事由">{getShowText(item.leaveContent)}</Description>
            <Description term="申请人部门">{getShowText(item.department)}</Description>
            <Description term="抄送">{getShowText(item.copyTo)}</Description>
            <div>
              {showLeaveType && <Description term="请假类型">{getShowText(item.leaveType)}</Description>}
            </div>
            <Description term="审批状态">{getShowText(item.approvalStatus)}</Description>

          </DescriptionList>
        </Card>
        <Form>
          <FormItem
            label="审批备注"
            style={{marginTop: 20}}
          >
            {getFieldDecorator('comment', {
              rules: [{required: false, message: '请输入审批备注'}],
              initialValue: item.approvalComment,
            })(
              <TextArea autosize={{minRows: 2}}/>
            )}
          </FormItem>
        </Form>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <Button
            type="primary"
            onClick={() => this.handlerApprove(item.id)}
            loading={this.state.approving}
            disabled={this.state.approving || this.state.rejecting}
          >
            同意
          </Button>
          <Button
            type="primary"
            style={{marginLeft: 30}}
            onClick={() => this.handlerReject(item.id)}
            loading={this.state.rejecting}
            disabled={this.state.approving || this.state.rejecting}
          >
            拒绝
          </Button>
        </div>
      </div>
    );
  }


  render() {
    return (
      <div>
        {this.renderDetail()}
      </div>
    );
  }
}

export default AttendaceReviewDetail;
