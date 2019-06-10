import React, {Component} from 'react';
import {Input, Button} from 'antd';
import style from './style.less';
class EditMateria extends Component{
  render() {
    return(
      <div className={style.mypromotion}>
        <div className={style.editor}>
          <div>
            
          </div>
          <div></div>
          <div className="g-tc">
            <Button type="primary">提交推广</Button>
            <Button>保存草稿</Button>
            <Button>上一步</Button>
          </div>
        </div>
      </div>
    )
  }
}
export default EditMateria;