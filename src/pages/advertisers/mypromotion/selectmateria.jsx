import React, {Component} from 'react';
import Link from 'umi/link';
import style from './style.less';
import { Input, Button } from 'antd';

class SelectMateria extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isActive: 0,
      type: 'edit',
      id: null
    };
  }
  async componentWillMount() {
    console.log(this.props.location);
    const state = this.props.location.state
    if (!state) return false;
    await this.setState({type: state.type, id: state.id});
  }
  render() {
    const {isActive, type} = this.state;
    return(
      <div className={style.mypromotion}>
        <h1 className="nav-title">新建活动 > 编辑素材</h1>
        <div className={style.selectmateriaitems}>
          {
            type === 'edit' ? null
            :
            <div className={style.type}>
              <span className={`${style.items} ${isActive === 0 ? style.active : null}`}>选择历史素材</span>
            </div>
          }
          <div className={style.content}>
            <iframe className={style.iframe} src="http://testadx.liantuo.com/fshstatic/#/" width="1500" height="1000px"></iframe>
          </div>
        </div>
      </div>
    );
  }
}
export default SelectMateria;