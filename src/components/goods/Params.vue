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
      <el-alert title="只能选用三级标签" type="warning" :closable="false"></el-alert>
      <!-- 次联级选择器 -->
      <el-row>
        <el-col class="mainCol">
          <span>选择：</span>
          <el-cascader
            v-model="valueArr"
            :options="categoriesList"
            :props="optionsProps"
            expandTrigger="hover"
            @change="handleChange"
            placeholder="请选择"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-button
        type="primary"
        size="medium"
        class="addBut"
        @click="showAddClassForm"
        :disabled="ifdisabled"
      >添加属性</el-button>
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <!-- 动态参数标签页 -->
        <el-tab-pane label="动态参数" name="many">
          <el-table :data="attributesParams" border style="width: 100%">
            <!-- 动态参数展开行效果 -->
            <el-table-column type="expand" width="50">
              <template slot-scope="scope">
                <el-tag
                  :key="i"
                  v-for="(item,i) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(item,scope.row.attr_vals,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  style="width:100px"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="attr_name" label="名称" width="180"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="warning" size="mini" @click="showEditClassForm(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="deleteClassForm(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态参数标签页 -->
        <el-tab-pane label="静态参数" name="only">
          <el-table :data="attributesParams" border style="width: 100%">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="attr_name" label="名称" width="180"></el-table-column>
            <el-table-column prop="attr_vals" label="属性"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="warning" size="mini" @click="showEditClassForm(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="deleteClassForm(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加属性对话框 -->
    <el-dialog title="添加属性" :visible.sync="addClassFormVisible">
      <el-form
        :model="addClassFormData"
        :rules="addClassFormRules"
        ref="addClassFormVisibleRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="attr_name">
          <el-input v-model="addClassFormData.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addClassFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClassFormsubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑属性对话框 -->
    <el-dialog title="编辑属性" :visible.sync="editClassFormVisible">
      <el-form
        :model="editClassFormData"
        :rules="editClassFormRules"
        ref="editClassFormVisibleRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="attr_name">
          <el-input v-model="editClassFormData.attr_name"></el-input>
        </el-form-item>
        <el-form-item label="属性" prop="attr_vals" v-show="this.activeName === 'many' ? false:true">
          <el-input v-model="editClassFormData.attr_vals"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editClassFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editClassFormSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取后台对象数据
      categoriesList: [],
      // 配置关联对象
      optionsProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中按钮的数组
      valueArr: [],
      // 标签页默认值，默认动态参数
      activeName: 'many',
      // 获取到的分类参数列表数据保存
      attributesParams: [],
      // 禁用添加属性按钮,默认开启
      ifdisabled: true,
      // 添加分类对话框，默认关闭
      addClassFormVisible: false,
      // 编辑分类对话框，默认关闭
      editClassFormVisible: false,
      // 添加分类对话框,默认数据
      addClassFormData: {
        attr_name: ''
      },
      // 编辑分类对话框,默认数据
      editClassFormData: {
        attr_name: ''
      },
      // 添加分类对话框,数据校验格式
      addClassFormRules: {
        attr_name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 添加分类对话框,数据校验格式
      editClassFormRules: {
        attr_name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        attr_vals: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ]
      },
      // 存储点击编辑按钮的属性ID
      getValId: ''
    }
  },
  created () {
    this.getCategoriesList()
  },
  methods: {
    async getCategoriesList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取后台数据错误')
      this.categoriesList = res.data
    },
    // 获取分类参数列表
    async getAttributesList () {
      const { data: res } = await this.$http.get(`categories/${this.valueArr[2]}/attributes`, { params: { sel: this.activeName } }
      )
      if (res.meta.status !== 200) return console.log('获取分类参数列表失败')
      // 点击动态参数展开行，修改后台获取到的数据attr_vals分割成数组
      res.data.forEach(item => {
        // Bug-判断是否为空，为空的话返回空数组
        if (item.attr_vals === '') {
          item.attr_vals = []
        } else {
          item.attr_vals = item.attr_vals.split(' ')
        }
        // 添加标签，默认关闭
        item.inputVisible = false
        // 添加标签，默认数据
        item.inputValue = ''
      })
      // 赋值获取到的分类列表数据
      this.attributesParams = res.data
    },
    // 选中三级次联选择器
    handleChange (value) {
      // 赋值获取到的数据
      this.valueArr = value
      // 如果不是三级标签，那么清空选中的数据
      if (value.length !== 3) {
        // 清空选中的数据
        this.valueArr = []
        // 请空缓存
        this.attributesParams = []
      } else {
        this.ifdisabled = false
        // 调用方法展示数据
        this.getAttributesList()
      }
    },
    // 标签页点击事件，点击改变页面动态&静态
    handleTabsClick () {
      if (this.activeName === 'only') {
        this.activeName = 'only'
      } else {
        this.activeName = 'many'
      }
      // 刷新数据
      this.getAttributesList()
    },
    // 删除标签，点击X删除标签
    async handleClose (tag, arr, val) {
      arr.splice(arr.indexOf(tag), 1)
      // 添加的标签推送到后台
      const { data: res } = await this.$http.put(`categories/${this.valueArr[2]}/attributes/${val.attr_id}`, {
        attr_name: val.attr_name,
        attr_sel: val.attr_sel,
        attr_vals: arr.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error('删除标签失败')
      // 提醒用户编辑成功
      this.$message.success('删除标签成功')
    },
    // 添加标签，回车或者鼠标离开触发事件
    async handleInputConfirm (val) {
      // Bug-判断input输入框是否为空，保证添加到的标签不为空
      if (val.inputValue.trim().length === 0) {
        val.inputValue = ''
        // 关闭输入框Input
        val.inputVisible = false
      } else {
        // 添加标签
        val.attr_vals.push(val.inputValue)
        // 关闭输入框Input
        val.inputVisible = false
        // 添加属性重置为空
        val.inputValue = ''
        // 添加的标签推送到后台
        const { data: res } = await this.$http.put(`categories/${this.valueArr[2]}/attributes/${val.attr_id}`, {
          attr_name: val.attr_name,
          attr_sel: val.attr_sel,
          attr_vals: val.attr_vals.join(' ')
        })
        if (res.meta.status !== 200) return this.$message.error('添加标签失败')
        // 提醒用户编辑成功
        this.$message.success('新增标签成功')
      }
    },
    // 点击添加按钮打开对话框
    showAddClassForm () {
      this.addClassFormVisible = true
    },
    // 提交添加对话框数据
    addClassFormsubmit () {
      this.$refs.addClassFormVisibleRef.validate(async val => {
        // 预校验失败直接返回
        if (!val) return
        // 响应添加对话框后台数据
        const { data: res } = await this.$http.post(`categories/${this.valueArr[2]}/attributes`, {
          attr_name: this.addClassFormData.attr_name,
          attr_sel: this.activeName,
          attr_vals: 1
        })
        // 判断是否正确推送
        if (res.meta.status !== 201) return
        // 推送成功提示，关闭对话框，刷新数据，清空缓存
        this.$message.success('添加成功')
        this.addClassFormVisible = false
        this.getAttributesList()
        this.addClassFormData.attr_name = ''
      })
    },
    // 点击编辑按钮打开对话框
    async showEditClassForm (valId) {
      this.getValId = valId.attr_id
      // 根据ID查找后台数据
      const { data: res } = await this.$http.get(`categories/${this.valueArr[2]}/attributes/${this.getValId}`)
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      // 获取成功，赋值获取到的数据给文本输入框
      this.editClassFormData = valId
      this.editClassFormVisible = true
    },
    // 点击删除按钮打开提示框
    async deleteClassForm (valId) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        const { data: res } = await this.$http.delete(`categories/${this.valueArr[2]}/attributes/${valId.attr_id}`)
        if (res.meta.status !== 200) return
        // 提醒用户删除成功，调用方法展示数据
        this.$message.success('删除成功')
        this.getAttributesList()
      }).catch(() => {
        this.$message.info('操作已取消')
      })
    },
    // 提交编辑对话框数据
    editClassFormSubmit () {
      this.$refs.editClassFormVisibleRef.validate(async val => {
        // 判断表单验证，失败直接返回
        if (!val) return
        // 推送编辑更改的数据
        const { data: res } = await this.$http.put(`categories/${this.valueArr[2]}/attributes/${this.getValId}`, {
          attr_name: this.editClassFormData.attr_name,
          attr_sel: this.activeName,
          attr_vals: this.editClassFormData.attr_vals
        })
        if (res.meta.status !== 200) return this.$message.error('编辑用户属性错误')
        // 提醒用户编辑成功，关闭对话框，刷新数据
        this.$message.success('成功编辑用户属性')
        this.editClassFormVisible = false
        this.getAttributesList()
      })
    },
    // 展开添加标签input按钮
    showInput (val) {
      val.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  },
  component: {}
}

</script>
<style lang='less' scoped>
.el-card {
  margin-top: 20px;
  .mainCol {
    margin: 10px 0;
  }
}
.addBut {
  margin: 8px 0;
}
.el-tag {
  margin: 4px 6px;
}
</style>
