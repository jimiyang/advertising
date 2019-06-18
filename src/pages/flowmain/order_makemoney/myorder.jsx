import React, {Component} from 'react';
import {Button, Select, Input, Modal} from 'antd';
import router from 'umi/router';
import style from './style.less';
import ReceiveAd from '../../components/receivead'; //确认接此广告模板
const Option = Select.Option;
class MyOrder extends Component{
  constructor(props) {
    super(props);
    this.state = {
      orderData: [
        {
          id: 1,
          img: ''
        },
        {
          id: 2,
          img: ''
        },
        {
          id: 3,
          img: ''
        },
        {
          id: 4,
          img: ''
        }
      ],
      isVisible: false
    };
  }
  //接收此广告
  ReceiveEvent = () => {
    this.setState({isVisible: true});
  }
  closeEvent = () => {
    this.setState({isVisible: false});
  }
  render() {
    const {
      orderData,
      isVisible
    } = this.state;
    return(
      <div className={style.pubAccount}>
        <Modal
          visible={isVisible}
          onCancel={this.closeEvent.bind(this)}
        >
          <ReceiveAd />
        </Modal>
        <h1 className="nav-title">接单赚钱 > 可接单活动</h1>
        <ul className={style.search}>
          <li>广告类型
            <Select defaultValue="">
              <Option value="">请选择</Option>
            </Select>
          </li>
          <li>公众号名称
            <Input />
          </li>
          <li>活动名称
            <Input />
          </li>
          <li>
            <Button type="primary">查询</Button>
          </li>
        </ul>
        <dl className={style.list}>
          {
            orderData.map((item, index) => (
              <dd key={index}>
                <img src={require('../../../assets/test.png')} />
                <p>阅读单价：0.33元 / 次阅读</p>
                <p>活动时间：2019.5.1-2019.5.1</p>
                <div>剩余100000次阅读
                <Button type="primary" onClick={this.ReceiveEvent.bind(this)}>接此广告</Button>
                </div>
              </dd>
            ))
          }
        </dl>
        <iframe src="http://localhost:8000/main/adtask?aa=0" style={{width: '1000px', height: '400px'}}/>
      </div>
    );
  }
};
export default MyOrder;