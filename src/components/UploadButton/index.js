import React from 'react';
import {Button, Icon, message, Upload} from 'antd';


class UploadButton extends React.Component {
  state = {
    loading: false,
  }

  render() {
    const {props} = this;
    const uploadProps = {
      ...props,
      name: 'file',
      headers: {
        authorization: 'authorization-text',
      },
      disabled: this.state.loading,
      showUploadList: false,
      onStart: () => {
        this.setState({loading: true});
      },
      onSuccess: (response, file) => {
        this.setState({loading: false});
        message.success(`${file.name} 上传成功，已导入${response.length}条记录`);
        if (props.onSuccess) {
          props.onSuccess(response);
        }
      },
      onError: (info) => {
        message.error('文件上传失败!');
        this.setState({loading: false});
        if (props.onError) {
          props.onError(info);
        }
      },
    };

    return (
      <Upload {...uploadProps}>
        <Button loading={this.state.loading}>
          {!this.state.loading && <Icon type="upload"/>}
          {props.title}
        </Button>
      </Upload>);
  }
}

export default UploadButton;
