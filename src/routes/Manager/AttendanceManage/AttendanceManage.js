import React from 'react';
import {DatePicker, Form} from 'antd';
import moment from 'moment';
import styles from './AttendanceManage.less';
import {UPLOAD_TIME_SHEET_EXCEL} from '../../../common/constants';
import UploadButton from '../../../components/UploadButton/index';

const {MonthPicker} = DatePicker;
const FormItem = Form.Item;

const MONTH_DATE_PICKER = 'month';

@Form.create()
class AttendanceManage extends React.Component {
  renderUpload = () => {
    const {form} = this.props;
    return (
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <UploadButton
          title="上传考勤Excel"
          action={UPLOAD_TIME_SHEET_EXCEL}
          data={() => {
            const value = form.getFieldValue(MONTH_DATE_PICKER);
            const monthDate = moment(0);
            monthDate.year(value.year());
            monthDate.month(value.month());
            return {month: monthDate};
          }}
          beforeUpload={() => {
            return new Promise((resolve, reject) => {
              form.validateFields((err) => {
                if (err) {
                  reject();
                } else {
                  resolve();
                }
              });
            });
          }}
        />

        <Form>
          <FormItem style={{marginLeft: 30}}>
            <span>考勤月份</span>
            {form.getFieldDecorator(MONTH_DATE_PICKER, {
              rules: [{required: true, message: '请输入考勤月份！'}],
              initialValue: null,
            })(
              <MonthPicker
                placeholder="Select month"
                format="MM-YYYY"
              />
            )}
          </FormItem>
        </Form>
      </div>
    );
  }


  render() {
    return (
      <div className={styles.main}>
        {this.renderUpload()}
      </div>);
  }
}

export default AttendanceManage;
