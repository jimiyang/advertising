import React, {Component} from 'react';
import {Button} from 'antd';
class Options1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
          text: 'ssss',
          arr: [
            {id: 1, name: '北京'},
            {id: 2, name: '天津'},
            {id: 3, name: '河北'}
          ],
          name: '',
          pwd: ''
        };
    }
    componentWillMount() {
		//const arr=['react', 'vue', 'anglar'];
		//console.log(arr.includes('3333'));
    }
    render() {
        return (
            <div>
                Clicked: 11111times
                <Button type="primary" style={{marginLeft: '20px'}}>+</Button>
                <div style={{marginBottom: '20px'}}>当前值为：{this.state.text}</div>
            </div>
        )
    }
}
export default Options1;