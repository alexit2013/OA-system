import React from 'react';
import {connect} from 'dva';
import {Card, Icon, Layout, List, Menu, Pagination} from 'antd';
import {routerRedux} from 'dva/router';
import {isEmpty} from 'lodash';
import styles from './Notice.less';
import {getShowText} from '../../utils/utils';
import {formatTime} from '../../utils/timeUtil';
import {renderRoute} from '../../utils/routeUtil';

const {Sider, Content} = Layout;// Sider:侧边栏;Content:内部内容。自带默认样式及基本功能

@connect(state => ({
  notice: state.notice,
}))
class Notice extends React.Component {
  state = {
    selectCategory: '通知通告',
    currentPage: 1,
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'notice/queryNotices',
    });
  }
  componentWillUnmount() {
    // // nav数据强制刷新的临时方案
    // location.reload();
  }
  handlerClickDetail = (item) => {
    this.props.dispatch(routerRedux.push({
      pathname: `/tabs/notice/detail/${item.id}`,
    }));
  };

  filterList = (list, type) => {
    return list.filter(item => item.type === type);
  };

  handlerMenuClick = (key) => {
    const {dispatch, location: {pathname}, routeInfo: {path}} = this.props;
    if (pathname !== path) {
      dispatch(routerRedux.push(path));
    }
    this.setState({selectCategory: key});
  }


  renderContent = () => {
    const {notice: {loading, list}} = this.props;
    const defaultPageSize = 5;
    const data = this.filterList(list, this.state.selectCategory);
    const pageList = data.slice((this.state.currentPage - 1) * defaultPageSize,
      this.state.currentPage * defaultPageSize);

    const ListContent = ({data: { createdDate, author}}) => (
      <div className={styles.detailContainer}>
        <Icon type="user"/>
        <span className={styles.userName}>{getShowText(author)}</span>
        <span className={styles.createTimeLabel}>发布时间:</span>
        <span className={styles.createTimeText}>{formatTime(createdDate)}</span>
      </div>
    );
    return (
      <Card
        style={{marginTop: 0}}
        bordered={false}
        bodyStyle={{padding: '0px 32px 32px 32px'}}
      >
        <List
          size="large"
          loading={pageList.length === 0 ? loading : false}
          rowKey="id"
          itemLayout="vertical"
          dataSource={pageList}
          renderItem={item => (
            <List.Item
              className={styles.listItemContainer}
              key={item.id}
              extra={<div className={styles.listItemExtra}/>}
            >
              <List.Item.Meta
                className={styles.itemMetaTitle}
                title={(
                  <a
                    className={styles.docTitle}
                    onClick={() => this.handlerClickDetail(item)}
                  >
                    {item.title}
                  </a>
                )}
              />
              <ListContent data={item}/>
            </List.Item>
          )}
        />
        {!isEmpty(data) && (
          <Pagination
            className={styles.pagination}
            current={this.state.currentPage}
            pageSize={defaultPageSize}
            showQuickJumper
            total={data.length}
            onChange={page =>
              this.setState({currentPage: page})}
          />)}
      </Card>
    );
  };

  renderSildeMenu = () => {
    return (
      <Sider
        className={styles.sider}
        trigger={null}
        collapsible
        collapsed={false}
        breakpoint="md"
        width={200}
        style={{backgroundColor: '#fff'}}
      >
        <Menu
          onClick={event => this.handlerMenuClick(event.key)}
          theme="white"
          mode="inline"
          style={{margin: '16px 0', width: '100%'}}
          selectedKeys={[this.state.selectCategory]}
        >
          {['通知通告', '管理规定', '任命信息'].map(category => (
            <Menu.Item
              key={category}
            >
              {category}
            </Menu.Item>))}
        </Menu>
      </Sider>);
  };

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

export default Notice;
