<template>
  <div class="login-box">
    <div class="login-main">
      <div class="Lmain-logoimg">
        <!-- logo图片 -->
      </div>
      <div class="Lmain-usersetting">
        <!-- 登录组件编写 -->
        <!-- 账号密码 -->
        <el-form :model="LoginForm" :rules="LoginFormRules" ref="ruleFormRef">
          <el-form-item prop="username">
            <el-input
              v-model="LoginForm.username"
              placeholder="用户名"
              prefix-icon="iconfont icon-zhanghao"
              onkeyup="value=value.replace(/[^\w\.\/]/ig,'')"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="LoginForm.password"
              placeholder="密码"
              prefix-icon="iconfont icon-icon-test"
              onkeyup="value=value.replace(/[^\w\.\/]/ig,'')"
            ></el-input>
          </el-form-item>
          <!-- 登录注册按钮 -->
          <el-form-item class="btn-align">
            <el-button type="primary" class="btn-w" @click="loginclick">登录</el-button>
            <el-button class="btn-w">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 身份表单数据绑定
      LoginForm: {
        username: 'admin', // 用户默认名称
        password: '123456' // 用户默认密码
      },
      // 验证账号密码规则
      LoginFormRules: {
        // 用户名称规则
        username: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' }
        ],
        // 用户密码规则
        password: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' }
        ]
      },
      // 获取登录数据
      Javalogin: {}
    }
  },
  methods: {
    // 登录功能
    loginclick () {
      this.$refs.ruleFormRef.validate(async val => {
        if (!val) return console.log('登录组件错误')
        const { data: res } = await this.$http.post('login', this.LoginForm)
        if (res.meta.status !== 200) this.$message.error('账号或密码错误')
        this.$message.success('登录成功')
        // 保存token值在浏览器中
        window.sessionStorage.setItem('token', res.data.token)
        // 页面跳转到users界面
        this.$router.push('about')
      })
    }
  }
}

</script>
<style lang='less' scoped>
.login-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgb(80, 105, 241);
}
.login-main {
  position: relative;
  background-color: #fff;
  width: 400px;
  height: 280px;
  border-radius: 20%;
  .Lmain-logoimg {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff url(../assets/imgs/logo.png) no-repeat 16px 26px;
    background-size: 80%;
    box-shadow: 1px 2px 5px 6px #eee inset;
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }
  .Lmain-usersetting {
    position: absolute;
    bottom: 0;
    padding: 0 40px;
    width: 100%;
    box-sizing: border-box;
    .btn-align {
      display: flex;
      justify-content: space-between;
      .btn-w {
        width: 134px;
      }
    }
  }
}
</style>
