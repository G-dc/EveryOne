<template>
  <div id="myDoing">
    <p class="showTime">当前时间：{{currentTime | formatTime}}</p>

    <div class="nothing" v-if="listIsNull === '0'">今日暂未新建待办任务&nbsp;&nbsp;<span @click="showAddNewPrjDialog = true">点此新建</span></div>
    <div class="something" v-if="listIsNull === '1'">
      <span class="newOne" @click="showAddNewPrjDialog = true">新建待办</span>

      <div style="clear: both;"></div>

      <div class="something-content">
        <div class="content-one" v-for="(item, index) in projectList" :key="index" @click="showUpdateOne(item)">
          <p class="content-one-title">{{item.prjName}}</p>

          <div class="content-one-tags">
            <span>{{item.prjType}}</span>
            <span>|</span>
            <span>计划进度：{{item.planToFinish}}%</span>
            <span>|</span>
            <span>当前进度：{{item.prjCurrentProcess}}%</span>
            <span>|</span>
            <span>{{item.prjStatus === 1 ? '进行中' : '已完成'}}</span>
          </div>

          <p class="content-one-detail">{{item.prjDetail}}</p>
        </div>
      </div>
    </div>

    <!-- 新建待办任务 -->
    <el-dialog
      title="新建待办"
      :visible.sync="showAddNewPrjDialog"
      @closed="closeAddNewPrjDialog('addNewPrjTemp')"
      class="addDialog"
      width="30%">
      <el-form :model="addNewPrjTemp" ref="addNewPrjTemp" :rules="rules">
        <el-form-item label="任务类型" prop="prjType">
          <el-select v-model="addNewPrjTemp.prjType" placeholder="请选择任务类型" @change="closeAddNewPrjDialog('addNewPrjTemp', addNewPrjTemp.prjType)">
            <el-option label="新建任务" value="new"></el-option>
            <el-option label="历史遗留" value="old"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="任务名称" prop="prjName">
          <el-input
            v-model="addNewPrjTemp.prjName"
            placeholder="请输入待办任务名称"
            :disabled="addNewPrjTemp.prjType !== 'new' && addNewPrjTemp.prjType !== 'old'"></el-input>
        </el-form-item>

        <el-form-item label="任务详情" prop="prjDetail">
          <el-input
            type="textarea"
            v-model="addNewPrjTemp.prjDetail"
            placeholder="请描述一下待办任务详情"
            :disabled="addNewPrjTemp.prjType !== 'new' && addNewPrjTemp.prjType !== 'old'">
          </el-input>
        </el-form-item>

        <el-form-item prop="prjCurrentProcess">
          <span slot="label">当前任务进度</span><span v-if="addNewPrjTemp.prjType === 'old' && showprjCurrentProcess" class="labelAfterTip" @click="editProcess('prjCurrentProcess')">更新进度</span>
          <el-input
            v-if="!showprjCurrentProcess"
            v-model="addNewPrjTemp.prjCurrentProcess"
            placeholder="请输入当前进度"
            :disabled="addNewPrjTemp.prjType === 'new' || (addNewPrjTemp.prjType !== 'new' && addNewPrjTemp.prjType !== 'old')"
            @blur="showProcess('prjCurrentProcess')"></el-input>
          <el-progress
            v-else
            :stroke-width="10"
            :percentage=prjCurrentProcessVal
            color="#1e2e4c">
          </el-progress>
        </el-form-item>

        <el-form-item prop="planToFinish">
          <span slot="label">计划完成进度</span><span v-if="addNewPrjTemp.prjType && showPlanToFinish" class="labelAfterTip" @click="editProcess('planToFinish')">更新进度</span>
          <el-input
            v-if="!showPlanToFinish"
            v-model="addNewPrjTemp.planToFinish"
            placeholder="请输入计划完成进度"
            :disabled="addNewPrjTemp.prjType !== 'new' && addNewPrjTemp.prjType !== 'old'"
            @blur="showProcess('planToFinish')"></el-input>
          <el-progress
            v-else
            :stroke-width="10"
            :percentage=planToFinishVal
            color="#1e2e4c">
          </el-progress>
        </el-form-item>

        <el-form-item>
          <span slot="label">任务状态</span>
          <el-radio-group v-model="addNewPrjTemp.prjStatus" :disabled="true">
            <el-radio :label="1">进行中</el-radio>
            <el-radio :label="2">已完成</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="showAddNewPrjDialog = !showAddNewPrjDialog">取消</el-button>
        <el-button @click.native="confirmAddOne('addNewPrjTemp')" :disabled="!addNewPrjTemp.prjType || !addNewPrjTemp.prjName || !addNewPrjTemp.prjDetail || !addNewPrjTemp.prjCurrentProcess" style="background-color: #1e2e4c; color: #ffffff;">确认</el-button>
      </div>
    </el-dialog>

    <!-- 更新待办任务 -->
    <el-dialog
      title="待办更新"
      :visible.sync="showUpdatePrjDialog"
      @closed="closeUpdateNewPrjDialog('updatePrjTemp')"
      class="updateDialog"
      width="30%">
      <el-form :model="updatePrjTemp" ref="updatePrjTemp" :rules="rules">
        <el-form-item label="任务类型">
          <el-select v-model="updatePrjTemp.prjType" disabled placeholder="请选择任务类型">
            <el-option label="新建任务" value="new"></el-option>
            <el-option label="历史遗留" value="old"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="任务名称">
          <el-input disabled v-model="updatePrjTemp.prjName"></el-input>
        </el-form-item>

        <el-form-item label="任务详情" prop="prjDetail">
          <el-input type="textarea" :disabled="updatePrjTemp.prjStatus === 2" v-model="updatePrjTemp.prjDetail"></el-input>
        </el-form-item>

        <el-form-item prop="prjCurrentProcess">
          <span slot="label">当前任务进度</span><span v-if="showUpdateprjCurrentProcess" class="labelAfterTip" @click="editProcess('prjCurrentProcess')">更新进度</span>
          <el-progress
            v-if="showUpdateprjCurrentProcess"
            :stroke-width="10"
            :percentage=prjCurrentProcessVal
            color="#1e2e4c"></el-progress>
          <el-input
            v-else
            v-model="updatePrjTemp.prjCurrentProcess"
            placeholder="请输入当前完成进度"
            @blur="showProcess('prjCurrentProcess')"></el-input>
        </el-form-item>

        <el-form-item>
          <span slot="label">计划完成进度</span>
          <el-progress
            :stroke-width="10"
            :percentage=planToFinishVal
            color="#1e2e4c"></el-progress>
        </el-form-item>

        <el-form-item>
          <span slot="label">任务状态</span>
          <el-radio-group v-model="updatePrjTemp.prjStatus" :disabled="true">
            <el-radio :label="1">进行中</el-radio>
            <el-radio :label="2">已完成</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="showUpdatePrjDialog = !showUpdatePrjDialog">取消</el-button>
        <el-button @click.native="confirmUpdateOne('updatePrjTemp')" :disabled="!showUpdateprjCurrentProcess && !updatePrjTemp.prjDetail" style="background-color: #1e2e4c; color: #ffffff;">确认</el-button>
      </div>
    </el-dialog>

    <!-- 预览已完成待办 -->
    <el-dialog
      title="待办预览"
      :visible.sync="showPrjPreviewDialog"
      class="previewDialog"
      width="30%">
      <p class="preview-title">任务名称</p>
      <p class="preview-content">{{previewPrjTemp.prjName}}</p>

      <p class="preview-title">任务类型</p>
      <p class="preview-content">{{previewPrjTemp.prjType}}</p>

      <p class="preview-title">任务描述</p>
      <p class="preview-content">{{previewPrjTemp.prjDetail}}</p>

      <p class="preview-title">当前完成进度</p>
      <p class="preview-content">{{previewPrjTemp.prjCurrentProcess}}%</p>

      <p class="preview-title">计划完成进度</p>
      <p class="preview-content">{{previewPrjTemp.planToFinish}}%</p>

      <p class="preview-title">开始时间</p>
      <p class="preview-content">{{previewPrjTemp.prjStartTime | formatTime}}</p>

      <p class="preview-title">结束时间</p>
      <p class="preview-content">{{previewPrjTemp.prjEndTime | formatTime}}</p>

      <p class="preview-title">待办状态</p>
      <p class="preview-content">{{previewPrjTemp.prjStatus === 2 ? '已完成' : ''}}</p>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/index'
