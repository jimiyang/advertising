import React, {Component} from 'react';
import {Input} from 'antd';
import style from './component.less';
class AddEmployess extends Component{
  constructor(props) {
    super(props);
    this.state = {
      type: 'add',
      addForm: ''
    };
  }
  componentWillMount() {
    console.log(this.props);
    this.setState({type: this.props.type, addForm: this.props.addForm});
  }
  componentWillReceiveProps(props) {
    console.log(props);
    this.setState({type: props.type, addForm: props.addForm});
  } 
  changeValueEvent = (type, e) => {
    this.props.changeValueEvent(type, e);
  }
  render() {
    const {
      type,
      addForm
    } = this.state;
    return (
      <div>
        {
          type === 'add' ?
            <ul className={style.add}>
              <li>
                <em className={style.name}>姓名：</em>
                <Input placeholder="请输入姓名" onChange={this.changeValueEvent.bind(this, 'name')} />
              </li>
              <li>
                <em className={style.name}>手机：</em>
                <Input placeholder="请输入手机号" onChange={this.changeValueEvent.bind(this, 'mobile')} />
              </li>
              <li>
                <em className={style.name}>登录名：</em>
                <Input placeholder="请输入登录名" onChange={this.changeValueEvent.bind(this, 'loginName')} />
              </li>
              <li>
                <em className={style.name}>密码：</em>
                <Input placeholder="请输入密码" onChange={this.changeValueEvent.bind(this, 'password')} />
              </li>
            </ul>
            :
            <ul className={style.add}>
              <li>
                <em className={style.name}>姓名：</em>
                <Input placeholder="请输入姓名" onChange={this.changeValueEvent.bind(this, 'name')} value={addForm.name} />
              </li>
              <li>
                <em className={style.name}>手机：</em>
                <Input placeholder="请输入手机号" onChange={this.changeValueEvent.bind(this, 'mobile')} value={addForm.mobile} />
              </li>
              <li>
                <em className={style.name}>登录名：</em>
                <div className="pl20">eeee</div>
              </li>
            </ul>
        }
      </div>
    )
  }
};
export default AddEmployess;