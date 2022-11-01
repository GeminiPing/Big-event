<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧的 logo -->
      <img src="../../assets/images/logo.png" alt="" />
      <!-- 右侧的菜单 -->
      <el-menu class="el-menu-top" mode="horizontal" background-color="#23262E" text-color="#fff" active-text-color="#409EFF" router>
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <img :src="user_pic" alt="" v-if="user_pic" />
            <img src="../../assets/images/logo.png" alt="" v-else />
            <span>个人中心</span>
          </template>
          <!-- 右侧个人中心顶栏 -->
          <el-menu-item index="/user-info"><i class="el-icon-s-operation"></i>基本资料</el-menu-item>
          <el-menu-item index="/user-avatar"><i class="el-icon-camera"></i>更换头像</el-menu-item>
          <el-menu-item index="/user-pwd"><i class="el-icon-key"></i>重置密码</el-menu-item>
        </el-submenu>
        <el-menu-item index="2" @click="quitFn"><i class="el-icon-switch-button"></i>退出</el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside width="200px">
        <!-- 左侧边栏的用户信息 -->
        <!--
          el-menu :导航菜单
          default-active: 当前激活的index(el-submenu/el-menu-item的index的值),对应菜单就有激活样式
          @open: sub-menu 展开的回调
          @close: sub-menu 关闭的回调
          active-text-color: 激活时的文字颜色,哪项index的值和default-active一致就会设置动态文字颜色
         -->
        <!-- 左侧栏用户信息 -->
        <div class="user-box">
          <img :src="user_pic" alt="" v-if="user_pic" />
          <img src="../../assets/images/logo.png" alt="" v-else />
          <span>欢迎 {{ nickname || username }}</span>
        </div>
        <!-- 左侧导航栏 菜单-->
        <el-menu :default-active="$route.path" class="el-menu-vertical-demo" background-color="#23262E" text-color="#fff" active-text-color="#409EFF" unique-opened router>
          <!-- template标签内的容器不会被渲染 -->
          <template v-for="item in menus">
            <!-- 不包含子菜单的一级菜单 -->
            <el-menu-item :index="item.indexPath" v-if="!item.children" :key="item.indexPath">
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </el-menu-item>

            <!-- 包含子菜单的一级菜单 -->
            <el-submenu :index="item.indexPath" v-else :key="item.indexPath">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="obj.indexPath" v-for="obj in item.children" :key="obj.indexPath">
                <i :class="obj.icon"></i>
                <span>{{ obj.title }}</span>
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 页面主体区域 -->
        <el-main> <router-view></router-view> </el-main>
        <!-- 底部 footer 区域 -->
        <el-footer>© www.itheima.com - 黑马程序员</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMenuListAPI } from '@/api'
export default {
  name: 'my-layout',
  data() {
    return {
      menus: []
    }
  },
  methods: {
    //  退出按钮点击事件
    quitFn() {
      this.$confirm('此操作将退出当前界面, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 清除vuex
          this.$store.commit('updateToken', '')
          this.$store.commit('updateUserInfo', {})
          // 强制跳转到登录页
          this.$router.push('/login')
          this.$message({
            type: 'success',
            message: '成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    //  获取左侧菜单
    async getMenuListFn() {
      const { data: res } = await getMenuListAPI()
      console.log(res)
      this.menus = res.data
    }
  },
  created() {
    // 侧边栏数据请求
    this.getMenuListFn()
  },
  computed: {
    ...mapGetters(['username', 'nickname', 'user_pic'])
  }
}
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;
  .el-header,
  .el-aside {
    background-color: #23262e;
    .el-submenu,
    .el-menu-item {
      width: 200px;
      user-select: none;
    }
  }
  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }
  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #f2f2f2;
  }
  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

// 左侧边栏用户信息区域
.user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }
  span {
    color: white;
    font-size: 12px;
  }
}
// 右侧用户信息区域
.el-menu-top {
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }
}
</style>
