import React from 'react'
import { List, WingBlank, WhiteSpace, Radio, InputItem, Button } from 'antd-mobile'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import wrapper from '../../login/view/wrapper'
import Logo from '../../../components/logo'
import Validator from '../../../utils/validator'
import { toastInfo } from '../../../utils/toast'
import User from '../../../service/user'

const { RadioItem } = Radio

class Register extends React.Component {
  constructor(props) {
    super(props)
    // event
    this.checkform = this.checkform.bind(this)
    this.doRegister = this.doRegister.bind(this)
    this.doLogin = this.doLogin.bind(this)
  }

  checkform() {
    const validator = new Validator()
    const {
      username,
      password,
      verifyPassword,
    } = this.props.state
    validator.add(username, 'noEmpty', '用户名不能为空')
    validator.add(password, 'minLength:6', '密码不能小于6位数')
    validator.add([password, verifyPassword], 'sameValue', '两次输入密码不相符')
    return validator.start()
  }

  doRegister() {
    const validateResult = this.checkform()
    if (validateResult) return toastInfo(validateResult)
    User.register(this.props.state).then((res) => {
      if (res && res.code === 2000) {
        this.doLogin()
      }
    })
  }

  doLogin() {
    this.props.doLogin(this.props.state).then((data) => {
      const { role, isFillInfo } = data // true 登录成功，如何判断是否填写资料
      this.props.history.push(isFillInfo ? '/' : `${role}Setting`)
    })
  }

  render() {
    const {
      username,
      password,
      verifyPassword,
      role,
    } = this.props.state
    const { setFormState } = this.props
    return (
      <div className="register">
        <Logo/>
        <WingBlank>
          <List>
            <InputItem
              value={username}
              onChange={setFormState.bind(this, 'username')}
              placeholder="请输入您的账号"
            >
              账号
            </InputItem>
            <InputItem
              value={password}
              onChange={setFormState.bind(this, 'password')}
              placeholder="密码不能小于6位数"
              type="password"
            >
              密码
            </InputItem>
            <InputItem
              value={verifyPassword}
              onChange={setFormState.bind(this, 'verifyPassword')}
              placeholder="请再次输入您的密码"
              type="password"
            >
              确认密码
            </InputItem>
          </List>
          <WhiteSpace/>
          <List renderHeader="请选择您的身份">
            <RadioItem
              value="boss"
              checked={role === 'boss'}
              onChange={setFormState.bind(this, 'role', 'boss')}
            >
              Boss
            </RadioItem>
            <RadioItem
              value="genius"
              checked={role === 'genius'}
              onChange={setFormState.bind(this, 'role', 'genius')}
            >
              求职者
            </RadioItem>
          </List>
          <WhiteSpace size="xl"/>
          <Button onClick={this.doRegister} type="primary">确认注册</Button>
          <WhiteSpace/>
          <Link to="/login">已有账号，点击登录</Link>
        </WingBlank>
      </div>
    )
  }
}

Register.propTypes = {
  doLogin: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  setFormState: PropTypes.func.isRequired
}

export default wrapper(Register)
