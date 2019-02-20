<template>
  <div id="layout">
    <div class="layout-sideMenu">
      <p>Every</p>
      <p>One</p>
      <el-menu
        style="text-align: left; border-right: none; margin-top: 30px;"
        background-color="#1e2e4c"
        text-color="#fff"
        :default-active=currentOpenMenu
        @select="selectMenu">
        <el-menu-item index="1">
          <i class="el-icon-document"></i>
          <span slot="title">我的待办</span>
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-tickets"></i>
          <span slot="title">我的已办</span>
        </el-menu-item>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>我的设置</span>
          </template>
          <!-- <el-menu-item index="3-1">
            <template slot="title">更新信息</template>
          </el-menu-item>
          <el-menu-item index="3-2">
            <template slot="title">密码修改</template> -->
          <!-- </el-menu-item> -->
          <el-menu-item index="3-3">
            <template slot="title">退出登录</template>
          </el-menu-item>
        </el-submenu>
        <!-- <el-menu-item index="3">
          <i class="el-icon-setting"></i>
          <span slot="title">我的设置</span>
        </el-menu-item> -->
      </el-menu>
    </div>
    <div class="layout-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import api from '@/api/index'

import * as publicFunction from '../../../static/js/public'
export default {
  data () {
    return {
      currentOpenMenu: '1'
    }
  },
  watch: {
    '$route': {
      handler (val) {
        switch (val.name) {
          case 'myDoing': this.currentOpenMenu = '1'
            break
          case 'myDone': this.currentOpenMenu = '2'
            break
        }
      },
      immediate: true
    }
  },
  methods: {
    selectMenu (index, indexPath) {
      this.currentOpenMenu = index
      switch (index) {
        case '1': this.$router.push({
          path: '/myDoing'
        })
          break
        case '2': this.$router.push({
          path: '/myDone'
        })
          break
        case '3-3': this.logout()
          break
      }
    },
    logout () {
      this.$confirm('此操作将注销当前账号，是否确认继续执行？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.user.logout().then(res => {
          if (res.code === 200) {
            let exp = new Date()
            exp.setTime(exp.getTime() - 1)

            let isLogin = publicFunction.getCookieVal('isLogin')
            let user = publicFunction.getCookieVal('user')
            let userId = publicFunction.getCookieVal('user_id')
            if (isLogin !== null) {
              document.cookie = 'isLogin=' + isLogin + ';expires=' + exp.toGMTString()
            }
            if (user !== null) {
              document.cookie = 'user=' + user + ';expires=' + exp.toGMTString()
            }
            if (userId !== null) {
              document.cookie = 'user_id=' + userId + ';expires=' + exp.toGMTString()
            }

            this.$router.replace({
              path: '/Login'
            })
          }
        })
      }).catch(() => {
        this.currentOpenMenu = this.$route.name === 'myDoing' ? '1' : this.$route.name === 'myDone' ? '2' : '3-3'

        this.$message({
          type: 'info',
          message: '已取消当前操作'
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
#layout
  display flex
  width 100%
  height 100%
  min-height 100vh
  .layout-sideMenu
    width 250px
    height auto
    min-height 100vh
    box-sizing border-box
    padding 30px 0
    background-color #1e2e4c
    p
      width 100%
      height 60px
      line-height 60px
      font-family cursive
      font-size 40px
      font-weight 500
      color #ffffff
  .layout-content
    flex 1
    height 100%
    min-height 100vh
    overflow hidden
    overflow-y auto
    // box-sizing border-box
    // padding 30px 2%
</style>
