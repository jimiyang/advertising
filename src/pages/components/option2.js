import React, {Component} from 'react'
import {Button} from 'antd'
class Counter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            node: [
                {name: '商户管理类'},
                {name: '账户管理类'}
            ]
        }
    }
    componentWillMount() {
        this.props.add(this.state.node);
    }
    add = () => {
      const str= {name: '员工管理类'}
      const arr = this.state.node
      arr.push(str);
      this.props.add(arr);
      this.setState({
          node: this.props.arr
      })
      //console.log(this.props);
    }
    render() {
        //从组件的props属性中导入四个方法和一个变量
        const {increment, decrement, count} = this.props;
        //渲染组件，包括一个数字，四个按钮
        return (
            <div>
                Clicked: {count} times
                <Button type="primary" onClick={increment} style={{marginLeft: '20px'}}>+</Button>
                <Button type="primary" onClick={decrement} style={{marginLeft: '20px'}}>-</Button>
                <Button type="primary" onClick={this.add} style={{marginLeft: '20px'}}>追加数据</Button>
                {
                   this.state.node.map((item, index) => (
                       <div key={index}>名称：{item.name}</div>
                   )) 
                }
            </div>
        )
    }
}
export default Counter