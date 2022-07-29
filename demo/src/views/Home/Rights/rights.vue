<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" width="200"></el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称"
          width="200"
        ></el-table-column>
        <el-table-column prop="path" label="路径" width="520"></el-table-column>
        <el-table-column prop="level" label="权限等级" width="300">
          <template slot-scope="scope">
            <el-tag v-show="scope.row.level == '0'">一级</el-tag>
            <el-tag v-show="scope.row.level == '1'" type="success">二级</el-tag>
            <el-tag v-show="scope.row.level == '2'" type="info">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsapi } from '@/http/api'
export default {
  data() {
    return {
       tableData: []
    }
  },
  methods: {
     // 获取权限列表数据
    async getRights() {
      const res = await getRightsapi()
      // console.log(res)
      this.tableData = res
    },
  },
  created() {
    this.getRights()
  },
  mounted() {},
  components: {},
  computed: {},
  watch: {}
}
</script>

<style lang="scss" scoped></style>
