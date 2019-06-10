import React, {Component} from 'react';
import {Table, Button, Popconfirm, message, Modal} from 'antd';
import style from './style.less';
import AddFlowMain from '../../components/addflowmain';
class FlowList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      flowMainData: [
        {
          id: 1,
          username: '发货哈撒火凤凰的撒范德萨',
          loginname: '惹我热无群',
          uname: '发发的撒',
          phone: 321321321321,
          gmt_time: 0
        }
      ],
      isAddVisible: true
    };
  }
  confirm = () => {
    message.success('成功');
  }
  addEvent = () => {
    this.setState({isAddVisible: true});
  }
  cancelEvent = () => {
    this.setState({isAddVisible: false});
  }
  render() {
    const {
      flowMainData,
      isAddVisible
    } = this.state;
    const columns = [
      {
        title: '流量主名称',
        key: 'username',
        dataIndex: 'username'
      },
      {
        title: '登录名',
        key: 'loginname',
        dataIndex: 'loginname'
      },
      {
        title: '联系人',
        key: 'uname',
        dataIndex: 'uname'
      },
      {
        title: '手机',
        key: 'phone',
        dataIndex: 'phone'
      },
      {
        title: '状态',
        key: 'gmt_time',
        dataIndex: 'gmt_time'
      },
      {
        title: '操作',
        key: 'opeartion',
        dataIndex: '',
        render: (record) => (
        <div>
            <Popconfirm
              title="是否要重置密码"
              onConfirm={this.confirm.bind(this)}
              okText="是"
              cancelText="否"
            >
              <span className="blue-color">重置密码</span>
            </Popconfirm>
            <Popconfirm
              title="是否要停用"
              onConfirm={this.confirm.bind(this)}
              okText="是"
              cancelText="否"
            >
              <span className="ml10 blue-color">停用</span>
            </Popconfirm>
            <span className="blue-color ml10">详情</span>
        </div>
        )
      }
    ];
    return (
      <div className={style.flowMain}>
        <Modal
          visible={isAddVisible}
          onCancel={this.cancelEvent.bind(this)}
          footer={
            <div>
              <Button type="primary">保存</Button>
              <Button onClick={this.cancelEvent.bind(this)} style={{marginLeft: '40px'}}>取消</Button>
            </div>
          }
        >
          <AddFlowMain />
        </Modal>
        <h1 className="nav-title">流量主管理<Button type="primary" onClick={this.addEvent.bind(this)}>添加</Button></h1>
        <ul className={style.search}>
          <li></li>
        </ul>
        <Table
          dataSource={flowMainData}
          columns={columns}
          rowKey={record => record.id}
          className="table"
        />
      </div>
    );
  }
}
export default FlowList;