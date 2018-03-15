import React from 'react';
import {Button, Card, Form} from 'antd';
import {toString} from 'lodash';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import {getShowText} from '../../utils/utils';
import { queryDoc} from '../../services/api';
import {DOWNLOAD_FILE} from '../../common/constants';
import styles from './DocDetail.less';
import {formatTime} from '../../utils/timeUtil';

const {Description} = DescriptionList;


@Form.create()
class DocDetail extends React.Component {
  state = {
    docDetail: {},
  }

  componentDidMount() {
    const {match: {params: {docId}}} = this.props;
    queryDoc(docId)
      .then((respones) => {
        this.setState({docDetail: respones});
      });
  }

  render() {
    const {docDetail} = this.state;
    return (
      <div className={styles.main}>
        <PageHeaderLayout title="文档详情">
          <Card id="basic-info">
            <DescriptionList size="large" title={docDetail.title}>
              <Description term="编制人">{getShowText(docDetail.author) }</Description>
              <Description term="编制人部门">{getShowText(docDetail.authorDepartment) }</Description>
              <Description term="编制时间">{formatTime(docDetail.authorTime) }</Description>
              <Description term="审核人">{ getShowText(docDetail.reviewer)}</Description>
              <Description term="审核人部门">{getShowText(docDetail.reviewDepartment) }</Description>
              <Description term="审核时间">{formatTime(docDetail.reviewTime) }</Description>
              <Description term="批准人">{getShowText(docDetail.approver)}</Description>
              <Description term="批准人部门">{getShowText(docDetail.approverDepartment)}</Description>
              <Description term="批准时间">{formatTime(docDetail.approverTime) }</Description>
              <Description term="有效期">{ formatTime(docDetail.validityTime) }</Description>
              <Description term="文档类别">{ getShowText(docDetail.category) }</Description>
              <Description term="文档级别">{getShowText(docDetail.docLevel) }</Description>
              <Description term="是否有效">{ getShowText(docDetail.validate) }</Description>
              <Description term="查看次数">{ toString(docDetail.viewCount) }</Description>
              <Description term="下载次数">{ toString(docDetail.downloadCount) }</Description>
            </DescriptionList>
          </Card>
        </PageHeaderLayout>
        <Button
          className={styles.downloadBtn}
          icon="download"
        >
          <a href={`${DOWNLOAD_FILE}\\\\${docDetail.docNo}`}>点击下载</a>
        </Button>
      </div>
    );
  }
}

export default DocDetail;
