<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div ref="box" style="width: 100%; height: 500px; border: 1px solid #000"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getDataReportsApi } from '@/http/api'

export default {
  data() {
    return {
      myChart: null,
      //公共数据
      preData: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        // grid: {
        //   left: '3%',
        //   right: '4%',
        //   bottom: '3%',
        //   containLabel: true
        // },
        // xAxis: [
        //   {
        //     boundaryGap: false
        //   }
        // ],
        // yAxis: [
        //   {
        //     type: 'value'
        //   }
        // ]
      }
    }
  },
  methods: {
    async renderChart() {
      //获取dom
      const chartDom = this.$refs.box

      //初始化echarts对象
      this.myChart = echarts.init(chartDom)

      //调接口获取数据统计数据
      const res = await getDataReportsApi()

      console.log('图表后台：', res)
      const mergeData = { ...this.preData, ...res }

      //配置
      const options = mergeData

      //生成echarts图表
      this.myChart.setOption(options)
    }
  },
  created() {},
  mounted() {
    this.renderChart()
    //通过调用echarts的resize实现自适应
    window.addEventListener('resize', this.myChart.resize)
  },
  components: {},
  computed: {},
  watch: {}
}
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  margin: 10px 0 20px;
}
</style>
