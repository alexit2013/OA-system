import React, {Component} from 'react';
import {connect} from 'dva';
import {Icon, Upload, Button, Form, Select, DatePicker, Input, notification} from 'antd';
import moment from 'moment';
import {routerRedux} from 'dva/router';
import styles from './LeaveTime.less';
import {LEAVE_TYPE, UPLOAD_FILE} from '../../../common/constants';

const {RangePicker} = DatePicker;
const {TextArea} = Input;
const {Option} = Select;
const FormItem = Form.Item;

@connect(state => ({
  submitting: state.regularFormSubmitting,
}))
@Form.create()

class LeaveTimeAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      Object.assign(values, {startTime: values.leaveTimeRange[0],
        endTime: values.leaveTimeRange[1]});
      // console.log(values);
      if (!err) {
        this.props.dispatch({
          type: 'attendance/addLeave',
          payload: values,
        });
      } else {
        notification.error({
          message: '请求错误 error',
        });
      }
    });
  };
  cancelAddNotice = () => {
    const target = '/tabs/attendance/leave-time';
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
    const {form: {getFieldDecorator}} = this.props;

    return (
      <Form>
        <FormItem className={styles.formItem}>
          <span className={styles.inputLabel}>请假类型</span>
          {getFieldDecorator('leaveType', {
            rules: [{required: true, message: '请选择请假类型！'}],
          })(
            <Select className={styles.inputField} style={{width: 120}}>
              {LEAVE_TYPE.map(it => (<Option value={it} key={it}>{it}</Option>))}
            </Select>
          )}
        </FormItem>
        <FormItem className={styles.formItem}>
          <span>请假时间: </span>
          {getFieldDecorator('leaveTimeRange', {
            rules: [{required: true, message: '请选择请假时间！'}],
          })(
            <RangePicker
              showTime={{format: 'HH:mm', defaultValue: [moment('08:00', 'HH:mm'), moment('18:00', 'HH:mm')]}}
              format="YYYY-MM-DD HH:mm"
              placeholder={['Start Time', 'End Time']}
              onChange={this.onChange}
              onOk={this.onOk}
            />
          )}
        </FormItem>
        <FormItem className={styles.formItem}>
          <span>请假事由: </span>
          {getFieldDecorator('leaveContent', {
            rules: [{required: false, message: '请选择请假时间！'}],
          })(
            <TextArea rows={2}/>
          )}
        </FormItem>
        <FormItem className={styles.formItem}>
          <span>所在部门: </span>
          {getFieldDecorator('department', {
            rules: [{required: true, message: '请填写部门！'}],
          })(
            <Input className={styles.inputField} style={{width: 120}}/>
          )}
        </FormItem>
        <FormItem className={styles.formItem}>
          <span>审批人: </span>
          {getFieldDecorator('reviewer', {
            rules: [{required: true, message: '请填写审批人！'}],
          })(
            <Input className={styles.inputField} style={{width: 120}}/>
          )}
        </FormItem>
        <FormItem className={styles.formItem}>
          <span>抄送人: </span>
          {getFieldDecorator('copyTo', {
            rules: [{required: false, message: '请填写抄送人！'}],
          })(
            <Input className={styles.inputField} style={{width: 120}}/>
          )}
        </FormItem>
        <FormItem>
          <span>附件: </span>
          {this.renderUpload()}
        </FormItem>
        <Button
          size="large"
          className={styles.submit}
          type="primary"
          htmlType="submit"
          onClick={this.handleSubmit}
        >
          提交
        </Button>
      </Form>);
  }
}

export default LeaveTimeAdd;
