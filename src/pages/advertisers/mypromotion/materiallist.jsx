import React, {Component} from 'react';
import {Checkbox, Input, Button, Table} from 'antd';
import style from './style.less';
class MaterialList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      articletypeData: ['电商', '广告', '小说', '知识付费', '其他'],
      materiaData: [
        {
          materia_id: 1,
          materia_title: '我始终努力地为你斑斓',
          materia_type: 2,
          materia_pic: 'http://static.liantuobank.com/project/lianfutong/images/imgdemo3.jpg',
          materia_time: '2019-10-30 12:30:40'
        },
        {
          materia_id: 2,
          materia_title: '我始终努力地为你斑斓',
          materia_type: 3,
          materia_pic: 'http://static.liantuobank.com/project/lianfutong/images/imgdemo3.jpg',
          materia_time: '2019-10-30 12:30:40'
        }
      ],
      pagination: {
        size: 'small'
      }
    };
  }
  render() {
    const {
      articletypeData,
      materiaData,
      pagination
    } = this.state;
    const columns = [
      {
        title: '标题',
        key: 'materia_title',
        dataIndex: '',
        render: (record) => (
          <div className={style.titleinfo}>
            <img src={record.materia_pic} />
            <div className="g-tl">
              {record.materia_title}
              <p>{record.materia_time}</p>
            </div>
          </div>
        )
      },
      {
        title: '文章类型',
        key: 'materia_type',
        dataIndex: 'materia_type',
        render: (record) => (
          <span>{articletypeData[record]}</span>
        )
      },
      {
        title: '操作',
        key: 'opeartion',
        dataIndex: '',
        render: (record) => (
          <div className="opeartion-items">
            <span>编辑</span>
          </div>
        )
      },
    ]
    return(
      <div className={style.mypromotion}>
        <h1 className="nav-title">素材管理列表</h1>
        <ul className={`${style.search} mt40`}>
          <li>
            <label>标题</label>
            <Input />
          </li>
          <li>
            <label>文章类型</label>
            <div className={style.chks}>
              {
                articletypeData.map((item, index) => (
                  <Checkbox key={index}>{item}</Checkbox>  
                ))
              }
            </div>
          </li>
          <li>
            <Button type="primary" className="mr20">查询</Button>
            <Button className="mr20">重置</Button>
            <Button type="primary" className="mr20">添加文章</Button>
          </li>
        </ul>
        <Table
          dataSource={materiaData}
          columns={columns}
          pagination={pagination}
          rowKey={record => record.materia_id}
          className="table"
        />
      </div>
    )
  }
}
export default MaterialList;