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
      <el-alert title="添加商品列表！" type="info" center show-icon style="margin-bottom: 20px;"></el-alert>
      <el-steps finish-status="success" align-center :active="activeIndex - 0">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 商品信息表单 -->
      <el-form
        :model="addGoodsForm"
        :rules="addGoodsrules"
        ref="addRuleForm"
        label-width="100px"
        label-position="top"
        class="demo-ruleForm"
      >
        <!-- 左侧标签页效果 -->
        <el-tabs
          tab-position="left"
          style="margin-top:20px"
          v-model="activeIndex"
          :before-leave="changeTab"
          @tab-click="handleClick"
        >
          <!-- 左侧标签页 -->
          <el-tab-pane label="基本信息" name="0">
            <!-- 商品添加信息表单 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name" porp="goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addGoodsForm.goods_number"
                onkeyup="value=value.replace(/[^\d]/g,'')"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addGoodsForm.goods_price"
                onkeyup="value=value.replace(/[^\d]/g,'')"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addGoodsForm.goods_weight"
                onkeyup="value=value.replace(/[^\d]/g,'')"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_name">
              <!-- 级联选择器 -->
              <div class="block">
                <el-cascader
                  v-model="selectVal"
                  :options="CateList"
                  :props="cateListProps"
                  expandTrigger="hover"
                  @change="handleChange"
                  clearable
                ></el-cascader>
              </div>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="(item,i) in this.getCateListManyData"
              :key="i"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item2"
                  v-for="(item2,i2) in item.attr_vals"
                  :key="i2"
                  border
                  size="mini"
                  class="checkboxStyle"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="(item,i) in this.getCateListOnlyData"
              :key="i"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item2"
                  v-for="(item2,i2) in item.attr_vals"
                  :key="i2"
                  border
                  size="mini"
                  class="checkboxStyle"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="uploadImgUrlHeaders"
              :on-success="uploadAddImgSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor ref="myQuillEditor" v-model="addGoodsForm.goods_introduce" />
            <el-button type="primary" class="btnAddShop" @click="AddShop">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 打开添加图片对话框 -->
    <el-dialog title="图片" :visible.sync="dialogVisibleAddImg" width="30%">
      <img :src="UpdataImgUrl" alt class="UpdataImg" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 步骤条，跳转索引，默认为空
      activeIndex: '0',
      // 添加商品表单数据
      addGoodsForm: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_cat: [],
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      // 添加商品表单验证规则
      addGoodsrules: {
        goods_name: [
          { required: true, message: '不能为空，请输入商品名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '不能为空，请输入请商品价格，只能输入数字', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '不能为空，请输入请商品数量，只能输入数字', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '不能为空，请输入请商品重量，只能输入数字', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 获取商品分类列表
      CateList: [],
      // 级联选择器配置
      cateListProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 商品分类选中数组
      selectVal: [],
      // 获取静态/动态列表数据
      getCateListManyData: [],
      getCateListOnlyData: [],
      // 打开图片对话框 默认关闭
      dialogVisibleAddImg: false,
      // 上传对象地址
      uploadImgUrlHeaders: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 上传图片地址
      UpdataImgUrl: ''
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取后台数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      this.CateList = res.data
    },
    // 级联选择器，改变事件
    handleChange (val) {
      // val传递过来的是选择器选中的数组属性
      if (val.length !== 3) {
        this.selectVal = []
        return this.$message.error('必须选中三级选择器')
      } else {
        // 获取到的数组赋值给this.selectVal
        this.selectVal = val
      }
    },
    changeTab (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.selectVal.length !== 3) {
        this.$message.error('必须选择商品分类')
        return false
      }
    },
    // 切换标签时触发
    async handleClick () {
      // 判断获取静态还是动态
      if (this.activeIndex === '1') {
        // 获取后台列表动态数据
        const { data: res } = await this.$http.get(`categories/${this.selectVal[2]}/attributes`, {
          params: {
            sel: 'many'
          }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取列表数据失败')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
        // 获取到的数据赋值给this.getCateListData
        this.getCateListManyData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.selectVal[2]}/attributes`, {
          params: {
            sel: 'only'
          }
        })
        if (res.meta.status !== 200) return this.$message.error('获取静态属性失败')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals === 0 ? [] : item.attr_vals.split(',')
        })
        this.getCateListOnlyData = res.data
      }
    },
    // 图片上传成功
    uploadAddImgSuccess (response) {
      const picInfo = { pic: response.data.tmp_path }
      this.addGoodsForm.pics.push(picInfo)
    },
    // 点击删除照片操作
    handleRemove (file) {
      // 根据索引删除
      const i = this.addGoodsForm.pics.findIndex(x =>
        x.pic === file.response.data.tmp_path
      )
      this.addGoodsForm.pics.splice(i, 1)
    },
    // 放大图片
    handlePreview (file) {
      // 获取图片临时路径
      this.UpdataImgUrl = file.url
      // 打开放大图片对话框
      this.dialogVisibleAddImg = true
    },
    // 添加商品
    AddShop () {
      this.$refs.addRuleForm.validate(async val => {
        if (!val) {
          this.$message.error('请输入完整的商品信息')
        } else {
          // 选中项数组,改变数组为字符串
          this.addGoodsForm.goods_cat = this.selectVal
          this.addGoodsForm.goods_cat = this.addGoodsForm.goods_cat.join(',')
          // 添加动态数组
          this.getCateListOnlyData.forEach(item => {
            const onlyData = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            this.addGoodsForm.attrs.push(onlyData)
          })
          // 添加静态数组
          this.getCateListManyData.forEach(item => {
            const manyData = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            this.addGoodsForm.attrs.push(manyData)
          })
          // 提交完成添加商品表单
          const { data: res } = await this.$http.post('goods', this.addGoodsForm)
          // 判断添加商品成功失败
          if (res.meta.status !== 201) {
            if (res.meta.status === 400) {
              this.$message.error('商品已存在')
            } else {
              this.$message.error('输入有误')
            }
          }
          this.$message.success('添加商品成功')
          this.$router.push('Goods')
        }
      })
    }
  }
}

</script>
<style lang='less' scoped>
.el-card {
  margin-top: 10px;
}
.checkboxStyle {
  margin: 0 8px 0 0 !important;
}
.UpdataImg {
  width: 100%;
}
.btnAddShop {
  margin-top: 10px;
}
</style>
