import React, {Component} from 'react';
import {Table} from 'antd';
class Help extends Component {
    constructor(props) {
      super(props);  
      this.state = {
        data: []
      }
    }
    render() {
        const {data} = this.state;
        const columns = [
          {
            title: 'value',
            dataIndex: 'value',
            key: 'value'
          },
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
          },
          {
            title: '编辑',
            dataIndex: '',
            key: '',
            render: (record) => (
              <a onClick={this.btnEvent.bind(this, record.value)}>编辑</a>
            )
          }
        ]
        return (
          <div>
            <Table rowKey={record => record.value} columns={columns} dataSource={data} />
          </div>
        )
    }
}
export default Help;