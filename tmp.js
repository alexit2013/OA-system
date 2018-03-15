import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import {
    Button,
    Upload,
    Icon,
    Input,
    Modal,
    Divider,
    message,
} from 'antd';
import { INVITE_HISTORY } from '../../../common/constants';
import InviteTable from '../../../components/Table/Table';
import { isHr, isAdmin } from '../../../utils/authority';
import { formatTime } from '../../../utils/timeUtil';
import { queryInviter } from '../../../services/api';

const confirm = Modal.confirm;
const Search = Input.Search;

@connect(state => ({
    invite: state.invite,
}))
class InviteMessage extends React.Component {
    state = {
        emIds: [],
        List: [],
    }

    componentDidMount() {
        this.fetchData();
        queryInviter()
            .then((response) => {
                this.setState({ List: response });
            });
    }
    fetchData = () => { // 获取候选人信息
        this.props.dispatch({
            type: 'invite/queryInviter',
        });
    }

    handleEdit = (emid) => { // 编辑时调用
        const { dispatch } = this.props;
        dispatch(routerRedux.push({
            pathname: '/tabs/invite/invite-message/add-inviter',
            id: emid,
        }));
    }
    handleDelete = (emid) => { //  删除操作时使用
        const { dispatch } = this.props;
        dispatch({
            type: 'invite/deleteInviter',
            payload: emid,
        });
    }
    handleInvite = (emid) => { //  跳转处理
        const { dispatch } = this.props;
        dispatch(routerRedux.push({
            pathname: '/tabs/invite/invite-center',
            id: emid,
        }));
    }
    saveInviter = () => { // 添加信息
        const { dispatch } = this.props;
        dispatch(routerRedux.push('/tabs/invite/invite-message/add-inviter'));
    }
    showDeleteConfirm = () => { //  批量删除时弹出的modal
        const object = {
            title: '确定要删除吗？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onCancel() {
                console.log('Cancel');
            },
        };
        object.onOk = () => {
            if (this.state.emIds.length === 0) {
                message.error('请选择所需要删除的对象');
            } else {
                this.batchDeleteInviter(this.state.emIds);
            }
        };
        confirm(object);
    };
    handleSeleteSearch = (value) => { // 选中数据时调用
        this.props.dispatch({
            type: 'invite/sortCenter',
            payload: value,
        });
    };
    batchDeleteInviter = (arr) => { //  批量删除时调用
        this.props.dispatch({
            type: 'invite/batchDeleteInviter',
            payload: arr,
        });
        this.setState({ emIds: [] });
    };


    handleSkip = (str) => {
        const { List } = this.state;
        const { dispatch } = this.props;
        const plan = [];
        const tech = [];
        const audit = [];
        const elseif = [];
        List.map((item) => {
            if (item.nowStatus === '待进一步邀约' || item.nowStatus === '已邀约待技术面试' || item.nowStatus === '待资格面试' || item.nowStatus === '待综合面试') {
                plan.push(item);
            } else if (item.nowStatus === '待资格面试') {
                tech.push(item);
            } else if (item.nowStatus === '待审核发放offer') {
                audit.push(item);
            } else {
                elseif.push(item);
            }
        });
        if (str === 'plan') {
            dispatch({
                type: 'invite/list',
                payload: plan,
            });
        } else if (str === 'tech') {
            dispatch({
                type: 'invite/list',
                payload: tech,
            });
        } else if (str === 'audit') {
            dispatch({
                type: 'invite/list',
                payload: audit,
            });
        } else if (str === 'else') {
            dispatch({
                type: 'invite/list',
                payload: elseif,
            });
        } else {
            dispatch({
                type: 'invite/list',
                payload: List,
            });
        }
    }

    isHrButton = () => { // 权限处理
        const fetch = this.fetchData;
        if (isHr() || isAdmin()) {
            const props = {
                name: 'file',
                action: INVITE_HISTORY,
                headers: {
                    authorization: 'authorization-text',
                },
                showUploadList: false,
                onChange(info) {
                    if (info.file.status !== 'uploading') {
                        console.log('上传ing......:', info.file, info.fileList);
                    }
                    if (info.file.status === 'done') {
                        fetch();
                        if (info.file.response.length === 0) {
                            message.success(`${info.file.name} 上传成功`);
                        } else {
                            message.error(`${info.file.name} 上传失败，身份证号重复`);
                        }
                    } else if (info.file.status === 'error') {
                        message.error(`${info.file.name} file upload failed`);
                    }
                },
            };
            return ( <
                div style = {
                    { marginBottom: 10 } } >
                <
                Button onClick = {
                    () => this.handleSkip('all') } > 全部面试 < /Button> <
                Button onClick = {
                    () => this.handleSkip('plan') } > 待安排面试 < /Button> <
                Button onClick = {
                    () => this.handleSkip('tech') } > 待资格面试 < /Button> <
                Button onClick = {
                    () => this.handleSkip('audit') } > 待审核 < /Button> <
                Button onClick = {
                    () => this.handleSkip('else') } > 其他 < /Button> <
                Search placeholder = "姓名/责任人/手机号搜索"
                onSearch = {
                    (value) => { this.handleSeleteSearch(value) } }
                enterButton style = {
                    { width: 300, marginLeft: 10 } }
                /> <
                Button style = {
                    { float: 'right' } }
                onClick = { this.saveInviter } >
                <
                Icon type = "plus" / > 添加信息 <
                /Button> <
                Button style = {
                    { float: 'right' } }
                onClick = { this.showDeleteConfirm } >
                <
                Icon type = "delete" / > 批量删除 <
                /Button> <
                div style = {
                    { float: 'right' } } >
                <
                Upload {...props } >
                <
                Button >
                <
                Icon type = "upload" / > 批量导入 <
                /Button> <
                /Upload>  <
                /div> <
                /div>
            );
        } else {
            return ( <
                div style = {
                    { marginBottom: 10 } } >
                <
                Button onClick = { this.saveInviter } >
                <
                Icon type = "plus" / > 添加信息 <
                /Button> <
                /div>
            );
        }
    }
    isHrLink = (item) => {
        if (isHr() || isAdmin()) {
            return ( <
                div >
                <
                a onClick = {
                    () => this.handleEdit(item.zid) } > 编辑 < /a> <
                Divider type = "vertical" / >
                <
                a onClick = {
                    () => this.handleDelete(item.zid) } > 删除 < /a> <
                Divider type = "vertical" / >
                <
                a onClick = {
                    () => this.handleInvite(item.zid) } > 招聘管理 < /a> <
                /div>
            );
        } else {
            return ( <
                div >
                <
                a onClick = {
                    () => this.handleInvite(item.zid) } > 招聘管理 < /a> <
                /div>
            );
        }
    }
    render() {
        const { invite: { list } } = this.props;
        list.map((item) => {
            item.key = item.zid;
        });
        const columns = [{
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            width: 150,
        }, {
            title: '电话',
            dataIndex: 'phoneNo',
            key: 'phoneNo',
            width: 150,
        }, {
            title: '当前状态',
            dataIndex: 'nowStatus',
            key: 'nowStatus',
        }, {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
            width: 80,
        }, {
            title: '岗位名称',
            dataIndex: 'pname',
            key: 'station',
            width: 150,
        }, {
            title: '单位(最近)',
            dataIndex: 'company1',
            key: 'company1',
        }, {
            title: '当前责任人',
            dataIndex: 'chargePerson',
            key: 'chargePerson',
            width: 150,
        }, {
            title: '最后操作时间',
            render: item => ( <
                span > { formatTime(item.lastDate) } < /span>
            ),
        }, {
            title: '操作',
            align: 'center',
            render: item => (
                this.isHrLink(item)
            ),
        }];
        const cbKeys = (keys) => {
            this.setState({
                emIds: [...keys],
            });
        };
        return ( <
            div > { this.isHrButton() } <
            InviteTable cbKeys = { cbKeys }
            columns = { columns }
            dataSource = { list }
            /> <
            /div>
        );
    }
}

export default InviteMessage;