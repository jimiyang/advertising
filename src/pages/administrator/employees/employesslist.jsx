import React, {Component} from 'react';
import {Table, Popconfirm, message, Button, Input, Select, Modal} from 'antd';
import style from './style.less';
import AddEmployess from '../../components/addemployess';
const Option = Select.Option;
class EmployessList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      employessData: [
        {
          id: 1,
          username: '哈哈哈哈哈哈哈啊',
          loginname: '吉米额呵呵呵',
          phone: '2312321321321',
          gmt_time: '2019-12-02 12:12:12'
        }
      ],
      isAddVisible: false
    };
  }
  confirm = () => {
    message.warning('重置成功');
  }
  closeEvent = () => {
    this.setState({
      isAddVisible: false
    })
  }
  render() {
    const {
      employessData,
      isAddVisible
    } = this.state;
    const columns = [
      {
        title: '姓名',
        key: 'username',
        dataIndex: 'username'
      },
      {
        title: '登录名',
        key: 'loginname',
        dataIndex: 'loginname'
      },
      {
        title: '电话',
        key: 'phone',
        dataIndex: 'phone'
      },
      {
        title: '创建时间',
        key: 'gmt_time',
        dataIndex: 'gmt_time'
      },
      {
        title: '操作',
        key: 'opeartion',
        dataIndex: '',
        render: (record) => (
          <div>
            <span className="blue-color">编辑</span>
            <Popconfirm
              title="是否要重置密码"
              onConfirm={this.confirm.bind(this)}
              okText="是"
              cancelText="否"
            >
              <span className="ml10 blue-color">重置密码</span>
            </Popconfirm>
            <Popconfirm
              title="是否要停用"
              onConfirm={this.confirm.bind(this)}
              okText="是"
              cancelText="否"
            >
              <span className="ml10 blue-color">停用</span>
            </Popconfirm>
          </div>
        )
      }
    ];
    return(
      <div className={style.employess}>
        <Modal
          visible={isAddVisible}
          onCancel={this.closeEvent.bind(this)}
          width={510}
          footer={
            <div>
              <Button type="primary">保存</Button>
              <Button style={{marginLeft: '22px'}} onClick={this.closeEvent.bind(this)}>返回</Button>
            </div>
          }
        >
          <AddEmployess />
        </Modal>
        <h1 className="nav-title">员工管理<Button type="primary">添加员工</Button></h1>
        <ul className={style.search}>
          <li>
            员工姓名
            <Input />
          </li>
          <li>
            登录名
            <Input />
          </li>
          <li>
            状态
            <Select defaultValue="">
              <Option value="">请选择</Option>
              <Option value={0}>停用</Option>
              <Option value={1}>启用</Option>
            </Select>
          </li>
          <li>
            <Button type="primary">查询</Button>
            <Button className="ml10">清空</Button>
          </li>
        </ul>
        <Table
          dataSource={employessData}
          columns={columns}
          rowKey={record => record.id}
          className="table"
        />
      </div>
    );
  }
}
export default EmployessList;