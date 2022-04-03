<template>
  <div style="height:100%">
    <el-container class="about-Box">
      <el-header class="el-headerCopy">
        <div>
          <img src="../assets/imgs/logo.png" alt />
          <p>某某电商后台管理系统</p>
        </div>
        <el-button type="info" @click="userout">退出</el-button>
      </el-header>
      <el-container>
        <!-- 侧边导航菜单栏 -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="change-menu" @click="chengeMeun">|||</div>
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#5873de"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
          >
            <!-- 一级菜单 -->
            <el-submenu :index="item.path" v-for="item in MenusList" :key="item.id">
              <template slot="title">
                <i :class="IconList[item.id]" class="iconFatherStyle"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="subitem.path"
                v-for="subitem in item.children"
                :key="subitem.id"
              >
                <template slot="title">
                  <i :class="IconList[subitem.id]" class="iconSonStyle"></i>
                  <span>{{subitem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主页面布局 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      MenusList: [], // 获取菜单数据
      // 左侧菜单栏，图像
      IconList: {
        125: 'iconfont icon-yonghuguanli',
        110: 'iconfont icon-yonghuguanli1',
        103: 'iconfont icon-quanxian',
        111: 'iconfont icon-yonghuguanli',
        112: 'iconfont icon-quanxianguanli',
        101: 'iconfont icon-shangpinguanli1',
        104: 'iconfont icon-shangpinguanli',
        115: 'iconfont icon-01_shangpinfenlei',
        121: 'iconfont icon-shangpinguanli2',
        102: 'iconfont icon-gouwuche',
        107: 'iconfont icon-shangpinliebiao',
        145: 'iconfont icon-shujutongji',
        146: 'iconfont icon-guzhihesuanbaobiao'
      },
      isCollapse: false // 左侧导航栏默认不展开
    }
  },
  created () {
    this.getMennList()
  },
  methods: {
    // 退出账号
    userout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取数据
    async getMennList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return console.log('获取后台数据失败')
      this.MenusList = res.data
    },
    // 改变左侧边栏切换动画
    chengeMeun () {
      this.isCollapse = !this.isCollapse
    }
  }
}

</script>
<style lang='less' scoped>
.about-Box {
  height: 100%;
}
.el-heade,
.el-footer {
  background-color: #b3c0d1;
  text-align: center;
  line-height: 60px;
}
.el-headerCopy {
  background-color: rgb(88, 115, 222);
  padding: 0;
  display: flex;
  justify-content: space-between;
  color: #fff;
  > div {
    display: flex;
    img {
      width: 200px;
      height: 60px;
      background-color: #fff;
    }
  }
}
.el-aside {
  background-color: rgb(84, 92, 100);
  color: #333;
  text-align: center;
  border-right: none;
  .change-menu {
    width: 100%;
    height: 24px;
    font-size: 10px;
    line-height: 22px;
    color: #ffffff;
    border-bottom: solid rgb(110, 122, 133) 1px;
  }
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #f8f8f8;
  color: #333;
}
.iconFatherStyle {
  padding-right: 10px;
  font-size: 26px;
}
.iconSonStyle {
  padding-right: 8px;
  font-size: 20px;
}
</style>
