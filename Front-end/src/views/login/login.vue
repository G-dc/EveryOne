<template>
  <div id="login">
    <div class="login-body" v-if="showLogin">
      <p class="login-body-title">EveryOne</p>
      <p class="login-body-subTitle">Login</p>

      <el-form :model="loginTemp">
        <el-form-item>
          <el-input placeholder="请输入登录用户名" v-model="loginTemp.userName" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="请输入登录密码" type="password" v-model="loginTemp.userPassword" clearable @keyup.enter.native="login"></el-input>
        </el-form-item>
      </el-form>

      <el-button @click.native="login" style="width: 100%; margin: 0 0 20px; border-radius: 10px; background-color: #1e2e4c; color: white; outline: none; border: none;" :loading="isLogin">{{isLogin ? '登录中' : '登录'}}</el-button>

      <el-row :gutter="50">
        <el-col :span="12" style="text-align: right;">
          <el-button type="text" style="color: #1e2e4c;" @click.native="isWantToRegist">注册账号</el-button>
        </el-col>
        <el-col :span="12" style="text-align: left;">
          <el-button type="text" style="color: #1e2e4c;" @click.native="isForgetPassword">忘记密码</el-button>
        </el-col>
      </el-row>
    </div>

    <div class="regist-body" v-if="showRegist">
      <p class="regist-body-title">EveryOne</p>
      <p class="regist-body-subTitle">Regist</p>

      <el-form :model="registTemp">
        <el-form-item>
          <el-input placeholder="请设置登录用户名" v-model="registTemp.userName" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="请设置登录密码" type="password" v-model="registTemp.userPassword" clearable @keyup.enter.native="regist"></el-input>
        </el-form-item>
      </el-form>

      <el-button @click.native="regist" style="width: 100%; margin: 0 0 20px; border-radius: 10px; background-color: #1e2e4c; color: white; outline: none; border: none;" :loading="isRegist">{{isRegist ? '注册中' : '注册'}}</el-button>

      <el-button type="text" style="width: 100%; color: #1e2e4c;" @click.native="loginRightNow()">马上登录</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/api/index'
import * as publicFunction from '../../../static/js/public'
export default {
  data () {
    return {
      loginTemp: {
        userName: '',
        userPassword: ''
      },
      registTemp: {
        userName: '',
        userPassword: ''
      },
      checkList: [],
      isLogin: false,
      isRegist: false,
      showLogin: true,
      showRegist: false
    }
  },
  methods: {
    getInitCsrf () {
      api.common.getCSRF().then(res => {})
    },
    login () {
      this.isLogin = true
      api.user.login(this.loginTemp).then(res => {
        if (res.code === 200) {
          // const days = 3
          // const exp = new Date()
          // exp.setTime(exp.getTime() + days * 24 * 3600 * 1000)
          // document.cookie = 'isLogin' + '=' + true + ';expires=' + exp.toGMTString()

          this.$message({
            message: '登录成功，正在跳转...',
            type: 'success',
            duration: 2000
          })

          setTimeout(() => {
            this.$router.push({
              path: '/'
            })
          }, 2000)
        } else {
          this.$message({
            message: res.msg,
            type: 'warning',
            duration: 2000
          })
        }

        this.isLogin = false
      })
    },
    regist () {
      this.isRegist = true
      api.user.regist(this.registTemp).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '注册成功，请登录',
            type: 'success',
            duration: 2000
          })
          setTimeout(() => {
            this.loginRightNow()
          }, 2000)
        } else {
          this.$message({
            message: res.msg,
            type: 'warning',
            duration: 2000
          })
        }
        this.isRegist = false
      })
    },
    isWantToRegist () {
      this.showLogin = false
      this.showRegist = true

      publicFunction.resetObject(this.loginTemp, true)
    },
    isForgetPassword () {
      this.$message({
        message: '此功能暂未开放，先自求多福吧',
        type: 'warning',
        duration: 2000
      })
    },
    loginRightNow () {
      this.showRegist = false
      this.showLogin = true

      publicFunction.resetObject(this.registTemp, true)
    }
  },
  created () {
    this.getInitCsrf()
  }
}
</script>

<style lang="stylus" scoped>
#login
  position relative
  width 100%
  height 100vh
  background-image url('../../../static/images/login_bg_backup.jpg')
  background-repeat no-repeat
  background-size cover
  background-position center center
  * /deep/ input.el-input__inner
    border none
    outline none
  .login, .regist
    &-body
      position absolute
      left 0
      right 0
      top 0
      bottom 0
      width 30%
      height 420px
      box-sizing border-box
      margin auto
      padding 30px 5%
      background rgba(255, 255, 255, .8)
      border-radius 10px
      box-shadow 20px 20px 40px rgba(0, 0, 0, .3)
      & /deep/ .el-button+.el-button
        margin-left 0
      &-title
        width 100%
        height 60px
        line-height 60px
        font-family Cursive
        font-size 40px
        font-weight 500
      &-subTitle
        width 100%
        height 40px
        line-height 40px
        font-family cursive
        font-size 30px
        font-weight 500
        margin-bottom 30px
</style>
