import React, {Component} from 'react';
import Link from 'umi/link';
import style from './style.less';
import { Input, Button } from 'antd';

class SelectMateria extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isActive: 0
    };
  }
  tapEvent = (index) => {
    this.setState({isActive: index});
  }
  render() {
    const {isActive} = this.state;
    return(
      <div className={style.mypromotion}>
        <h1 className="nav-title">新建活动 > 编辑素材</h1>
        <h2 className="small-title"><em></em>快速功能</h2>
        <div className={style.selectmateriaitems}>
          <div className={style.type}>
            <span className={`${style.items} ${isActive === 0 ? style.active : null}`} onClick={this.tapEvent.bind(this, 0)}>一键导入素材</span>
            <span className={`${style.items} ${isActive === 1 ? style.active : null}`} onClick={this.tapEvent.bind(this, 1)}>选择历史素材</span>
            <span className={`${style.items} ${isActive === 2 ? style.active : null}`} onClick={this.tapEvent.bind(this, 2)}>选择历史素材</span>
          </div>
          <p>导入微信文章</p>
          <div className={style.link}>
            微信连接地址
            <Input />
            <Button type="primary">确定</Button>
          </div>
        </div>
      </div>
    );
  }
}
export default SelectMateria;