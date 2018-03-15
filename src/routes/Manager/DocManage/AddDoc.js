import React from 'react';
import {connect} from 'dva';
import moment from 'moment';
import {isEmpty, toString} from 'lodash'; // isEmpty 检查值是否为空对象、集合、映射或集合。toString : 就是将值转换为字符串
import {Form, Input, Button, Upload, Icon, message, Select, Card, Layout, DatePicker, Row, Col, AutoComplete} from 'antd';
import styles from './AddDoc.less';
import {UPLOAD_FILE, DOC_CATEGORIES, DOC_SECRECTS, DOC_LEVELS} from '../../../common/constants';
import {queryDoc, queryLike} from '../../../services/api';
import {getDownloadUrlByDocId} from '../../../utils/utils';

const FormItem = Form.Item;
const {Option} = Select;
const dateFormat = 'DD-MM-YYYY';

let tempArr = [];

// var tempStr = [];

@connect(state => ({
  document: state.document,//mapStateToProps
}))
@Form.create()//form.create()(AddDoc)
class AddDoc extends React.Component {
  state = {
    flagEditor:false, //编写人框是否获得焦点
    flagAuditor:false, //审核人框是否获得焦点
    flagAprover:false, //批准人框是否获得焦点
    dataSource:[],
    nameSourceEditor:[],
    nameSourceAuditor:[],
    nameSourceAprover:[],
    nameDepartment:[],
    fileList: [],
    docInfo: {
      approverTime: null,
      reviewTime: null,
      authorTime: null,
      validityTime: null,
      category: DOC_CATEGORIES[0],
      seceretLevel: DOC_SECRECTS[0],
      docLevel: DOC_LEVELS[0],
      author: '',
      validate: true,
    },
  };

//editor 处理逻辑
  componentDidMount() {
    if (this.isEditMode()) {
      const {location: {docId}} = this.props;
      queryDoc(docId)
        .then((response) => {
          const files = [{
            uid: 1,
            name: response.title,
            status: 'done',
            url: getDownloadUrlByDocId(response.docNo),
          }];
          this.setState({
            docInfo: {
              ...response,
              approverTime: response.approverTime ? moment(response.approverTime) : null,
              reviewTime: response.reviewTime ? moment(response.reviewTime) : null,
              authorTime: response.authorTime ? moment(response.authorTime) : null,
              validityTime: response.validityTime ? moment(response.validityTime) : null,
            },
            fileList: files,
          });
        });
    }
  }

  getTitle = () => {
    return this.isEditMode() ? `编辑文档-${this.state.docInfo.title}` : '新增文档';
  };

  getDefaultText = (input, value,defaultValue = '') => {
    if (input) {
      return input;
    } else if (!input && value) {
      return value;
    } else {
      return defaultValue;
    }
  };

