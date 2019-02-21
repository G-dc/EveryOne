<template>
  <div id="myDone">
    <div>
      <el-button class="btn" v-if="!showAllProject" @click.native="back">返回</el-button>
      <p class="showTime">当前时间：{{currentTime | formatTime}}</p>
    </div>

    <div style="clear: both"></div>

    <div class="projectYear" v-if="showAllProject">
      <project-list-year class="yearOne" v-for="(item, index) in projectList" :key="index" :data="item" @chooseMonth="chooseMonth"></project-list-year>
    </div>

    <div class="projectOneYear" v-else>
      <p class="yearOne_title">{{projectSomeList.year}}年 - {{projectSomeList.month}}月</p>

      <div class="yearOne_one" v-for="(item, index) in projectSomeList.list" :key="index" @click="checkDetail(item)">
        <p class="yearOne_one_time">{{item.prjStartTime}}</p>

        <p class="yearOne_one_title">{{item.prjName}}</p>

        <div class="yearOne_one_tags">
          <span>{{item.prjType === 'new' ? '新建任务' : '历史遗留'}}</span>
          <span>|</span>
          <span>计划完成进度：{{item.planToFinish}}%</span>
          <span>|</span>
          <span>实际完成进度：{{item.prjCurrentProcess}}%</span>
          <span>|</span>
          <span>{{item.prjStatus === 1 ? '未完成' : '已完成'}}</span>
        </div>

        <div style="clear: both;"></div>
      </div>
    </div>

    <el-dialog
      title="查看详情"
      :visible.sync="showPrjPreviewDialog"
      @closed="showPrjPreviewDialog = false"
      class="previewDialog"
      width="30%">
      <p class="preview_title">事项名称</p>
      <p class="preview_content">{{previewPrjTemp.prjName}}</p>

      <p class="preview_title">事项执行日期</p>
      <p class="preview_content">{{previewPrjTemp.prjStartTime}}</p>

      <p class="preview_title">事项描述</p>
      <p class="preview_content">{{previewPrjTemp.prjDetail}}</p>

      <p class="preview_title">事项类型</p>
      <p class="preview_content">{{previewPrjTemp.prjType === 'new' ? '新建任务' : '历史遗留'}}</p>

      <p class="preview_title">事项状态</p>
      <p class="preview_content">{{previewPrjTemp.prjStatus === 2 ? '已完成' : '未完成'}}</p>

      <p class="preview_title">当天完成进度</p>
      <p class="preview_content">{{previewPrjTemp.prjCurrentProcess}}%</p>

      <p class="preview_title">当天预期完成进度</p>
      <p class="preview_content">{{previewPrjTemp.planToFinish}}%</p>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/index'

import * as publicFunction from '../../../static/js/public'

import projectListYear from '@/components/projectList_Year/index'

