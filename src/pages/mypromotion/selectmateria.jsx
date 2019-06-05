import React, {Component} from 'react';
import style from './style.less';
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
      </div>
    );
  }
}
export default SelectMateria;