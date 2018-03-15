import React, {Component} from 'react';
import {connect} from 'dva';
import {Card, Icon, Divider, Input, Button, message} from 'antd';
import {isEmpty} from 'lodash';
import {getNoticeById, getCommentByNoticeId, saveComment} from '../../services/api';
import styles from './NoticeDetail.less';
import { DOWNLOAD_FILE } from '../../common/constants';
import {formatTime} from '../../utils/timeUtil';

@connect(state => ({
  notice: state.notice,
}))
export default class NoticeDetail extends Component {
  state = {
    data: {},
    comment: '',
    commentList: [],
  };

  componentDidMount() {
    const {match: {params: {id}}} = this.props;
    getNoticeById(id)
      .then((response) => {
        // console.log('response: ',response);
        this.setState({data: response});
      });

    getCommentByNoticeId(id)
      .then((response) => {
        this.setState({commentList: response});
      });
  }

  addComment = () => {
    const {match: {params: {id}}} = this.props;
    const params = {noticeId: id, content: this.state.comment};
    if (isEmpty(params.noticeId) || isEmpty(params.content)) {
      return false;
    }
    saveComment(params).then((response) => {
      if (response.response && !response.response.ok) {
        message.error('评论失败，请稍后重试');
      } else {
        this.setState({commentList: Object.assign([response, ...this.state.commentList]), comment: ''});
        message.success('评论成功');
      }
    });
  };

  renderAttach = () => {
    const IconText = ({type, text}) => (
      <span>
        <Icon type={type} style={{marginRight: 4}}/>
        {text}
      </span>
    );
    const {viewCount, createdDate, author, fileList} = this.state.data;
    if (Object.prototype.toString.call(fileList) === '[object Array]') {
      return (
        <div className={styles.tips}>
          <IconText type="eye-o" text={viewCount}/>
          <IconText type="calendar" text={formatTime(createdDate)}/>
          <IconText type="user" text={author}/>
          {fileList.map((it,i) => (
            <IconText key={i} type="download" text={<a key={it.id} href={`${DOWNLOAD_FILE}\\${it.id}`}>{it.fileName}</a>}/>
            ))}
        </div>);
    } else {
      return null;
    }
  }

  renderComments = (comment) => {
    return (
      <div className={styles.text}>
        <div className={styles.commentTile}>
          <div className={styles.commentAuthor}>{comment.author}</div>
          <div className={styles.commentDate}>{comment.createdDate}</div>
        </div>
        <div className={styles.commentContent}>{comment.content}</div>
      </div>
    );
  };

  render() {
    const IconText = ({type, text}) => (
      <span>
        <Icon type={type} style={{marginRight: 4}}/>
        {text}
      </span>
    );
    const {title, content} = this.state.data;
    return (
      <Card bordered={false}>
        <div>
          <h3>{title}</h3>
          {this.renderAttach()}
        </div>
        <Divider style={{marginBottom: 25}}/>
        <div className={styles.content} dangerouslySetInnerHTML={{__html: content}}/>
        <Divider style={{marginBottom: 25}}/>
        <div className={styles.comment}>
          <div className={styles.commentCount}>共{this.state.commentList.length}条评论</div>
          <div className={styles.commentInput}>
            <Input
              placeholder="添加评论"
              className={styles.commentAdd}
              value={this.state.comment}
              onChange={e => this.setState({comment: e.target.value})}
            />
            <Button className={styles.commentBtn} onClick={this.addComment}>评论</Button>
          </div>
          {this.state.commentList.map(comment => this.renderComments(comment))}
        </div>
      </Card>
    );
  }
}
