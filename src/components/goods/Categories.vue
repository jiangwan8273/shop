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
      <div>
        <!-- 添加按钮 -->
        <el-button
          class="cardAddBut"
          type="primary"
          @click="addClassifyDialogFormVisible = true"
        >添加分类</el-button>
      </div>
      <!-- 卡片内容,新引入外部模板 -->
      <tree-table
        :data="goodsCateData"
        border
        stripe
        show-header
        show-index
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
      >
        <template slot="info" slot-scope="scope">
          <i class="el-icon-success" id="eleIconTrue" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" id="eleIconFalse" v-else></i>
        </template>
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success" size="mini">二级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 2" type="warning" size="mini">三级</el-tag>
        </template>
        <template slot="open" slot-scope="scope">
          <el-button type="primary" size="mini" @click="showEditClassDialog(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="openDeleteClassconfirm(scope.row)">删除</el-button>
        </template>
      </tree-table>
      <!-- 卡片底部分页效果 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsQueryInfo.pagenum"
        :page-sizes="[2, 6, 10, 20]"
        :page-size="goodsQueryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="goodsDataTotal"
      ></el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addClassifyDialogFormVisible">
      <el-form
        :model="addClassifyFormData"
        :rules="addClassifyFormrules"
        ref="addClassifyFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addClassifyFormData.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <div class="block">
            <el-cascader
              v-model="selectKeys"
              :options="addgoodsList"
              :props="addClassifyProps"
              checkStrictly="true"
              @change="addClassifyChange"
              expandTrigger="hover"
              change-on-select
              clearable
            ></el-cascader>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addClassifyFormCancel">取 消</el-button>
        <el-button type="primary" @click="addClassifyFormSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editClassifyDialogFormVisible">
      <el-form
        :model="editClassifyFormData"
        :rules="editClassifyFormRules"
        ref="editClassifyFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editClassifyFormData.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editClassifyDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editClassifyDialogFormSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: true,
      // 商品分类列表
      goodsDataTotal: 0,
      // 卡片内容数据
      goodsCateData: [],
      // 分页数据
      goodsQueryInfo: {
        type: [],
        // 当前页码值,默认第1页
        pagenum: 1,
        // 每页显示多少条数据，默认每页2条数据
        pagesize: 6
      },
      // 添加分类获取父级分类列表
      addgoodsQueryInfoList: {
        type: [2]
      },
      // 外部调用表格规则
      columns: [
        {
          label: '商品分类',
          prop: 'cat_name',
          width: '400px'
        }, {
          label: '是否有效',
          width: '90px',
          minWidth: '80px',
          type: 'template',
          template: 'info'
        }, {
          label: '排序',
          width: '100px',
          minWidth: '80px',
          type: 'template',
          template: 'level'
        }, {
          label: '操作',
          type: 'template',
          template: 'open'
        }
      ],
      // 默认添加分类对话框
      addClassifyDialogFormVisible: false,
      // 添加分类对话框表单数据
      addClassifyFormData: {
        // 分类名称
        cat_name: '',
        // 分类父 ID
        cat_pid: 0,
        // 分类层级
        cat_level: 0
      },
      // 添加分类对话框表单验证
      addClassifyFormrules: {
        cat_name: [
          { required: true, message: '分类名称为必填项', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ]
      },
      // 获取只有没有最后一层的分类列表，即type是[2]
      addgoodsList: [],
      // 定义添加分类对话框次级选择器props
      addClassifyProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的添加分类父级选中分类名称ID数组
      selectKeys: [],
      // 添加分类将要推送的父ID
      selectval: '',
      // 添加分类后台交互数据
      selectData: {
        cat_pid: '',
        cat_name: '',
        cat_level: ''
      },
      // 编辑分类对话框数据
      editClassifyFormData: {},
      // 编辑分类对话框，默认关闭
      editClassifyDialogFormVisible: false,
      // 编辑分类对话框校验规则
      editClassifyFormRules: {
        cat_name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.categoriesList()
    this.addgoodsQueryInfo()
  },
  methods: {
    // 分页效果
    handleSizeChange (val) {
      // 当前每页数据量赋值给queryInfo.pagesize
      this.goodsQueryInfo.pagesize = val
      this.categoriesList()
    },
    handleCurrentChange (val) {
      // 当前页数赋值给queryInfo.pagenum
      this.goodsQueryInfo.pagenum = val
      this.categoriesList()
    },
    // 获取商品分类数据
    async categoriesList () {
      const { data: res } = await this.$http.get('categories/', { params: this.goodsQueryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取后台数据失败')
      // 获取总数据量赋值给goodsDataTotal
      this.goodsDataTotal = res.data.total
      // 获取到的后台数据赋值给goodsCateData
      this.goodsCateData = res.data.result
    },
    // 添加分类对话框验证提交
    addClassifyFormSubmit () {
      this.addgoodsQueryInfo()
      this.$refs.addClassifyFormRef.validate(async val => {
        if (val !== true) return
        // 其余部分数据赋值给selectData
        this.selectData.cat_name = this.addClassifyFormData.cat_name
        // selectData.cat_level获取是父元素的，+ 1 变为将要添加的元素的
        this.selectData.cat_level = this.selectData.cat_level + 1
        // 推送新增数据
        const { data: res } = await this.$http.post('categories', this.selectData)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败')
        this.$message.success('成功添加分类')
        // 清空加法操作，存在'selectData.cat_level + 1'加法操作结果叠加
        this.selectData.cat_level = ''
        // 关闭对话框
        this.addClassifyDialogFormVisible = false
        // 清空表单数据
        this.resetForm('addClassifyFormRef')
        this.selectKeys = []
        // 刷新数据
        this.categoriesList()
      })
    },
    // 添加分类对话框取消
    addClassifyFormCancel () {
      // 关闭对话框
      this.addClassifyDialogFormVisible = false
      // 清空表单数据
      this.resetForm('addClassifyFormRef')
      this.selectKeys = []
    },
    // 添加分类获取对话框数据
    async addgoodsQueryInfo () {
      const { data: res } = await this.$http.get('categories', { params: this.addgoodsQueryInfoList })
      if (res.meta.status !== 200) return this.$message.error('获取分类列表2级列表失败')
      this.addgoodsList = res.data
    },
    // 级联选择器单击事件
    async addClassifyChange () {
      if (this.selectKeys.length === 1) {
        // 数组长度为1那么选择一级
        this.selectval = this.selectKeys[0]
      } else {
        // 数组长度为2那么选择二级
        this.selectval = this.selectKeys[1]
      }
      // 获取选中次级选择器信息
      const { data: res } = await this.$http.get(`categories/${this.selectval}`)
      if (res.meta.status !== 200) return
      // 获取到的部分数据赋值给selectData
      this.selectData.cat_pid = res.data.cat_id
      this.selectData.cat_level = res.data.cat_level
    },
    // 对话框清空表单数据
    resetForm (formData) {
      this.$refs[formData].resetFields()
    },
    // 单击打开分类编辑对话框
    async showEditClassDialog (val) {
      this.editClassifyDialogFormVisible = true
      // 根据ID查询
      const { data: res } = await this.$http.get(`categories/${val.cat_id}`)
      if (res.meta.status !== 200) return
      // 获取赋值
      this.editClassifyFormData = res.data
    },
    // 提交编辑对话框
    editClassifyDialogFormSubmit () {
      this.$refs.editClassifyFormRef.validate(async val => {
        // 验证是否通过表单预校验
        if (!val) return
        // 推送编辑的数据
        const { data: res } = await this.$http.put(`categories/${this.editClassifyFormData.cat_id}`, { id: this.editClassifyFormData.cat_id, cat_name: this.editClassifyFormData.cat_name })
        if (res.meta.status !== 200) return
        // 推送成功清空缓存数据
        this.editClassifyFormData = {}
        // 关闭对话框，刷新数据
        this.editClassifyDialogFormVisible = false
        this.categoriesList()
      })
    },
    // 删除按钮
    openDeleteClassconfirm (val) {
      this.$confirm('此操作将永久删除该数据以及子数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 推送要删除的数据
        const { data: res } = await this.$http.delete(`categories/${val.cat_id}`)
        if (res.meta.status !== 200) return
        // 删除成功刷新数据，提醒御用删除成功
        this.categoriesList()
        this.$message.success('删除成功!')
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
    }
  }
}
</script>
<style lang='less' scoped>
.el-card {
  margin-top: 20px;
  .cardAddBut {
    padding-bottom: 16px;
  }
  .el-pagination {
    margin-top: 14px;
  }
}
#eleIconTrue {
  font-size: 20px;
  color: rgb(58, 226, 100);
  line-height: 40px;
}
#eleIconFalse {
  font-size: 20px;
  color: rgb(226, 58, 58);
  line-height: 40px;
}
.el-cascader {
  width: 100%;
}
</style>
