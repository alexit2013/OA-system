import React from 'react';
import {connect} from 'dva';
import {Button, Form, Icon, Input} from 'antd';
import styles from './UserChangePw.less';

const FormItem = Form.Item;

@connect(state => ({
  user: state.user,
}))
@Form.create()
class UserChangePw extends React.Component {
  handleSubmit = () => {
    const {user: {currentUser: {userid}}, form, dispatch} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        userId: userid,
      };

      dispatch({
        type: 'user/changePassword',
        payload: values,
      });
    });
  }

  render() {
    const {form: {getFieldDecorator}} = this.props;
    return (
      <div className={styles.main}>
        <Form>
          <FormItem>
            <span className={styles.oldPwLabel}>旧密码</span>
            {getFieldDecorator('oldPassword', {
            rules: [{required: true, message: '请输入旧密码！'}],
            initialValue: '',
          })(
            <Input
              className={styles.oldPwInput}
              prefix={<Icon type="lock" className={styles.prefixIcon} />}
              type="password"
            />
          )}
          </FormItem>
          <FormItem>
            <span className={styles.newPwLabel}>新密码</span>
            {getFieldDecorator('newPassword', {
            rules: [{required: true, message: '请输入新密码！'}],
            initialValue: '',
          })(
            <Input
              className={styles.newPwInput}
              prefix={<Icon type="lock" className={styles.prefixIcon} />}
              type="password"
            />
          )}
          </FormItem>
          <Button
            size="default"
            loading={false}
            className={styles.submitBtn}
            type="primary"
            htmlType="submit"
            onClick={this.handleSubmit}
          >
          提交修改
          </Button>
        </Form>
      </div>);
  }
}

export default UserChangePw;
