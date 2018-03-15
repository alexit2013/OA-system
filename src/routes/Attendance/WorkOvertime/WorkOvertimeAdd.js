import React, {Component} from 'react';
import {connect} from 'dva';
import {Icon, Upload, Button, Form, DatePicker, Input, notification} from 'antd';
import moment from 'moment';
import {routerRedux} from 'dva/router';
import styles from './WorkOvertime.less';
import {UPLOAD_FILE} from '../../../common/constants';
import { getAttendanceById } from '../../../services/api';

const {RangePicker} = DatePicker;
const {TextArea} = Input;
const FormItem = Form.Item;

@connect(state => ({
  submitting: state.regularFormSubmitting,
}))
@Form.create()
class WorkOvertimeAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {},
    };
  }

  componentDidMount() {
    const {location: {id}} = this.props;
    if (id) this.getAttendanceById(id);
  }

  getAttendanceById(id) {
    getAttendanceById(id).then((response) => {
      this.setState({
        item: response,
      });
    });
  }

  getDefaultText = (input, defaultValue = '') => (input || defaultValue);

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      Object.assign(values, {startTime: values.leaveTimeRange[0],
        endTime: values.leaveTimeRange[1]});
      if (!err) {
        this.props.dispatch({
          type: 'attendance/submitAddOvertimeForm',
          payload: values,
        });
      } else {
        notification.error({
          message: '系统错误，请联系管理员',
        });
      }
    });
  };

  cancel = () => {
    const target = '/tabs/attendance/work-overtime';
    this.props.dispatch(routerRedux.push(target));
  };
  renderUpload = () => {
    const props = {
      action: UPLOAD_FILE,
      onChange: this.handleFileInfoChange,
      headers: {
        authorization: 'authorization-text',
      },
    };
    return (
      <div className={styles.uploadContainer}>
        <Upload {...props} fileList={this.state.fileList}>
          <Button>
            <Icon type="upload"/> 上传文档
          </Button>
        </Upload>
      </div>
    );
  };
  render() {
    const {submitting} = this.props;
    const {form: {getFieldDecorator}} = this.props;
    const {startTime, endTime, leaveContent, department, reviewer, copyTo} = this.state.item;
    const dateFormat = 'YYYY-MM-DD HH:mm';
    return (
      <Form>
        <FormItem className={styles.formItem}>
          <span>加班时段: </span>
          {startTime && endTime ? getFieldDecorator('leaveTimeRange', {
            rules: [{required: true, message: '请选择加班时间！'}],
          })(
            <RangePicker
              size="large"
              defaultValue={[moment(startTime, dateFormat), moment(endTime, dateFormat)]}
              showTime={{format: 'HH:mm', defaultValue: [moment('08:00', 'HH:mm'), moment('18:00', 'HH:mm')]}}
              format={dateFormat}
              placeholder={['Start Time', 'End Time']}
            />
          ) : getFieldDecorator('leaveTimeRange', {
            rules: [{required: true, message: '请选择加班时间！'}],
          })(
            <RangePicker
              size="large"
              showTime={{format: 'HH:mm', defaultValue: [moment('08:00', 'HH:mm'), moment('18:00', 'HH:mm')]}}
              format={dateFormat}
              placeholder={['Start Time', 'End Time']}
            />
          )}
        </FormItem>
        <FormItem className={styles.formItem}>
          <span>加班事由: </span>
          {getFieldDecorator('leaveContent', {
            rules: [{required: false, message: '请选择加班事由！'}],
            initialValue: this.getDefaultText(leaveContent),
          })(
            <TextArea rows={2} size="large" placeholder="加班事由"/>
          )}
        </FormItem>
        <FormItem className={styles.formItem}>
          <span>所在部门: </span>
          {getFieldDecorator('department', {
            rules: [{required: true, message: '请填写部门！'}],
            initialValue: this.getDefaultText(department),
          })(
            <Input className={styles.inputField} placeholder="部门" size="large"/>
          )}
        </FormItem>
        <FormItem className={styles.formItem}>
          <span>审批人: </span>
          {getFieldDecorator('reviewer', {
            rules: [{required: true, message: '请填写审批人！'}],
            initialValue: this.getDefaultText(reviewer),
          })(
            <Input className={styles.inputField} placeholder="审批人" size="large"/>
          )}
        </FormItem>
        <FormItem className={styles.formItem}>
          <span>抄送人: </span>
          {getFieldDecorator('copyTo', {
            rules: [{required: false, message: '请填写抄送人！'}],
            initialValue: this.getDefaultText(copyTo),
          })(
            <Input className={styles.inputField} placeholder="抄送人" size="large"/>
          )}
        </FormItem>
        <FormItem>
          <span>附件: </span>
          {this.renderUpload()}
        </FormItem>
        <Button
          size="large"
          className={styles.submit}
          loading={submitting}
          type="primary"
          htmlType="submit"
          onClick={this.handleSubmit}
        >
          提交
        </Button>
        <Button style={{marginLeft: 8}} size="large" onClick={this.cancel}>
          取消
        </Button>
      </Form>);
  }
}

export default WorkOvertimeAdd;
