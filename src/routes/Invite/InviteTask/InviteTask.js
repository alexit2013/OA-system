import React from 'react';
import {Button,Table} from 'antd';
import { routerRedux } from 'dva/router';
import {connect} from 'dva'; 
import InviteTable from '../../../components/Table/Table';
import InviteTech from './InviteTech';
import InviteQual from './InviteQual';
import InviteComp from './InviteComp';
import { isEmpty } from 'lodash';


class InviteTask extends React.Component {
	state = {
		emIds: [],
		List: [],
		loading: false,
	}
	componentDidMount() {
		this.props.dispatch({
			type: 'invite/fetchData',
		});
	}
	handleSkip = (item) => { //跳转判断
		if (item.status === '待资格面试') {
			// console.log('/////');
			this.props.dispatch(routerRedux.push({
				pathname: '/tabs/invite/invite-task/qual-invite',
				id: item.interviewNo,
			}))
		} else if (item.status === '待技术面试') {
			this.props.dispatch(routerRedux.push({
				pathname: '/tabs/invite/invite-task/tech-invite',
				id: item.interviewNo,
			}))
		} else if (item.status === '待综合面试') {
			this.props.dispatch(routerRedux.push({
				pathname: '/tabs/invite/invite-task/comp-invite',
				id: item.interviewNo,
			}))
		}
	}
	handleSkipt = () => {
	    const {dispatch} = this.props;
	    dispatch(routerRedux.push('/tabs/invite/invite-task'))
    }
	render() {
		const {invite:{ list, loading}} = this.props;
		let temp = [];
		list.map((item) => {
			item.key = item.adid;
			if (item.solveDate === null) {
				temp.push(item);
			}
		});
		const columns = [{
			title: '候选人',
			dataIndex: 'name',
			key: 'name',
		}, {
			title: '面试类型',
			dataIndex: 'status',
			key: 'status',
		}, {
			title: '处理人',
			dataIndex: 'conductor',
			key: 'conductor',
		}, {
			title: '操作',
			render: item => (
				<div>
					<a onClick={() => this.handleSkip(item)}>准备面试</a>
				</div>
			)
		}];

		return (
			<div>
				<Button onClick={this.handleSkipt}>待处理面试</Button>
                <Button onClick={this.handleSkipt}>待资格面试</Button>
				<Table 
				  columns={columns}
				  dataSource={temp}
				  loading={loading}
				/>
			</div>
		);
	}
}
export default connect(state => ({
	invite: state.invite,
}))(InviteTask);