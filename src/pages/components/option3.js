import React, {Component} from 'react';
import {Input} from 'antd';
class Option3 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            index: 1,
            defaultProps:{ 
                canvaswidth: 160,// 画布宽度 
                canvasheight: 160,// 画布高度 
                x0: 80, 
                y0: 80, 
                r: 72, 
                lineWidth: 16, 
                strokeStyle: 'rgba(248, 248, 248, 1)', 
                LinearGradientColor1: '#3EECED', 
                LinearGradientColor2: '#499BE6' 
            }
        };
    }
    initCanvas() { 
        const { 
            x0,
            y0, 
            r,
            lineWidth,
            strokeStyle,
        } = this.props;
        let ele = document.getElementById("time_graph_canvas");
        let circle = ele.getContext("2d"); 
        let rad = Math.PI*2 / 100;
        circle.lineWidth = lineWidth;
        circle.strokeStyle = strokeStyle;
        circle.lineCap = 'round';
        circle.beginPath();//开始一个新的路径 
        circle.arc(x0, y0, r, 0, 2 * Math.PI, false);
        circle.stroke();
        let index = 1;
        //setInterval(function() {
            index++;
            circle.save();
            circle.beginPath();
            circle.lineWidth = 15; //设置线宽
            circle.strokeStyle = "#499BE6";
            circle.arc(x0, y0, r, -Math.PI / 2, -Math.PI / 2 - 2 * Math.PI * rad * index, true);
            circle.stroke();
            circle.closePath();
            circle.restore();
        //},1000);
    }
    componentDidMount() {
        this.initCanvas();
    }
    componentDidUpdate () {
        this.initCanvas();
    }
    change = (e) => {
        this.setState({
            value: e.target.value
        })
    }
    static defaultProps = { 
        canvaswidth: 160,// 画布宽度 
        canvasheight: 160,// 画布高度 
        x0: 80, 
        y0: 80, 
        r: 72, 
        lineWidth: 16, 
        strokeStyle: 'rgba(248, 248, 248, 1)', 
        LinearGradientColor1: '#3EECED', 
        LinearGradientColor2: '#499BE6' 
    }
    render() {
        const { defaultProps } = this.state;
        return(
            <div>
                <Input value={this.state.value} onChange={this.change}/>
                <div style={{marginTop: '30px'}}>
                    <canvas id="time_graph_canvas" width={defaultProps.canvaswidth} height={defaultProps.canvasheight}></canvas>
                </div>
            </div>
        )
    }
};
export default Option3;
/*export default connect(
    // 这里的state，就是公共容器中的state，而不是当前组件的state。在这里定义了之后，在当前组件中，就可以通过this.props.music拿到该对象
    state => ({ count: state.count }),
)(Option3)*/