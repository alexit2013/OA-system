import React from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Button, Form, Icon, Input, Layout, List, Menu, Pagination} from 'antd';
import {chain, isEmpty} from 'lodash';
import {DOC_CATEGORIES} from '../../common/constants';
import styles from './TechDoc.less';
import {getShowText} from '../../utils/utils';
import {formatTime} from '../../utils/timeUtil';
import {renderRoute} from '../../utils/routeUtil';

const {Sider, Content} = Layout;
const FormItem = Form.Item;

const defaultPageSize = 5;
const ALL_CATEGORY = '全部';

@connect(state => ({
  document: state.document,
}))
@Form.create()
class TechDoc extends React.Component {
  constructor(props) {
    super(props);
    this.categories = [ALL_CATEGORY, ...DOC_CATEGORIES];
    this.state = {
      selectCategory: this.categories[0],
      currentPage: 1,
      formValues: {},
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'document/fetchList',
    });
  }

  handleSearchClick = () => {
    const {form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });
    });
  }

  handlerResetClick = () => {
    const {form} = this.props;
    form.resetFields();
    this.setState({formValues: {}});
  }

  handlerClickDetail = (doc) => {
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname: `/tabs/techdoc/detail/${doc.id}`,

    }));
  }

  filterSearchList = (searchText, list) =>
    chain(list)
      .filter((it) => {
        if (isEmpty(it.category) || this.state.selectCategory === ALL_CATEGORY) {
          return true;
        }
        return it.category.includes(this.state.selectCategory);
      })
      .filter((it) => {
        if (isEmpty(searchText)) {
          return true;
        }
        return !isEmpty(it.title) && it.title.includes(searchText);
      })
      .value();

  handlerMenuClick = (key) => {
    const {dispatch, location: {pathname}, routeInfo: {path}} = this.props;
    if (pathname !== path) {
      dispatch(routerRedux.push(path));
    }
    this.setState({selectCategory: key});
  }

  renderSearch = () => {
    const {getFieldDecorator} = this.props.form;
    return (
      <div className={styles.searchContainer}>
        <Form layout="inline" >

          <span className={styles.searchText}>文档搜索</span>
          <FormItem>
            {getFieldDecorator('searchTxt')(
              <Input className={styles.searchInput} placeholder="请输入"/>
            )}
          </FormItem>
          <Button type="primary" className={styles.searchButton} onClick={this.handleSearchClick}>搜索</Button>
          <Button type="primary" className={styles.resetButton} style={{marginLeft: 8}} onClick={this.handlerResetClick}>重置</Button>
        </Form>
      </div>
    );
  }

  renderList = (loading, list) => {
    const ListContent = ({data}) => (
      <div
        className={styles.listItemContainer}
      >
        <a
          className={styles.docTitle}
          onClick={() => this.handlerClickDetail(data)}
        >
          {getShowText(data.title)}
        </a>
        <div className={styles.detailContainer}>
          <Icon type="user"/>
          <span className={styles.userName}>{getShowText(data.author)}</span>
          <span className={styles.createTimeLabel}>发布时间:</span>
          <span className={styles.createTimeText}>{formatTime(data.authorTime)}</span>
          <Icon type="download" className={styles.downloadIcon}/>
          <span className={styles.downloadCount}>{data.downloadCount}</span>
        </div>
      </div>
    );
    return (
      <List
        className={styles.list}
        rowKey="id"
        loading={loading}
        pagination={false}
        dataSource={list}
        renderItem={item => (
          <List.Item>
            <ListContent data={item}/>
          </List.Item>
        )}
      />
    );
  }


  renderPagenation = (showList, currentPage) => {
    if (showList.length === 0) {
      return (<div/>);
    }
    return (
      <Pagination
        className={styles.pagination}
        current={currentPage}
        pageSize={defaultPageSize}
        showQuickJumper={showList.length > defaultPageSize}
        total={showList.length}
        onChange={page =>
          this.setState({currentPage: page})}
      />);
  }

  renderContent = () => {
    const {document: {loading, list}} = this.props;
    const {formValues: {searchTxt}, currentPage} = this.state;

    const showList = this.filterSearchList(searchTxt, list);

    const pageList = showList.slice((currentPage - 1) * defaultPageSize,
      currentPage * defaultPageSize);

    return (
      <div>
        {this.renderSearch()}
        {this.renderList(loading, pageList)}
        {this.renderPagenation(showList, currentPage)}
      </div>
    );
  }

  renderSildeMenu = () => {
    return (
      <Sider
        className={styles.sider}
        trigger={null}
        collapsible
        collapsed={false}
        breakpoint="md"
        width={200}
      >
        <Menu
          onClick={event => this.handlerMenuClick(event.key)}
          mode="inline"
          style={{width: '100%'}}
          selectedKeys={[this.state.selectCategory]}
        >
          {this.categories.map(category => (
            <Menu.Item
              key={category}
            >
              {category}
            </Menu.Item>))}
        </Menu>
      </Sider>);
  }


  render() {
    return (
      <Layout className={styles.main}>
        {this.renderSildeMenu()}
        <Content>
          {renderRoute(this.props, this.renderContent)}
        </Content>
      </Layout>);
  }
}

export default TechDoc;
