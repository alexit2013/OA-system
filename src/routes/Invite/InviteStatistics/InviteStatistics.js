import React from 'react';
import styles from './InviteStatistics.less';
import {staticsticsInfoInviter} from '../../../services/api';


class InviteStatistics extends React.Component {
  state = {
    statisticsData: [],
  }
  componentDidMount() {
    this.staticsticsInfo();
  }
  staticsticsInfo = () => {
    staticsticsInfoInviter()
      .then((response) => {
        this.setState({statisticsData: response});
      });
  }
  alloContent = () => {
    const {statisticsData} = this.state;
    const tempArr = [];
    statisticsData.map((it, i) => {
      if (i === statisticsData.length - 1) {
        tempArr.unshift(it);
      } else {
        tempArr.push(it);
      }
    });
    return tempArr.map((it, i) => {
      if (i === 0) {
        return (
          <tr className={styles.header} key={i}>
            <td colSpan="3">总计</td>
            <td>{it.gmount}</td>
            <td>{it.gyifao}</td>
            <td>{it.gyruz}</td>
            <td>{it.goffered}</td>
            <td>{it.goffering}</td>
            <td>{it.mount}</td>
            <td>{it.yifao}</td>
            <td>{it.yruz}</td>
            <td>{it.offered}</td>
            <td>{it.offering}</td>
          </tr>
        );
      } else {
        return (
          <tr className={styles.Content} key={i}>
            <td>{it.yjbm}</td>
            <td>{it.ejbm}</td>
            <td>{it.gwlb}</td>
            <td>{it.gmount}</td>
            <td>{it.gyifao}</td>
            <td>{it.gyruz}</td>
            <td>{it.goffered}</td>
            <td>{it.goffering}</td>
            <td>{it.mount}</td>
            <td>{it.yifao}</td>
            <td>{it.yruz}</td>
            <td>{it.offered}</td>
            <td>{it.offering}</td>
          </tr>
        );
      }
    });
  }
  render() {
    return (
      <div style={{width: '100%', margin: '0 auto'}} className={styles.Main}>
        <div className={styles.title}>情况汇总表</div>
        <table border="1" className={styles.table}>
          <tbody className={styles.body}>
            <tr className={styles.header}>
              <td rowSpan="2" width="75">一级部门</td>
              <td rowSpan="2" width="175">二级部门</td>
              <td rowSpan="2" width="150">岗位类别</td>
              <td colSpan="5">高优先级岗位招聘情况汇总</td>
              <td colSpan="5">总体招聘情况汇总</td>
            </tr>
            <tr className={styles.header}>
              <td width="110">优先招聘目标</td>
              <td width="70">已发<br/>offer</td>
              <td width="70">已入职</td>
              <td width="120">完成率<br/>（已入职人员）</td>
              <td width="130">完成率<br/>（含待入职人员）</td>
              <td width="80">总招聘<br/>目标</td>
              <td width="70">已发<br/>offer</td>
              <td width="70">已入职</td>
              <td width="120">完成率<br/>（已入职人员）</td>
              <td width="130">完成率<br/>（含待入职人员）</td>
            </tr>
            {this.alloContent()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default InviteStatistics;

// <tr>
//   <td rowSpan="13" width="90">研发中心</td>
//   <td rowSpan="3" width="125">能量平台<br/>开发部</td>
//   <td width="95">电子类</td>
//   {this.alloc('0').map((it, i) => {
//     return <td key={i}>{it}</td>;
//   })}
// </tr>
// <tr>
//   <td>机械类</td>
//   {this.alloc('1').map((it, i) => {
//     return <td key={i}>{it}</td>;
//   })}
// </tr>
// <tr>
//   <td>软件类</td>
//   {this.alloc('2').map((it, i) => {
//     return <td key={i}>{it}</td>;
//   })}
// </tr>
// <tr>
//   <td rowSpan="4">视觉平台<br/>开发部</td>
//   <td>电子类</td>
//   {this.alloc('3').map((it, i) => {
//     return <td key={i}>{it}</td>;
//   })}
// </tr>
// <tr>
//   <td>机械类</td>
//   {this.alloc('4').map((it, i) => {
//     return <td key={i}>{it}</td>;
//   })}
// </tr>
// <tr>
//   <td>软件类</td>
//   {this.alloc('5').map((it, i) => {
//     return <td key={i}>{it}</td>;
//   })}
// </tr>
// <tr>
//   <td>算法类</td>
//   {this.alloc('6').map((it, i) => {
//     return <td key={i}>{it}</td>;
//   })}
// </tr>
// <tr>
//   <td rowSpan="5">手术机器人<br/>开发部</td>
//   <td>电子类</td>
//   {this.alloc('7').map((it, i) => {
//     return <td key={i}>{it}</td>;
//   })}
// </tr>
// <tr>
//   <td>机械类</td>
//   {this.alloc('8').map((it, i) => {
//     return <td key={i}>{it}</td>;
//   })}
// </tr>
// <tr>
//   <td>控制类</td>
//   {this.alloc('9').map((it, i) => {
//     return <td key={i}>{it}</td>;
//   })}
// </tr>
// <tr>
//   <td>软件类</td>
//   {this.alloc('10').map((it, i) => {
//     return <td key={i}>{it}</td>;
//   })}
// </tr>
// <tr>
//   <td>算法类</td>
//   {this.alloc('11').map((it, i) => {
//     return <td key={i}>{it}</td>;
//   })}
// </tr>
// <tr>
//   <td>工程工艺设计部</td>
//   <td>工艺类</td>
//   {this.alloc('12').map((it, i) => {
//     return <td key={i}>{it}</td>;
//   })}
// </tr>
// <tr>
//   <td rowSpan="3">运营部</td>
//   <td>测试部</td>
//   <td>测试类</td>
//   {this.alloc('13').map((it, i) => {
//     return <td key={i}>{it}</td>;
//   })}
// </tr>
// <tr>
//   <td>PMO</td>
//   <td>项目管理类</td>
//   {this.alloc('14').map((it, i) => {
//     return <td key={i}>{it}</td>;
//   })}
// </tr>
// <tr>
//   <td>IT与信息安全部</td>
//   <td>IT信息类</td>
//   {this.alloc('15').map((it, i) => {
//     return <td key={i}>{it}</td>;
//   })}
// </tr>
// <tr>
//   <td rowSpan="3">生产中心</td>
//   <td rowSpan="2">供应链管理部</td>
//   <td>采购类</td>
//   {this.alloc('16').map((it, i) => {
//     return <td key={i}>{it}</td>;
//   })}
// </tr>
// <tr>
//   <td>生产供应链类</td>
//   {this.alloc('17').map((it, i) => {
//     return <td key={i}>{it}</td>;
//   })}
// </tr>
// <tr>
//   <td>生产部</td>
//   <td>生产技术类</td>
//   {this.alloc('18').map((it, i) => {
//     return <td key={i}>{it}</td>;
//   })}
// </tr>
// <tr>
//   <td>人事行政部</td>
//   <td>人事行政部</td>
//   <td>人事行政类</td>
//   {this.alloc('19').map((it, i) => {
//     return <td key={i}>{it}</td>;
//   })}
// </tr>
// <tr>
//   <td rowSpan="4">质量法规部</td>
//   <td>质量体系部</td>
//   <td>质量类</td>
//   {this.alloc('20').map((it, i) => {
//     return <td key={i}>{it}</td>;
//   })}
// </tr>
// <tr>
//   <td>法规与临床事务部</td>
//   <td>法规类</td>
//   {this.alloc('21').map((it, i) => {
//     return <td key={i}>{it}</td>;
//   })}
// </tr>
// <tr>
//   <td>供应商质量管理组</td>
//   <td>质量类</td>
//   {this.alloc('22').map((it, i) => {
//     return <td key={i}>{it}</td>;
//   })}
// </tr>
// <tr>
//   <td>生产质量管理部</td>
//   <td>质量类</td>
//   {this.alloc('23').map((it, i) => {
//     return <td key={i}>{it}</td>;
//   })}
// </tr>
// <tr>
//   <td>财务部</td>
//   <td>财务部</td>
//   <td>财务类</td>
//   {this.alloc('24').map((it, i) => {
//     return <td key={i}>{it}</td>;
//   })}
// </tr>
// <tr>
//   <td rowSpan="2">战略市场部</td>
//   <td rowSpan="2">战略市场部</td>
//   <td>产品市场类</td>
//   {this.alloc('25').map((it, i) => {
//     return <td key={i}>{it}</td>;
//   })}
// </tr>
// <tr>
//   <td>品牌设计类</td>
//   {this.alloc('26').map((it, i) => {
//     return <td key={i}>{it}</td>;
//   })}
// </tr>
