<template>
  <div class="home">
    <!-- Container 布局容器 -->
    <el-container>
      <!-- 头部 -->
      <el-header>
        <!-- Layout 布局 -->
        <el-row :gutter="24">
          <el-col :span="8">公司LOGO</el-col>
          <el-col :span="13">企业后台管理系统</el-col>
          <el-col :span="3"
            ><el-button type="info" @click="quit">退出</el-button></el-col
          >
        </el-row>
      </el-header>
      <el-container>
        <el-aside :width="isCollapse ? '65px' : '200px'">
          <p @click="isCollapse = !isCollapse" style="color: #fff">
            <i :class="{ active: isCollapse }" class="el-icon-s-operation"></i>
            <!-- {{$route.path}} -->
          </p>
          <!-- 左侧导航 -->
          <!-- :default-active="$route.path -->
          <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#f00"
            :collapse="isCollapse"
            router
          >
            <el-submenu :index="item.path" v-for="item in menus" :key="item.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item-group>
                <!-- 二级导航 -->
                <el-menu-item
                  :index="ele.path"
                  v-for="ele in item.children"
                  :key="ele.id"
                  >{{ ele.authName }}</el-menu-item
                >
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 内容区域 -->
        <el-main>
          <!-- home 坑 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { Menusapi } from '@/http/api'
export default {
  name: 'home',
  data() {
    return {
      menus: [], // 左侧菜单数据
      isCollapse: false // 控制侧边导航展开和收起的  true收起  false 展开
    }
  },
  methods: {
    quit() {
      // 清除本地临时数据  setItem
      sessionStorage.removeItem('token')
      // 跳转到登录页面
      this.$router.push({ path: '/login' })
    },
    async getMenus() {
      const res = await Menusapi()
      this.menus = res
      // console.log(res)
    }
  },
  created() {
    this.getMenus()
  },
  components: {}
}
</script>
<style lang="scss" scoped>
.el-header {
  background-color: #000;
  color: #fff;
  line-height: 60px;
}

.el-aside {
  background-color: #545c64;
  color: #333;
  text-align: center;
  height: calc(100vh - 60px);
  transition: all 0.5s;
  p {
    .active {
      transform: rotate(-90deg);
    }
  }
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}
.el-menu {
  border-right: none;
}
</style>
