<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            onkeypress="event.keyCode == 13"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchData"></el-button>
          </el-input>
        </el-col>
        <el-col :span="12"></el-col>
      </el-row>
      <!-- 页面主体表格 -->
      <el-table :data="ordersList" border style="width: 100%">
        <el-table-column label="#" min-width="80" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格/RMB" prop="order_price" width="180px"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="100px">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" v-if="scope.row.pay_status === '0'">未付款</el-button>
            <el-button type="success" size="mini" v-else-if="scope.row.pay_status === '1'">已付款</el-button>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="80px"></el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="200px">
          <template slot-scope="scope">{{scope.row.create_time | dataFilter}}</template>
        </el-table-column>
        <el-table-column label="操作" width="160px">
          <el-button type="primary" size="mini">修改</el-button>
          <el-button type="success" size="mini" @click="expressDialogVisible = true">快递</el-button>
        </el-table-column>
      </el-table>
      <!-- 页面底部分页效果 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[2, 4, 6, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-dialog title="快递信息" :visible.sync="expressDialogVisible" width="30%">
      <el-timeline :reverse="false">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.timestamp"
        >{{activity.content}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 请求后台订单数据列表数据 参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 订单数据列表 总数据条数
      total: 0,
      // 获取到订单数据列表 数据
      ordersList: [],
      // 快递对话框 默认关闭
      expressDialogVisible: false,
      // 测试快递数据
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      }]
    }
  },
  created () {
    this.getOrdersList()
    this.getExpress()
  },
  methods: {
    // 获取后台订单数据列表
    async getOrdersList () {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取订单数据列表失败')
      }
      this.$message.success('成功获取订单数据列表')
      // 获取到的订单数据列表数据复制给 ordersList
      this.ordersList = res.data.goods
      // 获取到的订单列表总数据条数复制给 total
      this.total = res.data.total
    },
    // 每页显示数量
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getOrdersList()
    },
    // 当前页改变
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getOrdersList()
    },
    // 单机搜索按钮，触发模糊查询功能
    searchData () {
      this.getOrdersList()
    },
    // 获取订单地址
    async getExpress () {
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      console.log(res)
    }
  }
}

</script>
<style lang='less' scoped>
.el-card {
  margin-top: 10px;
}
.el-table {
  margin-top: 10px;
}
.el-pagination {
  margin-top: 10px;
}
</style>
