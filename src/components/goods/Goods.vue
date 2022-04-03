<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 卡片头部选择框和添加按钮 -->
      <el-row>
        <span style="margin-top: 15px;">
          <el-input
            placeholder="请输入内容"
            style="width:480px"
            v-model="queryInfo.query"
            clearable
            @keyup.enter.native="searchBut"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchBut"></el-button>
          </el-input>
        </span>
        <span class="butEdit">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </span>
      </el-row>
      <!-- 表单 -->
      <el-row>
        <el-col>
          <el-table :data="goodsList" border style="width: 100%">
            <el-table-column type="index" label="#" width="50"></el-table-column>
            <el-table-column prop="goods_name" label="商品名称"></el-table-column>
            <el-table-column prop="goods_price" label="价格" width="120"></el-table-column>
            <el-table-column prop="goods_weight" label="重量" width="120"></el-table-column>
            <el-table-column prop="add_time" label="创建时间" width="180">
              <template slot-scope="scope">{{scope.row.add_time | dataFilter}}</template>
            </el-table-column>
            <el-table-column prop="upd_time" label="修改时间" width="180">
              <template slot-scope="scope">{{scope.row.upd_time | dataFilter}}</template>
            </el-table-column>
            <el-table-column prop="upd_time" label="操作" width="100">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  circle
                  @click="updataGoodsData(scope.row)"
                ></el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  circle
                  @click="deleteGoodsData(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <!-- 分页效果 -->
      <el-row>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[4, 6, 10, 20]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </el-row>
    </el-card>
    <!-- 修改按钮对话框 -->
    <el-dialog title="添加商品" :visible.sync="updataGoodsFormVisible">
      <el-form :model="updataGoodsForm">
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="updataGoodsForm.goods_name" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth">
          <el-input type="number" v-model="updataGoodsForm.goods_price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth">
          <el-input type="number" v-model="updataGoodsForm.goods_number" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="重量" :label-width="formLabelWidth">
          <el-input type="number" v-model="updataGoodsForm.goods_weight" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="介绍" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="updataGoodsForm.goods_introduce" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth">
          <el-input v-model="updataGoodsForm.pics" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="参数" :label-width="formLabelWidth">
          <el-input v-model="updataGoodsForm.attrs" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updataGoodsFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updataGoodsFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 分页效果请求参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 获取表格数据
      goodsList: [],
      // 分页效果，获取数据总数量
      total: 10,
      // 搜索框数据
      Inputval: '',
      // 修改商品对话框，默认关闭
      updataGoodsFormVisible: false,
      // 修改表单数据
      updataGoodsForm: {},
      // 修改商品表单左侧标签宽度
      formLabelWidth: '120px'
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 获取后台商品的数据
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取goods数据失败')
      // 修改获取到的总数
      this.total = res.data.total
      // 获取到的数据赋值给goodsList
      this.goodsList = res.data.goods
    },
    // 选每页多少条数据，改变事件
    handleSizeChange (val) {
      // 修改每页请求数量，刷新数据
      this.queryInfo.pagesize = val
      this.getGoodsList()
    },
    // 改变当前页数
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },
    // 搜索框按钮
    searchBut () {
      this.getGoodsList()
    },
    // 修改事件
    updataGoodsData (val) {
      // val 为点击修改按钮传递过来的参数
      console.log(val)
      // 打开修改商品对话框
      this.updataGoodsFormVisible = true
      // 数据复制给updataGoodsForm
      this.updataGoodsForm = val
    },
    // 删除事件
    deleteGoodsData (val) {
      // val 为点击删除按钮传递过来的参数
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 确认删除，执行删除操作推送给后台
        const { data: res } = await this.$http.delete(`goods/${val.goods_id}`)
        if (res.meta.status !== 200) return this.$message.error('删除商品失败')
        // 删除成功，刷新数据，提醒用户删除成功
        this.getGoodsList()
        this.$message.success('成功删除商品')
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 添加商品，跳转到添加商品界面
    addGoods () {
      // 跳转到添加商品界面
      this.$router.push('/add')
    }
  }
}

</script>
<style lang='less' scoped>
.el-card {
  margin-top: 10px;
  height: 94%;
}
.el-row {
  margin-bottom: 20px;
}
.butEdit {
  margin-left: 80px;
}
</style>
