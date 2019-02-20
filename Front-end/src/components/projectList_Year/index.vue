<template>
  <div id="projectListYear">
    <p class="title_year">{{someData.year}}年 - {{projectListLen}}项</p>

    <div style="clear: both"></div>

    <div class="project_detail">
      <div class="detail_one" v-for="(item, index) in projectList" :key="index" v-if="item.detail.length > 0" @click="chooseMonth(item)">
        <p class="detail_one_month">{{item.month}}月</p>
        <p class="detail_one_len">共计{{item.detail.length}}项</p>
      </div>
    </div>

    <div style="clear: both"></div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      projectList: [],
      projectListLen: 0
    }
  },
  computed: {
    someData () {
      return this.data
    }
  },
  watch: {
    someData: {
      handler (val) {
        this.checkData(val)
      },
      immediate: true
    }
  },
  methods: {
    checkData (data) {
      if (data.detail.length > 0) {
        this.projectListLen = data.detail.length
        for (let i = 1; i <= 12; i++) {
          let _projectOne = {
            month: i,
            detail: []
          }

          if (i !== 12) {
            const _beginTimeStamp = Date.parse(data.year + '-' + i + '-1')
            const _endTimeStamp = Date.parse(data.year + '-' + (i + 1) + '-1')

            _projectOne.detail.push(...data.detail.filter(item => item.prjStartTime >= _beginTimeStamp && item.prjEndTime < _endTimeStamp))
          } else {
            const _timeStamp = Date.parse(data.year + '-' + i + '-1')

            _projectOne.detail.push(...data.detail.filter(item => item.prjStartTime >= _timeStamp))
          }

          this.projectList.push(_projectOne)
        }
      }
    },
    chooseMonth (e) {
      const _obj = {
        year: this.someData.year,
        month: e.month
      }
      this.$emit('chooseMonth', _obj)
    }
  }
}
</script>

<style lang="stylus" scoped>
#projectListYear
  width 100%
  height auto
  padding 20px 0
  margin-bottom 30px
  .title_year
    position relative
    display inline-block
    float left
    width auto
    height 30px
    box-sizing border-box
    margin-left 20px
    line-height 30px
    font-size 20px
    font-family cursive
    font-weight 500
    color rgb(147, 153, 159)
    cursor pointer
    &:after
      content ''
      position absolute
      z-index 2
      bottom 0
      left 50%
      display block
      width 100%
      height 2px
      transform translate(-50%)
    &:hover:after
      height 2px
      animation ad_width .3s linear forwards
      background rgba(147, 153, 159, .5)
  .project_detail
    width 100%
    height auto
    box-sizing border-box
    padding 0 10px
    .detail_one
      display inline-block
      float left
      width 7.9%
      height 50px
      margin-left 0.4%
      margin-top 10px
      border 1px solid rgba(147, 153, 159, .4)
      box-shadow 1px 1px 5px rgb(147, 153, 159)
      border-radius 5px
      cursor pointer
      &:hover
        transform scale(1.01)
        background rgba(147, 153, 159, .1)
      &_month, &_len
        display inline-block
        text-align center
        width 100%
        height 25px
        line-height 25px
        font-size 15px
        font-family cursive
        font-weight 500
        color rgb(147, 153, 159)

@keyframes ad_width
  from
    width 0
  to
    width 100%
</style>
