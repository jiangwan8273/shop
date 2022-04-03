<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// import echarts from 'echarts' 在这里高版本的echarts需要使用下面导入方法导入才行
import * as echarts from 'echarts'
import _ from 'lodash'

export default {
  data () {
    return {
      // 指定图表的配置项和数据
      option: {}
    }
  },
  async mounted () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      this.$message.error('获取数据报表数据失败')
    }
    this.$message.success('成功获取数据报表数据')
    console.log(res.data)

    const result = _.merge(res.data)

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result)
  },
  methods: {}
}

</script>
<style lang='less' scoped>
.el-card {
  margin-top: 10px;
}
</style>