export default {
  data () {
    return {
      showPrjPreviewDialog: false,
      showAllProject: true,
      currentTime: new Date(),
      getAllProjectTemp: {},
      projectList: [],
      projectSomeList: {
        year: undefined,
        month: undefined,
        list: []
      },
      previewPrjTemp: {}
    }
  },
  components: {
    projectListYear
  },
  watch: {
    '$route': {
      handler (val) {
        if (val.query.month && val.query.year) {
          this.showAllProject = false
          this.projectSomeList.list = []

          this.projectSomeList.year = val.query.year
          this.projectSomeList.month = val.query.month

          this.getSomeProject(val.query)
        } else {
          this.showAllProject = true
          this.projectList = []

          this.getAllProject()
        }
      },
      immediate: true
    }
  },
  methods: {
    getAllProject () {
      this.getAllProjectTemp = {}
      // this.getAllProjectTemp.userId = JSON.parse(publicFunction.getCookieVal('user')).userId
      api.project.getAllProject(this.getAllProjectTemp).then(res => {
        if (res.data.length > 0) {
          this.checkData(res.data, this.currentTime.getFullYear())
        }
      })
    },

    getSomeProject (obj) {
      this.getAllProjectTemp = {}

      // this.getAllProjectTemp.userId = JSON.parse(publicFunction.getCookieVal('user')).userId
      this.getAllProjectTemp.year = obj.year
      this.getAllProjectTemp.month = obj.month

      api.project.getAllProject(this.getAllProjectTemp).then(res => {
        if (res.data.length > 0) {
          res.data.forEach(item => {
            const _obj = Object.assign({}, item)
            _obj.prjStartTime = publicFunction.formatDate(_obj.prjStartTime)
            _obj.prjEndTime = publicFunction.formatDate(_obj.prjEndTime)
            this.projectSomeList.list.push(_obj)
          })
        }
      })
    },

    // 数据定制化处理
    checkData (data, date) {
      if (data.length > 0) {
        const _timeStamp = Date.parse(date + '-1-1')

        let _projectListOne = {
          year: date,
          detail: []
        }
        _projectListOne.detail.push(...data.filter(item => item.prjStartTime > _timeStamp))

        this.projectList.push(_projectListOne)

        data.filter(item => item.prjStartTime > _timeStamp).forEach(item => {
          data.forEach((item1, index1) => {
            if (item1 === item) {
              data.splice(index1, 1)
            }
          })
        })

        this.checkData(data, --date)
      }
    },

    chooseMonth (e) {
      this.$router.replace({
        path: this.$route.path,
        query: {
          year: e.year,
          month: e.month
        }
      })
    },

    checkDetail (e) {
      this.previewPrjTemp = e
      this.showPrjPreviewDialog = true
    },

    back () {
      this.$router.replace({
        path: '/myDone'
      })
    }
  },
  filters: {
    formatTime (time) {
      const _time = new Date(time)
      const _year = _time.getFullYear()
      const _month = _time.getMonth() + 1 > 9 ? _time.getMonth() + 1 : '0' + (_time.getMonth() + 1)
      const _date = _time.getDate() > 9 ? _time.getDate() : '0' + _time.getDate()
      const _hour = _time.getHours() > 9 ? _time.getHours() : '0' + _time.getHours()
      const _minute = _time.getMinutes() > 9 ? _time.getMinutes() : '0' + _time.getMinutes()
      const _second = _time.getSeconds() > 9 ? _time.getSeconds() : '0' + _time.getSeconds()

      return _year + '年' + _month + '月' + _date + '日' + '  ' + _hour + '时' + _minute + '分' + _second + '秒'
    }
  },
  mounted () {
    const _this = this
    _this.timer = setInterval(() => {
      _this.currentTime = new Date()
    }, 1000)
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
</script>

<style lang="stylus" scoped>
#myDone
  position relative
  width 100%
  height 100%
  min-height 100vh
  box-sizing border-box
  padding 30px 2%
  .btn
    float left
    // margin-left 3%
  .showTime
    display inline-block
    float right
    width auto
    height 50px
    margin-bottom 20px
    text-align right
    line-height 50px
    font-size 30px
    font-family cursive
    font-weight 500
    color #1e2e4c
  .projectYear
    width 100%
    height auto
    .yearOne
      width 100%
      height auto
      box-sizing border-box
      border 1px solid rgba(147, 153, 159, .4)
      box-shadow 5px 5px 10px rgb(147, 153, 159)
      border-radius 10px
  .projectOneYear
    width 100%
    height auto
    .yearOne_title
      display inline-block
      text-align left
      width 100%
      height 40px
      box-sizing border-box
      // padding-left 3%
      line-height 40px
      font-size 30px
      font-family cursive
      font-weight 500
      color rgb(147, 153, 159)
    .yearOne_one
      width 100%
      height auto
      box-sizing border-box
      padding 10px 1%
      border-bottom 1px dotted rgba(147, 153, 159, .4)
      cursor pointer
      &:hover
        border 1px solid rgba(147, 153, 159, .6)
        border-radius 10px
        box-shadow 5px 5px 10px rgb(147, 153, 159)
      &:nth-child(n+2)
        margin-top 20px
      &_time
        display inline-block
        float left
        width auto
        height 30px
        line-height 30px
        font-family cursive
        font-size 18px
        font-weight 500
        color #1e2e4c
      &_title
        display inline-block
        float left
        margin-left 1%
        width auto
        height 30px
        line-height 30px
        font-family cursive
        font-size 25px
        font-weight 500
        color #1e2e4c
      &_tags
        display inline-block
        float right
        width auto
        height 30px
        line-height 30px
        font-size 18px
        font-family cursive
        color rgb(147, 153, 159)
  .previewDialog
    text-align left
    & /deep/ .el-dialog__body
      padding-top 0
    .preview_title
      width 100%
      height 40px
      margin-top 15px
      line-height 40px
      font-family cursive
      font-size 20px
      font-weight 500
      color #1e2e4c
    .preview_content
      width 100%
      height auto
      line-height 20px
      font-family cursive
      font-size 15px
      color #1e2e4c
</style>