import * as publicFunction from '../../../static/js/public'

const isNum = /^(0|1|([1-9]\d{0,1})|100)$/ // 校验0 - 100 的整数

export default {
  data () {
    var validateNum = (rule, value, callback) => {
      if (!isNum.test(value)) {
        callback(new Error('请输入0-100之间的整数值'))
      } else {
        if (parseInt(value) < 0 || parseInt(value) > 100) {
          callback(new Error('请输入0-100之间的整数值'))
        } else {
          callback()
        }
      }
    }
    return {
      listIsNull: '', // 是否有新建待办

      showAddNewPrjDialog: false, // 是否显示新建待办项目窗口

      showUpdatePrjDialog: false, // 是否显示更新待办项目窗口

      showPrjPreviewDialog: false, // 是否显示预览窗口

      showprjCurrentProcess: false, // 是否以进度条模式显示当前项目进度（默认为false

      showPlanToFinish: false, // 是否以进度条模式显示计划完成进度（默认为false

      showUpdateprjCurrentProcess: true, // 更新窗口是否以进度条模式显示当前项目进度（默认为true

      prjCurrentProcessVal: 0, // 以进度条模式显示当前项目进度时的当前值（默认为0

      planToFinishVal: 0, // 以进度条模式显示计划完成进度时的当前值（默认为0

      currentTime: new Date(), // 页面当前时间戳

      addNewPrjTemp: {
        uId: '',
        prjName: '',
        prjDetail: '',
        prjType: '',
        prjStatus: 1,
        planToFinish: '',
        prjCurrentProcess: '',
        prjStartTime: null,
        prjEndTime: null
      },

      updatePrjTemp: {},

      previewPrjTemp: {},

      // 已建项目列表
      projectList: [],

      // 获取当天所有任务项目参数
      getProjectListTemp: {
        startTime: undefined,
        endTime: undefined
      },

      // 新建项目表单默认规则
      rules: {
        prjType: [
          { required: true, message: '请选择任务类型', trigger: 'change' }
        ],
        prjName: [
          { required: true, message: '任务名称不能为空', trigger: 'blur' }
        ],
        prjDetail: [
          { required: true, message: '任务详情不能为空', trigger: 'blur' }
        ],
        prjCurrentProcess: [
          { required: true, validator: validateNum, trigger: 'blur' }
        ],
        planToFinish: [
          { required: true, validator: validateNum, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'addNewPrjTemp.prjType': {
      handler (val) {
        if (val === 'new') {
          this.showprjCurrentProcess = true
        }
      },
      immediate: true
    }
  },
  methods: {
    // 获取当天所有新建任务
    getProjectList () {
      const _time = new Date()

      this.getProjectListTemp.startTime = Date.parse(_time.getFullYear() + ', ' + (_time.getMonth() + 1) + ', ' + _time.getDate())
      this.getProjectListTemp.endTime = Date.parse(_time.getFullYear() + ', ' + (_time.getMonth() + 1) + ', ' + (_time.getDate() + 1)) - 1

      api.project.getProjectList(this.getProjectListTemp).then(res => {
        if (res.code === 200) {
          res.data.forEach(item => {
            item.prjType = item.prjType === 'new' ? '新建任务' : '历史遗留'
          })
          this.projectList = res.data
          this.listIsNull = '1'
        } else {
          this.projectList = []
          this.listIsNull = '0'
        }
      })
    },

    // 根据ID获取单一任务
    getProjectOne (e) {
      api.project.getOneProject(e).then(res => {
        if (res.code === 200) {
          this.updatePrjTemp = res.data[0]

          this.planToFinishVal = parseInt(this.updatePrjTemp.planToFinish)
          this.prjCurrentProcessVal = parseInt(this.updatePrjTemp.prjCurrentProcess)
          this.showUpdatePrjDialog = !this.showUpdatePrjDialog
        }
      })
    },

    confirmAddOne (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.addNewPrjTemp.prjStartTime = (new Date()).getTime()

          if (!this.addNewPrjTemp.prjEndTime) {
            const _time = new Date()
            const _year = _time.getFullYear()
            const _month = _time.getMonth() + 1
            const _date = _time.getDate() + 1
            this.addNewPrjTemp.prjEndTime = Date.parse(_year + ', ' + _month + ', ' + _date) - 1
          }

          this.addNewPrjTemp.prjCurrentProcess = this.addNewPrjTemp.prjCurrentProcess ? this.addNewPrjTemp.prjCurrentProcess : '0'
          this.addNewPrjTemp.uId = JSON.parse(publicFunction.getCookieVal('user')).userId

          api.project.addNewOne(this.addNewPrjTemp).then(res => {
            if (res.code === 200) {
              this.$message({
                message: res.msg,
                type: 'success',
                duration: 2000
              })

              setTimeout(() => {
                this.showAddNewPrjDialog = !this.showAddNewPrjDialog
                this.getProjectList()
              }, 2000)
            } else {
              this.$message({
                message: res.msg,
                type: 'warning',
                duration: 2000
              })
            }
          })
        } else {
          this.$message({
            message: '请确保所有项不为空且符合相关输入条件',
            type: 'warning',
            duration: 2000
          })
          return false
        }
      })
    },

    confirmUpdateOne (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.updatePrjTemp.prjEndTime = this.updatePrjTemp.prjStatus === 2 ? (new Date()).getTime() : this.updatePrjTemp.prjEndTime

          api.project.updateProject(this.updatePrjTemp).then(res => {
            if (res.code === 200) {
              this.$message({
                message: res.msg,
                type: 'success',
                duration: 2000
              })

              setTimeout(() => {
                this.showUpdatePrjDialog = !this.showUpdatePrjDialog
                this.getProjectList()
              }, 2000)
            } else {
              this.$message({
                message: res.msg,
                type: 'warning',
                duration: 2000
              })
            }
          })
        } else {
          this.$message({
            message: '请确保所有项不为空且符合相关输入条件',
            type: 'warning',
            duration: 2000
          })
          return false
        }
      })
    },

    // 关闭新建任务弹窗后(或者切换任务类型)对相关数据进行初始化
    closeAddNewPrjDialog (form, val) {
      this.planToFinishVal = 0
      this.prjCurrentProcessVal = 0
      this.addNewPrjTemp.prjStatus = 1
      this.showprjCurrentProcess = false
      this.showPlanToFinish = false
      this.$refs[form].resetFields()

      /* eslint no-unneeded-ternary: "error" */
      this.addNewPrjTemp.prjType = !this.showAddNewPrjDialog ? '' : val ? val : ''
      this.addNewPrjTemp.prjCurrentProcess = val && val === 'new' ? '0' : ''
    },

    // 关闭更新任务弹窗后对相关数据进行初始化
    closeUpdateNewPrjDialog (form) {
      this.showUpdateprjCurrentProcess = true
      this.$refs[form].resetFields()
    },

    // 以进度条模式展示
    showProcess (e) {
      if (this.showAddNewPrjDialog) {
        if (e === 'planToFinish') {
          if (isNum.test(this.addNewPrjTemp.planToFinish)) {
            this.planToFinishVal = parseInt(this.addNewPrjTemp.planToFinish)
            this.showPlanToFinish = true
          }
        } else {
          if (isNum.test(this.addNewPrjTemp.prjCurrentProcess)) {
            this.prjCurrentProcessVal = parseInt(this.addNewPrjTemp.prjCurrentProcess)
            this.showprjCurrentProcess = true
          }
        }
      }

      if (this.showUpdatePrjDialog) {
        if (isNum.test(this.updatePrjTemp.prjCurrentProcess)) {
          if (parseInt(this.updatePrjTemp.prjCurrentProcess) > parseInt(this.updatePrjTemp.planToFinish)) {
            this.$message({
              message: '当前进度不应超过计划完成进度',
              type: 'warning',
              duration: 2000
            })
          } else {
            this.updatePrjTemp.prjStatus = parseInt(this.updatePrjTemp.prjCurrentProcess) === parseInt(this.updatePrjTemp.planToFinish) ? 2 : 1
            this.showUpdateprjCurrentProcess = true
            this.prjCurrentProcessVal = parseInt(this.updatePrjTemp.prjCurrentProcess)
          }
        }
      }
    },

    // 重新编辑进度条
    editProcess (e) {
      if (this.showAddNewPrjDialog) {
        if (e === 'planToFinish') {
          this.showPlanToFinish = !this.showPlanToFinish
        } else {
          this.showprjCurrentProcess = !this.showprjCurrentProcess
        }
      }

      if (this.showUpdatePrjDialog) {
        this.showUpdateprjCurrentProcess = !this.showUpdateprjCurrentProcess
      }
    },

    showUpdateOne (e) {
      if (e.prjStatus === 1) {
        this.getProjectOne(e.prjId)
      } else {
        this.previewPrjTemp = e
        this.showPrjPreviewDialog = !this.showPrjPreviewDialog
      }
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
  created () {
    this.getProjectList()
  },
  mounted () {
    const _this = this
    this.timer = setInterval(() => {
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
#myDoing
  position relative
  width 100%
  height 100%
  min-height 100vh
  box-sizing border-box
  padding 30px 2%
  .showTime
    width 100%
    height 50px
    margin-bottom 20px
    text-align right
    line-height 50px
    font-size 30px
    font-family cursive
    font-weight 500
    color #1e2e4c
  .nothing
    position absolute
    left 0
    right 0
    top 0
    bottom 0
    margin auto
    width 100%
    height 60px
    line-height 60px
    font-size 40px
    font-family cursive
    font-weight 600
    color gray
    span
      cursor pointer
      &:hover
        color #1e2e4c
  .something
    width 100%
    height 100%
    .newOne
      display inline-block
      width auto
      height 30px
      float left
      margin-bottom 20px
      line-height 30px
      font-family cursive
      font-size 25px
      font-weight 500
      color #1e2e4c
      cursor pointer
    &-content
      width 100%
      height auto
      .content-one
        position relative
        width 100%
        height auto
        box-sizing border-box
        padding 20px
        border-bottom 1px dotted rgba(147, 153, 159, .4)
        cursor pointer
        &:hover
          border 1px solid rgba(147, 153, 159, .6)
          border-radius 10px
          box-shadow 5px 5px 10px rgb(147, 153, 159)
        &:nth-child(n+2)
          margin-top 20px
        &-title
          width auto
          height 30px
          margin-bottom 20px
          overflow hidden
          white-space nowrap
          text-overflow ellipsis
          text-align left
          line-height 30px
          font-family cursive
          font-size 25px
          font-weight 500
          color #1e2e4c
        &-tags
          width auto
          height 20px
          margin-bottom 20px
          text-align left
          color rgb(147, 153, 159)
        &-detail
          width 100%
          height 40px
          overflow hidden
          white-space nowrap
          text-overflow ellipsis
          text-align left
          line-height 40px
          font-family cursive
          font-size 20px
          font-weight 500
          color rgb(147, 153, 159)
  .addDialog, .updateDialog
    text-align left
    .labelAfterTip
      font-size 3px
      color rgb(147, 153, 159)
      cursor pointer
      &:hover
        color #1e2e4c
    & /deep/ .el-radio__input.is-checked .el-radio__inner
      background #1e2e4c
      border-color #1e2e4c
    & /deep/ .el-radio__input.is-checked+.el-radio__label
      color #1e2e4c
  .previewDialog
    text-align left
    & /deep/ .el-dialog__body
      padding-top 0
    .preview-title
      width 100%
      height 40px
      margin-top 15px
      line-height 40px
      font-family cursive
      font-size 20px
      font-weight 500
      color #1e2e4c
    .preview-content
      width 100%
      height auto
      line-height 20px
      font-family cursive
      font-size 15px
      color #1e2e4c
</style>