  handleFileInfoChange = (info) => {
    let {fileList} = info;
    // console.log('info: ',info);
    // 1. Limit the number of uploaded files
    //    Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-1);

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


  isEditMode = () => !isEmpty(this.props.location.docId) // 返回一个布尔类型的值

  handleSubmit = () => {
    if (isEmpty(this.state.fileList) || this.state.fileList[0].status !== 'done') {
      message.warning('请上传文件');
      return;
    }
    const fileInfo = this.state.fileList[0];
    const {form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...this.state.docInfo,
        ...fieldsValue,
        docNo: fileInfo.fileId,
        title: fileInfo.name,
        validate: fieldsValue.validate === 'true',
      };

      const {dispatch} = this.props;
      dispatch({
        type: this.isEditMode() ? 'document/editDoc' : 'document/addDoc',
        payload: values,
      });
    });
  };
  // 编写人联想
  handleChangeEditor = (value) => {
    if (value === '') {
      tempArr[0] = '';
      this.setState({nameSourceEditor: [], nameDepartment: [...tempArr]});
    } else {
      if (this.state.flagEditor) {
        queryLike(value)
          .then((response)=>{
            if(Object.prototype.toString.call(response) === '[object Array]') {
              let temp = [];
              // console.log('response',response);
              response.map((item)=>{
                temp.push(item.name)
              });
              this.setState({
                dataSource:[...response],
                nameSourceEditor:[...temp]
              });
            }else if(Object.prototype.toString.call(response) === '[object Object]'){
              let temp = [];
              temp.push(response);
              this.setState({
                nameSourceEditor:[response.name],
                dataSource:[...temp],
              });
            }
          })
      }
    }
  };
  //编写人部门联想，随编写人确定
  handleSeleteEditorDep = (value) => {
    if(this.state.dataSource.length) {
      let temp = this.state.dataSource;
      temp.map((item)=>{
        if(item.name === value) {
          tempArr[0] = item.station;
          this.setState({nameDepartment:[...tempArr]})
        }
      })
    }
    console.log('nameDepartment: ',this.state.nameDepartment);
  };
  //审核人联想
  handleChangeAuditor = (value) => {
    if(value === '') {
      tempArr[1] = '',
        this.setState({nameSourceAuditor:[],nameDepartment:[...tempArr]});
    }else {
      if(this.state.flagAuditor) {
        queryLike(value)
          .then((response)=>{
            if(Object.prototype.toString.call(response) === '[object Array]') {
              let temp = [];
              // console.log('response',response);
              response.map((item)=>{
                temp.push(item.name)
              });
              this.setState({
                dataSource:[...response],
                nameSourceAuditor:[...temp]
              });
            }else if(Object.prototype.toString.call(response) === '[object Object]'){
              let temp = [];
              temp.push(response);
              this.setState({
                nameSourceAuditor:[response.name],
                dataSource:[...temp],
              });
            }
          })
      }
    }
  };
  //审核人部门联想
  handleSeleteAuditorDep = (value) => {
    if(this.state.dataSource.length) {
      let temp = this.state.dataSource;
      temp.map((item)=>{
        if(item.name === value) {
          tempArr[1] = item.station;
          this.setState({nameDepartment:[...tempArr]})
        }
      })
    }
    // console.log('nameDepartment: ',this.state.nameDepartment);
  };
  //批准人联想
  handleChangeApprover = (value) => {
    if(value === '') {
      tempArr[2] = '';
      this.setState({nameSourceAprover:[],nameDepartment:[...tempArr]});
    }else {
      if(this.state.flagAprover) {
        queryLike(value)
          .then((response)=>{
            if(Object.prototype.toString.call(response) === '[object Array]') {
              let temp = [];
              response.map((item)=>{
                temp.push(item.name)
              });
              this.setState({
                dataSource:[...response],
                nameSourceAprover:[...temp]
              });
            }else if(Object.prototype.toString.call(response) === '[object Object]'){
              let temp = [];
              temp.push(response);
              this.setState({
                nameSourceAprover:[response.name],
                dataSource:[...temp],
              });
            }
          })
      }
    }
  };
  //批准人部门联想
  handleSeleteApproverDep = (value) => {
    if(this.state.dataSource.length) {
      let temp = this.state.dataSource;
      temp.map((item)=>{
        if(item.name === value) {
          tempArr[2] = item.station;
          this.setState({nameDepartment:[...tempArr]})
        }
      })
    }
    // console.log('nameDepartment: ',this.state.nameDepartment);
  };

  // 获得编写人编辑框的焦点
  handleFocusEditor = () => {
    this.setState({
      dataSource:[],
      nameSourceEditor:[],
      flagEditor:true,
    })
  };
  // 鼠标离开编写人框时发生
  handleBlurEditor = () => {
    this.setState({flagEditor:false});

  };
  // 获得审核人编辑框的焦点
  handleFocusAuditor = () => {
    this.setState({
      dataSource:[],
      nameSourceAuditor:[],
      flagAuditor:true,
    })
  };
  // 鼠标离开审核人框时发生
  handleBlurAuditor = () => {
    this.setState({flagAuditor:false});

  };
  // 获得批准人编辑框的焦点
  handleFocusApprover = () => {
    this.setState({
      dataSource:[],
      nameSourceAprover:[],
      flagAprover:true,
    })
  };
  // 鼠标离开批准人框时发生
  handleBlurApprover = () => {
    this.setState({flagAprover:false});

  };
  
  renderUpload  = () => {
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
          <Button style={{width:'180px'}}>
            <Icon type="upload"/> 上传文档
          </Button>
        </Upload>
      </div>
    );
  };

