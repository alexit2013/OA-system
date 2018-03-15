import React, {Component} from 'react';
import {connect} from 'dva';
import {Form, Input, Button, Select, Upload, Icon} from 'antd';
import {isEmpty} from 'lodash';
import {routerRedux} from 'dva/router';
import E from 'wangeditor';
import {UPLOAD_FILE} from '../../../common/constants';
import {getDownloadUrlByDocId} from '../../../utils/utils';

const FormItem = Form.Item;
const {Option} = Select;

@connect(state => ({
  submitting: state.regularFormSubmitting,
  item: state.notice.item,
}))
@Form.create()
export default class NoticeAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      editorHtml: this.props.item.content,
      showTips: false,
    };
  }

  componentDidMount() {
    const elem = this.refs.editorElem;
    const editor = new E(elem);
    editor.customConfig.uploadImgShowBase64 = true;
    editor.customConfig.zIndex = 100;
    editor.customConfig.onchange = (html) => {
      if (!html) {
        this.setState({
          showTips: true,
        });
      } else {
        this.setState({
          showTips: false,
        });
      }
      this.setState({
        editorHtml: html,
      });
    };
    editor.create();
    editor.txt.html(this.state.editorHtml);
  }

  componentWillUnmount = () => {
    this.props.dispatch({
      type: 'notice/cancelNotice',
      payload: {},
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!this.state.editorHtml) {
        this.setState({
          showTips: true,
        });
      }
      const errors = !err && !!this.state.editorHtml;
      if (errors) {
        const fileList = this.state.fileList
          .filter(it => !isEmpty(it.response.id))
          .map(it => ({...it.response}));
        this.props.dispatch({
          type: 'notice/submitAddNoticeForm',
          payload: {...values,
            content: this.state.editorHtml,
            fileList,
          },
        });
      }
    });
  };

  cancelAddNotice = () => {
    this.props.dispatch(routerRedux.push('/tabs/manager/notice-manage'));
  };

  renderUpload = () => {
    const handleFileInfoChange = (info) => {
      let {fileList} = info;

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

    const props = {
      action: UPLOAD_FILE,
      onChange: handleFileInfoChange,
      headers: {
        authorization: 'authorization-text',
      },
    };

    return (
      <div style={{width: 300}}>
        <Upload {...props} fileList={this.state.fileList}>
          <Button>
            <Icon type="upload"/> 上传文档
          </Button>
        </Upload>
      </div>
    );
  }


  render() {
    const {submitting, item} = this.props;
    const {getFieldDecorator} = this.props.form;

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem style={{display: 'none'}}>
            {getFieldDecorator('id', {
              initialValue: item.id,
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('title', {
              rules: [{
                required: true, message: '请输入标题',
              }],
              initialValue: item.title,
            })(
              <Input
                size="large"
                placeholder="标题"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('author', {
              rules: [{
                required: true, message: '请输入作者！',
              }],
              initialValue: item.author,
            })(
              <Input
                size="large"
                placeholder="作者"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('type', {
              rules: [{required: true, message: '请选择类型！'}],
              initialValue: item.type,
            })(
              <Select placeholder="请选择类型" size="large">
                <Option value="任命信息">任命信息</Option>
                <Option value="管理规定">管理规定</Option>
                <Option value="通知通告">通知通告</Option>
              </Select>
            )}
          </FormItem>
          <div ref="editorElem" style={{textAlign: 'left'}}/>
          <div
            className="ant-form-explain has-error"
            style={{color: '#f5222d', display: this.state.showTips ? 'block' : 'none'}}
          >请输入类型！
          </div>
          <FormItem>
            {this.renderUpload()}
          </FormItem>
          <FormItem>
            <Button loading={submitting} type="primary" htmlType="submit">
              提交
            </Button>
            <Button style={{marginLeft: 8}} onClick={this.cancelAddNotice}>
              取消
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
