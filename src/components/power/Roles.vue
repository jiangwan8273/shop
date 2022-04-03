<template>
  <div>
    <!-- 角色列表面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容主题卡片 -->
    <el-card class="box-card">
      <div>
        <!-- 操作按钮 -->
        <el-button type="primary" @click="addRoles">新增角色</el-button>
      </div>
      <!-- 卡片列表 -->
      <el-table :data="rolesList" border style="width: 100%" stripe>
        <!-- 卡片左侧下拉框，子元素 -->
        <el-table-column type="expand" label="↘">
          <template slot-scope="scope">
            <el-row
              :class="['row1','colCenter','rowpub',i1 === 0 ? 'row':'']"
              v-for="(item,i1) in scope.row.children"
              :key="item.id"
            >
              <!-- 渲染一级权限目录 -->
              <el-col :span="5">
                <el-tag closable @click="deleteTag(scope.row,item)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级，三级权限目录 -->
              <el-col :span="19">
                <!-- 渲染二级权限目录 -->
                <el-row
                  :class="['colCenter',i2 === 0? '' :'row']"
                  v-for="(it2,i2) in item.children"
                  :key="it2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @click="deleteTag(scope.row,it2)"
                    >{{it2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限目录 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="it3 in it2.children"
                      type="warning"
                      :key="it3.id"
                      closable
                      @click="deleteTag(scope.row,it3)"
                    >{{it3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 添加序号 -->
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <!-- 角色 -->
        <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
        <el-table-column prop="id" label="操作">
          <!-- 操作界面图标 -->
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="changeRoles(scope.row.id)">
              <i class="iconfont icon-chazhaobiaodanliebiao listIcon"></i>编辑
            </el-button>
            <el-button type="danger" size="mini" @click="deleteRoles(scope.row.id)">
              <i class="iconfont icon-chazhaobiaodanliebiao listIcon"></i>删除
            </el-button>
            <el-button type="warning" size="mini" @click="showSettingRoles(scope.row)">
              <i class="iconfont icon-chazhaobiaodanliebiao listIcon"></i>分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 新增角色对话框 -->
    <el-dialog title="新增角色" :visible.sync="addRolesDialogForm">
      <el-form
        :model="addRolesList"
        :rules="addRolesRules"
        ref="addRolesRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="addRoles">
          <el-input v-model="addRolesList.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesList.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogForm = false">取 消</el-button>
        <el-button type="primary" @click="addRolesFromSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="changeRolesDialogForm">
      <el-form :model="changeRolesList" ref="changeRolesRef" label-width="100px">
        <el-form-item label="角色名称">
          <el-input :disabled="true" v-model="changeRolesList.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="changeRolesList.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeRolesDialogForm = false">取 消</el-button>
        <el-button type="primary" @click="changeRolesDialogFormSubmit(changeRolesList.roleId)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="showSettingDialog" @close="setCloseTree">
      <el-tree
        :data="showSettingData"
        :props="defaultProps"
        ref="showSettingRef"
        node-key="id"
        show-checkbox
        default-expand-all
        :default-checked-keys="arrID"
        empty-text="获取数据有误"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showSettingDialog = false">取 消</el-button>
        <el-button type="primary" @click="showSettingDialogSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 角色权限数据列表
      rolesList: [],
      // 默认关闭新增角色对话框
      addRolesDialogForm: false,
      // 新增角色属性
      addRolesList: {
        roleName: '',
        roleDesc: ''
      },
      // 新增角色信息对话框验证规则
      addRolesRules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
        ]
      },
      // 编辑用户信息对话框默认关闭
      changeRolesDialogForm: false,
      // 编辑用户信息对话框数据
      changeRolesList: [],
      // 分配权限对话框默认关闭
      showSettingDialog: false,
      // 分配权限数据
      showSettingData: [],
      // 分配权限数据树形控件父子绑定
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 三级节点要勾选的ID数组
      arrID: [],
      // 获取即将改变分配权限选中ID数组
      showSettingTreeID: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取角色权限数据列表
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色权限数据失败')
      // 获取列表数据并赋值
      this.rolesList = res.data
    },
    // 点击新增角色开启对话框
    addRoles () {
      this.addRolesDialogForm = true
    },
    // 新增角色对话框确认事件
    addRolesFromSubmit () {
      // 对话框与验证通过触发
      this.$refs.addRolesRef.validate(async val => {
        if (val !== true) return
        // 提交新增角色信息
        const { data: res } = await this.$http.post('roles', this.addRolesList)
        if (res.meta.status !== 201) return this.$message.error('提交新增角色信息失败，请重试')
        // 提交成功提示，刷新数据
        this.$message.success('成功新增角色信息')
        this.getRolesList()
        // 关闭新增角色对话框
        this.addRolesDialogForm = false
      })
    },
    // 删除用户子权限操作
    async deleteTag (father, son) {
      const res = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).catch(err => err)
      // 进入删除角色权限操作
      if (res !== 'confirm') return this.$message('取消删除')
      // 提交后台删除
      const { data: sonres } = await this.$http.delete('roles/' + father.id + '/rights/' + son.id)
      if (sonres.meta.status !== 200) return this.$message('删除用户权限失败')
      // 删除用户权限成功提醒
      this.$message.success('成功删除用户权限')
      // 单独刷新，不影响整个页面刷新重新渲染
      father.children = sonres.data
    },
    // 删除角色
    async deleteRoles (id) {
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除角色失败')
      // 刷新数据，提醒用户删除成功
      this.getRolesList()
      this.$message.success('成功删除角色')
    },
    // 查询用户信息
    async queryRoles (id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询用户信息失败')
      return res // 返回查询用户属性
    },
    // 编辑用户信息
    async changeRoles (id) {
      // 查询将要编辑的用户信息
      const res = await this.queryRoles(id)
      if (res.meta.status !== 200) return
      // 数据本地赋值
      this.changeRolesList = res.data
      // 调出对话框
      this.changeRolesDialogForm = true
    },
    // 编辑用户确认
    async changeRolesDialogFormSubmit (id) {
      const { data: res } = await this.$http.put('roles/' + id, this.changeRolesList)
      if (res.meta.status !== 200) return this.$message.error('编辑角色失败')
      // 关闭对话框
      this.changeRolesDialogForm = false
      // 刷新数据，提醒用户编辑成功
      this.getRolesList()
      this.$message.success('成功编辑角色')
    },
    // 监听分配权限对话框
    async showSettingRoles (val) {
      // 获取即将改变分配权限选中ID数组
      console.log(val)
      this.showSettingTreeID = val.id
      // 获取权限数据，树形列表
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return console.log('打开分配权限失败')
      // 远程获取到的数据赋值到本地
      this.showSettingData = res.data
      // 调用递归方法获取三级节点将要勾选的数组
      this.getTreeKeys(val, this.arrID)
      // 展开对话框
      this.showSettingDialog = true
    },
    // 递归获取三级节点，需要勾选的节点ID，并保存到arrID数组中
    getTreeKeys (node, data) {
      // 获取所有三级节点的ID
      if (!node.children) {
        return data.push(node.id)
      }
      // 递归方法
      node.children.forEach(item => {
        this.getTreeKeys(item, data)
      })
    },
    // 关闭分配权限树形控件回调函数
    setCloseTree () {
      // 清空三级节点数组数据,保证下一次调用依然还是空数组
      this.arrID = []
    },
    // 提交确认修改编辑用户权限对话框
    async showSettingDialogSubmit () {
      const arrSelect = [...this.$refs.showSettingRef.getCheckedKeys(), ...this.$refs.showSettingRef.getHalfCheckedKeys()]
      // 改变数据类型，成为String并且以,分割
      const arr = arrSelect.join(',')
      // 推送用户权限更改信息
      const { data: res } = await this.$http.post('roles/' + this.showSettingTreeID + '/rights', { rids: arr })
      if (res.meta.status !== 200) return this.$message.error('更新用户状态失败')
      // 刷新数据，提醒用户更新状态成功
      this.getRolesList()
      this.$message.success('成功更新用户状态')
      // 关闭对话框
      this.showSettingDialog = false
    }
  }
}

</script>
<style lang='less' scoped>
.el-card {
  height: 100%;
  margin-top: 10px;
  .el-table {
    margin-top: 20px;
  }
}
.listIcon {
  margin-left: -4px;
  margin-right: 6px;
}
.row {
  border-top: 1px solid #eeeeee;
}
.row1 {
  border-bottom: 1px solid #eeeeee;
}
.rowpub {
  .el-tag {
    margin: 8px 6px;
  }
}
.colCenter {
  display: flex;
  align-items: center;
}
</style>
