import React, {Component} from 'react';
import Link from 'umi/link';
import style from './style.less';
import { Input, Button } from 'antd';

class SelectMateria extends Component{
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }
  render() {
    return(
      <div className={style.mypromotion}>
        <h1 className="nav-title">新建活动 > 编辑素材</h1>
        <h2 className="small-title"><em></em>快速功能</h2>
        <div className={style.selectmateriaitems}>
          <div className={style.type}>
            <Link to='/' className={style.active}>一键导入素材</Link>
            <Link to=''>选择历史素材</Link>
            <Link to='/main/editmateria'>编辑素材</Link>
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