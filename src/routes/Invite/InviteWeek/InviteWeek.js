import React from 'react';
import {DatePicker} from 'antd';
import {connect} from 'dva';
import {weekInviter, dateWeekInviter} from '../../../services/api';
import styles from './InviteWeek.less';

const { RangePicker } = DatePicker;
@connect(state => ({
  invite: state.invite,
}))
class InviteWeek extends React.Component {
  state = {
    WeekData: [],
  }
  componentDidMount() {
    this.WeekInfo();
  }
  WeekInfo = () => {
    weekInviter()
      .then((response) => {
        // console.log('res: ', response);
        this.setState({WeekData: response});
      });
  }
  handleChangePicker = (value) => {
    if (value.length !== 0) {
      dateWeekInviter(value)
        .then((res) => {
          // console.log('res: ', res);
          this.setState({WeekData: res});
        });
    }
  }
  alloContent = () => {
    const {WeekData} = this.state;
    return WeekData.map((it, i) => {
      if (i === WeekData.length - 1 ) {
        return (
          <tr key={i} className={styles.totle}>
            <td colSpan="2">{it.yjbm}</td>
            <td>{it.msbtg}</td>
            <td>{it.djybyy}</td>
            <td>{it.yyydjsms}</td>
            <td>{it.dzgms}</td>
            <td>{it.dzhms}</td>
            <td>{it.oyxgt}</td>
            <td>{it.dspo}</td>
            <td>{it.dffo}</td>
            <td>{it.gjrz}</td>
            <td>{it.yrz}</td>
            <td>{it.spbtg}</td>
            <td>{it.fqo}</td>
            <td>{it.frzyc}</td>
            <td>{it.lrhmd}</td>
            <td>{it.count}</td>
          </tr>
        );
      } else {
        return (
          <tr key={i} className={styles.Content}>
            <td>{it.yjbm}</td>
            <td>{it.ejbm}</td>
            <td>{it.msbtg}</td>
            <td>{it.djybyy}</td>
            <td>{it.yyydjsms}</td>
            <td>{it.dzgms}</td>
            <td>{it.dzhms}</td>
            <td>{it.oyxgt}</td>
            <td>{it.dspo}</td>
            <td>{it.dffo}</td>
            <td>{it.gjrz}</td>
            <td>{it.yrz}</td>
            <td>{it.spbtg}</td>
            <td>{it.fqo}</td>
            <td>{it.frzyc}</td>
            <td>{it.lrhmd}</td>
            <td>{it.count}</td>
          </tr>
        );
      }
    });
  }
  rangePicker = () => {
    return (
      <RangePicker
        onChange={this.handleChangePicker}
        placeholder={['开始时间', '结束时间']}
      />
    );
  }
  render() {
    return (
      <div style={{width: '100%', margin: '0 auto'}} className={styles.Main} >
        <div className={styles.title}>周报</div>
        {this.rangePicker()}
        <table border="1" className={styles.table}>
          <tbody className={styles.body}>
            <tr className={styles.header}>
              <td rowSpan="2" width="200">一级部门</td>
              <td rowSpan="2" width="250">二级部门</td>
              <td rowSpan="2" width="150">面试不通过（含电话邀约）</td>
              <td rowSpan="2" width="100">待进一步邀约</td>
              <td rowSpan="2" width="100">已邀约待技术面试</td>
              <td rowSpan="2" width="100">待资格面试</td>
              <td rowSpan="2" width="100">待综合面试</td>
              <td rowSpan="2" width="100">offer意向沟通</td>
              <td rowSpan="2" width="100">待审批Offer</td>
              <td rowSpan="2" width="100">待发放Offer</td>
              <td rowSpan="2" width="100">跟进入职</td>
              <td rowSpan="2" width="100">已入职</td>
              <td rowSpan="2" width="100">审批不通过</td>
              <td rowSpan="2" width="100">放弃Offer</td>
              <td rowSpan="2" width="100">放入资源池</td>
              <td rowSpan="2" width="100">列入黑名单</td>
              <td rowSpan="2" width="100">总计</td>
            </tr>
            <tr />
            {this.alloContent()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default InviteWeek;

// handleChangeCascader = (arr) => {
//   const value = trimDate(arr);
//   const {titleArr,flag} = this.state;
//   if (value[1] === 'no') {
//     titArr.splice(value[0],1);
//     this.setState({titleArr: titArr});
//   } else {
//     for (let i = 0; i<titleArr.length; i++) {
//       if (titleArr[i]['title'] === value[1]) {
//         return message.error('选择重复！');
//         this.setState({flag: false});
//       }
//     }
//     if (flag) {
//       titArr[value[0]] = {title: value[1], dataIndex: value[2], key: value[2]};
//       this.setState({titleArr: titArr});
//     }
//     const index = titArr.length-1;
//     if ( titArr[index]['title'] != '总计') {
//       titArr[index+1] = {title: '总计', dataIndex: 'totle', key: 'totle'};
//     }
//   }
// }
// forEach = () => {
//   const optArr = [];
//   INVITE_STATUS.map((it, i) => {
//     optArr.push({value: it, label: it});
//   });
//   optArr.push({value: 'no', label: '删除此列'});
//   return optArr;
// }

// cascader = () => {
//   const options = [{
//     value: '1',
//     label: '第二列',
//     children: this.forEach(),
//   }, {
//     value: '2',
//     label: '第三列',
//     children: this.forEach(),
//   }, {
//     value: '3',
//     label: '第四列',
//     children: this.forEach(),
//   }, {
//     value: '4',
//     label: '第五列',
//     children: this.forEach(),
//   }, {
//     value: '5',
//     label: '第六列',
//     children: this.forEach(),
//   }];
//   return (
//     <Cascader options={options} onChange={this.handleChangeCascader} placeholder="请选择列标签" />
//   )
// }

// total = (arr) => {
//   const { titleArr } = this.state;
//   const keyArr = [];
//   titleArr.map((it,i) => {
//     it['width'] = 100;
//     if (it['title'] !== '部门' && it['title'] !== '总计') {
//       keyArr.push(it.dataIndex)
//     }
//   })
//   arr.map((it, i) => {
//     let totleTemp = 0;
//     if (i !== 23) {
//       for (let keys in it) {
//         keyArr.map((items, index) => {
//           if (keys === items){
//             totleTemp += parseInt(it[keys]);
//           }
//         })
//       }
//       it.totle = totleTemp;
//       it.key = i;
//     }
//   })
//   return arr;
// }

// handleData = (data) => {
//   const arr = this.total(data);
//   let resaultTotle = 0;
//   const arr0 = [arr[1], arr[2], arr[3], arr[4]];
//   const arr1 = [arr[6], arr[7], arr[8]];
//   const arr2 = [arr[10], arr[11]];
//   const arr3 = [arr[13]];
//   const arr4 = [arr[15], arr[16], arr[17], arr[18]];
//   const arr5 = [arr[20]];
//   const arr6 = [arr[22]];
//   const temparr = [arr0, arr1, arr2, arr3, arr4, arr5, arr6];
//   const resultArr = arr.filter((it, i) => {
//   if (i === 0 || i === 5 || i === 9 || i === 12 || i === 14 || i === 19 || i === 21 || i === 23) {
//     return true;
//   }
//   });
//   resultArr.map((it,i) => {
//     if (i !== 7) {
//       it.children = temparr[i];
//       resaultTotle += it.totle;
//     } else {
//       it.totle = resaultTotle;
//       it.key = 23;
//     }
//   });
//   return resultArr;
// }


// import React from 'react';
// import {connect} from 'dva';
// // import {Table, Cascader, DatePicker, message} from 'antd';
// import {Table, DatePicker} from 'antd';
// // import {INVITE_STATUS} from '../../../common/constants';
// // import {trimDate} from '../../../utils/inviteWeek';


// // const titArr = [
// //   {title: '部门', dataIndex: 'department', key: 'department'},
// //   {title: '已发offer', dataIndex: 'dffo', key: 'dffo'},
// //   {title: '已邀约待技术面试', dataIndex: 'yyydjsms', key: 'yyydjsms'},
// //   {title: '待综合面试', dataIndex: 'dzhms', key: 'dzhms'},
// //   {title: '待资格面试', dataIndex: 'dzgms', key: 'dzgms'},
// //   {title: '总计', dataIndex: 'totle', key: 'totle'},
// // ];
// const { RangePicker } = DatePicker;

// @connect(state => ({
//   invite: state.invite,
// }))
// class InviteWeek extends React.Component {
//   state = {
//     titleArr: titArr,
//     // flag: true,
//   }
//   componentWillMount() {
//     this.fetchDataNoParam();
//   }
//   fetchDataNoParam = () => {
//     this.props.dispatch({
//       type: 'invite/fetchWeek',
//     });
//   }

//   handleChangePicker = (value) => {
//     if (value.length !== 0) {
//       this.props.dispatch({
//         type: 'invite/fetchWeekDate',
//         payload: value,
//       });
//     }
//   }
//   render() {
//     // const columns = this.state.titleArr;
//     // const columns = [
//     //   {title: '部门', dataIndex: 'department', key: 'department'},
//     //   {title: '面试不通过（含电话邀约）', dataIndex: 'department', key: 'department'},
//     //   {title: '待进一步邀约', dataIndex: 'department', key: 'department'},
//     //   {title: '已邀约待技术面试', dataIndex: 'department', key: 'department'},
//     //   {title: '待资格面试', dataIndex: 'department', key: 'department'},
//     //   {title: '待综合面试', dataIndex: 'department', key: 'department'},
//     //   {title: 'offer意向沟通', dataIndex: 'department', key: 'department'},
//     //   {title: '待审批Offer', dataIndex: 'department', key: 'department'},
//     //   {title: '待发放Offer', dataIndex: 'department', key: 'department'},
//     //   {title: '跟进入职', dataIndex: 'department', key: 'department'},
//     //   {title: '已入职', dataIndex: 'department', key: 'department'},
//     //   {title: '审批不通过', dataIndex: 'department', key: 'department'},
//     //   {title: '放弃Offer', dataIndex: 'department', key: 'department'},
//     //   {title: '放入资源池', dataIndex: 'department', key: 'department'},
//     //   {title: '列入黑名单', dataIndex: 'department', key: 'department'},
//     //   {title: '总计', dataIndex: 'department', key: 'department'},
//     // ]
//     const {invite: {seclist}} = this.props;
//     // const dataSource = this.handleData(seclist);
//     // const dataSource =  this.total(list,this.total(seclist));
//     return (
//       <div>
//         {this.rangePicker()}
//         {/* {this.cascader()} */}
//         <Table
//           columns={columns}
//           dataSource={dataSource}
//           pagination={false}
//           bordered
//         />
//       </div>
//     );
//   }
// }

// export default InviteWeek;
