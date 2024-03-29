import React, {Component} from 'react'
import {Input, Button, message} from 'antd'
import router from 'umi/router'
import Link from 'umi/link'
import {login} from '../api/api'
class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loginName: 'ggz_10', //流量主：llz_10 //广告主：ggz_10 //管理员：SHcszfwx
      password: '111qqq'
    }
  }
  componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'))
    if (!loginInfo) return false
    router.push('/main')
  }
  login = () => {
    login(this.state).then(rs => {
      if (rs.success) {
        message.success(rs.message)
        const params = {
          data: {
            employeeId: rs.data.employeeId,
            loginName: rs.data.loginName,
            merchantType: rs.data.merchantType,
            merchantCode: rs.data.merchantCode
          }
        }
        window.localStorage.setItem('login_info', JSON.stringify(params))
        router.push('/main')
      } else {
        message.error(rs.message)
      }
    })
  }
  ChangeFormEvent = (type, e) => {
    let text = ''
    if (e === undefined) return false
    switch(typeof e) {
      case 'object':
        text = e.target.value
        this.setState({password: null})
        break
      case 'string':
        text = e
        break
      default:
        text = e.target.value
        break
    }
    this.setState({[type]: text})
  }
  regEvent = () => {
    router.push('/register')
  }
  render() {
    const {
      loginName,
      password
    } = this.state
    return(
      <div className="login-form">
        <div className="header">
          <div className="nav">
            <img src={require('../assets/logo.png')} />
            <div className="nav-reg">
                <Link to="/">登录</Link>
                <Link to="/enter" className="active">注册</Link>
            </div>
          </div>  
        </div>
        <div className="login-blocks">
          <h1><img src={require('../assets/logo2.png')} /></h1>
          <ul>
            <li><Input  placeholder="请输入登录名" onChange={this.ChangeFormEvent.bind(this, 'loginName')} value={loginName} /></li>
            <li><Input  type="password" placeholder="请输入密码" onChange={this.ChangeFormEvent.bind(this, 'password')}  value={password} /></li>
          </ul>
          <div className="g-tc">
            <Button type="primary" onClick={this.login.bind(this)} className="button">登录</Button>
          </div>
          <div className="bottom-blocks">
            <img src={require('../assets/logo-bg-1.png')} />
          </div>
        </div>
      </div>
    )
  }
}
export default Login