// 表单组件
  renderSubmmitForms = ()=> {
    const {docInfo} = this.state;
    if (this.isEditMode() && isEmpty(docInfo)) {
      return (<div/>);
    }
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
        md: {span: 10},
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 10, offset: 7},
      },
    };
    const {document: {submitting}} = this.props;
    const {form: {getFieldDecorator, setFieldsValue}} = this.props;
    const { dataSource, nameSourceEditor, nameSourceAuditor, nameSourceAprover, nameDepartment, fileInfo} = this.state;
    // console.log('fileInfo: ',fileInfo);
    return (
      <Form>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="编制人">
              {getFieldDecorator('author', {
                rules: [{required: true, message: '请输入姓名！'}],
                initialValue: this.getDefaultText(docInfo.author),
              })(
                <AutoComplete
                  key={1}
                  dataSource={nameSourceEditor}
                  style={{ width: 180 }}
                  onSelect={this.handleSeleteEditorDep}
                  onChange={this.handleChangeEditor}
                  onFocus={this.handleFocusEditor}
                  onBlur={this.handleBlurEditor}
                />
                // <Input style={{width:'180px'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="编制人部门"
            >
              {getFieldDecorator('authorDepartment', {
                rules: [{required: false, message: '请输入编制人部门！'}],
                initialValue: this.getDefaultText(docInfo.authorDepartment,nameDepartment[0]),
              })(
                <Input style={{width:'180px'}} disabled/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="编制时间">
              {getFieldDecorator('authorTime', {
                rules: [{required: true, message: '请输入编制时间！'}],
                initialValue: docInfo.authorTime,
              })(
                <DatePicker format={dateFormat} style={{width:'180px'}}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="审核人"
            >
              {getFieldDecorator('reviewer', {
                rules: [{required: false, message: '请输入审核人姓名！'}],
                initialValue: this.getDefaultText(docInfo.reviewer),

              })(
                <AutoComplete
                  key={2}
                  dataSource={nameSourceAuditor}
                  style={{ width: 180 }}
                  onSelect={this.handleSeleteAuditorDep}
                  onChange={this.handleChangeAuditor}
                  onFocus={this.handleFocusAuditor}
                  onBlur={this.handleBlurAuditor}
                />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="审核人部门"
            >
              {getFieldDecorator('reviewDepartment', {
                rules: [{required: false, message: '请输入审核人部门！'}],
                initialValue: this.getDefaultText(docInfo.authorDepartment,nameDepartment[1]),
              })(
                <Input style={{width:'180px'}} disabled/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="审核时间"
            >
              {getFieldDecorator('reviewTime', {
                rules: [{required: false, message: '请输入审核时间！'}],
                initialValue: docInfo.reviewTime,
              })(
                <DatePicker format={dateFormat} style={{width:'180px'}}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="批准人"
            >
              {getFieldDecorator('approver', {
                rules: [{required: false, message: '请输入批准人姓名！'}],
                initialValue: this.getDefaultText(docInfo.approver),
              })(
                <AutoComplete
                  key={3}
                  dataSource={nameSourceAprover}
                  style={{ width: 180 }}
                  onSelect={this.handleSeleteApproverDep}
                  onChange={this.handleChangeApprover}
                  onFocus={this.handleFocusApprover}
                  onBlur={this.handleBlurApprover}
                />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="批准人部门"
            >
              {getFieldDecorator('approverDepartment', {
                rules: [{required: false, message: '请输入批准人部门！'}],
                initialValue: this.getDefaultText(docInfo.approverDepartment,nameDepartment[2]),
              })(
                <Input style={{width:'180px'}} disabled/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="批准时间"
            >
              {getFieldDecorator('approverTime', {
                rules: [{required: false, message: '请输入批准时间！'}],
                initialValue: docInfo.approverTime,
              })(
                <DatePicker format={dateFormat} style={{width:'180px'}}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="有效期">
              {getFieldDecorator('validityTime', {
                rules: [{required: true, message: '请输入有效期！'}],
                initialValue: docInfo.validityTime,
              })(
                <DatePicker format={dateFormat} style={{width:'180px'}}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="文档类别"
            >
              {getFieldDecorator('category', {
                rules: [{required: false, message: '请输入文档类别！'}],
                initialValue: docInfo.category,
              })(
                <Select style={{width: 180}}>
                  {DOC_CATEGORIES.map(it => (<Option value={it} key={it}>{it}</Option>))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="文档级别"
            >
              {getFieldDecorator('docLevel', {
                rules: [{required: false, message: '请输入文档级别！'}],
                initialValue: docInfo.docLevel,
              })(
                <Select style={{width: 180}}>
                  {DOC_LEVELS.map(it => (<Option value={it} key={it}>{it}</Option>))}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="文档密级"
            >
              {getFieldDecorator('seceretLevel', {
                rules: [{required: false, message: '请输入文档密级！'}],
                initialValue: docInfo.seceretLevel,
              })(
                <Select style={{width: 180}}>
                  {DOC_SECRECTS.map(it => (<Option value={it} key={it}>{it}</Option>))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="是否有效"
            >
              {getFieldDecorator('validate', {
                rules: [{required: false, message: '请输入是否有效！'}],
                initialValue: toString(docInfo.validate),
              })(
                <Select style={{width: 180}}>
                  <Option value="true">有效</Option>
                  <Option value="false" >无效</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="上传文档"
            >
              {this.renderUpload()}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem {...submitFormLayout}>
              <Button
                type="primary"
                onClick={this.handleSubmit}
                style={{width: 180}}
              >
                提交
              </Button>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...submitFormLayout}>
              <Button
                type="primary"
                onClick={() => this.props.history.goBack()}
                style={{width: 180}}
              >
                返回
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>);
  };

  render() {
    return (
      <Layout className={styles.main}>
        <Card title={this.getTitle()} className={styles.Card}>
          {this.renderSubmmitForms()}
        </Card>
      </Layout>
    );
  }
}

export default AddDoc;
