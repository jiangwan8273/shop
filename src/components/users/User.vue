<template>
  <!-- 面包屑导航 -->
  <div style="height: 100%;">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体内容-卡片形式 -->
    <el-card>
      <!-- 混合布局main -->
      <el-row>
        <el-col :span="8">
          <!-- 第一行搜索框 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryList.query"
            class="input-with-select"
            clearable
            @clear="getUsersList()"
            style="vertical-align: bottom;outline:none;margin-bottom:10px"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUsersList(),userSearch()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 添加用户按钮 -->
          <div class="grid-content bg-purple">
            <el-button
              type="primary"
              style="margin-left:32px"
              @click="dialogFormVisible = true"
            >添加用户</el-button>
          </div>
        </el-col>
      </el-row>
      <!-- 内容主体-表格内容 -->
      <div>
        <el-table height="500px" border style="width: 100%;height:100%" :data="usersList" stripe>
          <el-table-column type="index" label="序号" width="100"></el-table-column>
          <el-table-column prop="username" label="姓名" width="140"></el-table-column>
          <el-table-column prop="email" label="邮箱" width="220"></el-table-column>
          <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
          <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
          <el-table-column prop="mg_state" label="状态" width="180">
            <!-- 状态内容组件 -->
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="userChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="操作" width="250">
            <!-- 操作内容组件 -->
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="修改" placement="left">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  size="small"
                  @click="showDialogUpdata(scope.row.id)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  size="small"
                  @click="deleteUser(scope.row.id)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="分配角色" placement="bottom-end">
                <el-button
                  type="success"
                  icon="el-icon-check"
                  circle
                  size="small"
                  @click="setRoles(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 页面主题底部分页效果 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[ 4, 8, 10, 20]"
          :page-size="queryList.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible" @close="closeDialog">
      <!-- 添加用户表单 -->
      <el-form
        :model="addUserForm"
        :rules="addUserRules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="姓名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input
            v-model="addUserForm.mobile"
            type="tel"
            onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="UpdataFormVisible" @close="closeDialogUpdataUser">
      <!-- 修改用户表单 -->
      <el-form
        :model="updataUserFrom"
        :rules="updataUserFormrules"
        ref="updataUserFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="姓名">
          <el-input type="info" :disabled="true" v-model="updataUserFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updataUserFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input
            v-model="updataUserFrom.mobile"
            type="tel"
            onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="UpdataFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updataUserFromInfo">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除用户提示框 -->
    <el-dialog title="删除此用户" :visible.sync="outerVisible">
      <el-dialog
        title="确认删除用户"
        :visible.sync="deleteDialogVisible"
        width="30%"
        center
        append-to-body
      >
        <span>
          确认删除用户
          <b class="deleteUserName">"{{this.deteleData.username}}"</b>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取 消</el-button>
          <el-button type="danger" @click="deleteUserData">确 定</el-button>
        </span>
      </el-dialog>
      <div>
        <span>
          <p class="deleteUserName">将要删除用户信息</p>
          <p>
            <span class="deleteDialogfonsize">用户姓名 :</span>
            "{{this.deteleData.username}}"
          </p>
          <p>
            <span class="deleteDialogfonsize">用户邮箱 :</span>
            "{{this.deteleData.email}}"
          </p>
          <p>
            <span class="deleteDialogfonsize">用户电话 :</span>
            "{{this.deteleData.mobile}}"
          </p>
        </span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteDialogVisible = true">确认删除</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRolesDialogVisible" width="50%">
      <p>
        当前用户：
        <span>{{setRolesData.username}}</span>
      </p>
      <p>
        当前角色：
        <span>{{setRolesData.role_name}}</span>
      </p>
      <p>
        分配角色：
        <el-select v-model="SeletValue" placeholder="请选择">
          <el-option
            v-for="item in setRolesDataValue"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </p>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRolesSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 后台获取用户列表参数
      queryList: {
        query: '', // 查询条件
        pagenum: 1, // 当前页数
        pagesize: 8 // 每页显示多少条
      },
      usersList: [], // 获取用户列表
      total: 0,
      dialogTableVisible: false, // 添加用户取消按钮
      dialogFormVisible: false, // 添加用户确认按钮
      // 添加用户表单数据
      addUserForm: {},
      // 添加用户校验规则
      addUserRules: {
        // 用户名校验规则
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '请输入正确的手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '长度在 11 个字符', trigger: 'blur' }
        ]
      },
      // 未知代码
      // form: {
      //   name: '',
      //   region: '',
      //   date1: '',
      //   date2: '',
      //   delivery: false,
      //   type: [],
      //   resource: '',
      //   desc: ''
      // },
      formLabelWidth: '120px',
      // 修改用户对话框默认
      UpdataFormVisible: false,
      // 修改用户对话框数据
      updataUserFrom: {},
      // 修改用户数据校验规则
      updataUserFormrules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '请输入正确的手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '长度在 11 个字符', trigger: 'blur' }
        ]
      },
      // 删除用户对话框默认
      deleteDialogVisible: false,
      // 删除用户外部对话框
      outerVisible: false,
      // 删除用户默认数据
      deteleData: '',
      // 分配角色对话框默认关闭
      setRolesDialogVisible: false,
      // 分配角色对话框数据
      setRolesData: {},
      // 分配角色对话框角色数据
      setRolesDataValue: [],
      // 分配角色对话框Selet默认数据
      SeletValue: ''
    }
  },
  created () {
    this.getUsersList()
  },
  methods: {
    // 获取main用户信息
    async getUsersList () {
      const { data: res } = await this.$http.get('users', { params: this.queryList })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.usersList = res.data.users
      this.total = res.data.total
    },
    // 改变当前页数为
    handleSizeChange (valSize) {
      this.queryList.pagesize = valSize
      this.getUsersList()
    },
    // 改变当前页数为
    handleCurrentChange (valCur) {
      this.queryList.pagenum = valCur
      this.getUsersList()
    },
    // 监听用户状态改变
    async userChange (val) {
      const { data: res } = await this.$http.put(`users/${val.id}/state/${val.mg_state}`)
      if (res.meta.status !== 200) {
        this.mg_state = !this.mg_state
        this.$message.error('改变用户状态失败')
      }
    },
    // 清空输入框内容
    userSearch () {
      this.queryList.query = ''
    },
    // 点击X关闭确认是否关闭添加用户对话框
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    },
    // 监听添加用户对话框关闭重置表单
    closeDialog () {
      // 触发重置表单验证
      this.$refs.addFormRef.resetFields()
    },
    // 监听添加用户操作
    addUser () {
      // 表单预校验
      this.$refs.addFormRef.validate(async val => {
        // 校验失败
        if (!val) return
        const { data: res } = await this.$http.post('users', this.addUserForm)
        if (res.meta.status !== 201) {
          if (res.meta.status === 400) {
            this.$message.warning('用户已存在，创建失败')
          } else {
            this.$message.error('用户创建失败')
            console.log('创建用户失败，返回值:' + res.meta.status)
          }
        } else {
          this.$message.success('用户创建成功')
          // 关闭用户对话框
          this.dialogFormVisible = false
          this.getUsersList()
        }
      })
    },
    // 修改用户重置表单
    closeDialogUpdataUser () {
      this.$refs.updataUserFormRef.resetFields()
    },
    // 监听修改用户对话框
    async showDialogUpdata (id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return
      this.updataUserFrom = res.data
      // 调用修改用户对话框
      this.UpdataFormVisible = true
    },
    // 提交修改用户对话框
    updataUserFromInfo () {
      this.$refs.updataUserFormRef.validate(async val => {
        if (!val) {
          this.$message.error('错误的修改数据')
        } else {
          const { data: res } = await this.$http.put('users/' + this.updataUserFrom.id, { email: this.updataUserFrom.email, mobile: this.updataUserFrom.mobile })
          if (res.meta.status !== 200) return this.$message.error('修改用户数据失败')
          this.$message.success('修改用户数据成功')
          // 刷新数据列表
          this.getUsersList()
        }
      })
      // 关闭修改用户对话框，刷新数据
      this.UpdataFormVisible = false
      // 刷新数据列表
      this.getUsersList()
    },
    // 监听删除数据对话框
    async deleteUser (id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) console.log('删除操作获取用户ID失败')
      // 获取将要删除的数据，赋值
      this.deteleData = res.data
      // 调出删除用户对话框
      this.outerVisible = true
    },
    async deleteUserData () {
      const { data: res } = await this.$http.delete('users/' + this.deteleData.id)
      if (res.meta.status !== 200) return this.$message.error('删除用户数据失败')
      this.$message.success('删除用户数据成功')
      // 关闭删除内外层对话框
      this.outerVisible = false
      this.deleteDialogVisible = false
      // 刷新删除后数据
      this.getUsersList()
    },
    // 分配角色单击事件
    async setRoles (val) {
      // 传参给setRolesData，对话框Select调用数据
      this.setRolesData = val
      // 获取角色列表，赋值给setRolesDataValue
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return
      this.setRolesDataValue = res.data
      // 开启对话框
      this.setRolesDialogVisible = true
    },
    // 分配角色对话框提交事件
    async setRolesSubmit () {
      // 如果Selet默认值是空，那么不能完成设置
      if (!this.SeletValue) return this.$message('选择要分配的角色')
      // 推送给后台分配角色的的数据
      const { data: res } = await this.$http.put('users/' + this.setRolesData.id + '/role', { rid: this.SeletValue })
      if (res.meta.status !== 200) return this.$message.error('分配用户权限错误')
      this.$message.success('成功分配用户权限')
      // 情况分配角色对话框缓存数据
      this.setRolesDataValue = []
      this.SeletValue = ''
      // 刷新数据，并且关闭对话框
      this.getUsersList()
      this.setRolesDialogVisible = false
    }
  }
}

</script>
<style lang='less' scoped>
.el-card {
  margin-top: 10px;
  height: 94%;
}
.el-card__body {
  margin-top: 10px;
}
.el-card__header {
  padding: 10px 10px;
}
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 10px;
}
.clearfix:after {
  clear: both;
}
.clearfix {
  margin: 0;
  padding: 0;
}
.el-table td,
.el-table th {
  padding: 4px 0;
}
.deleteUserName {
  font-size: 16px;
  color: red;
}
.deleteDialogfonsize {
  color: #47a1ff;
}
</style>
