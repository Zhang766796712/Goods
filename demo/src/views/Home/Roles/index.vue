<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--card 卡片 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-button type="primary" @click="OpenAdd"> 添加角色 </el-button>
      <!-- 表格 -->
      <el-table :data="RolesList" style="width: 100%" border>
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作" prop="doing">
          <template slot-scope="scope">
            <div>
              <el-button type="primary" @click="OpenEdit(scope.row)"
                >编辑</el-button
              >
              <el-button type="danger" @click="removeRole(scope.row)"
                >删除</el-button
              >
              <el-button type="info">分配权限</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 对话框 -->
      <el-dialog :title="title" :visible.sync="dialogVisible" width="50%">
        <!-- 表单 -->
        <el-form :model="roleform" label-width="80px">
          <el-form-item label="角色名称">
            <!-- disabled  禁用 -->
            <el-input
              v-model="roleform.roleName"
              :disabled="title == '编辑角色'"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="roleform.roleDesc"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm"
              v-show="title == '添加角色'"
              >添加</el-button
            >
            <el-button type="primary" v-show="title == '编辑角色'" @click="save"
              >保存修改</el-button
            >
            <el-button @click="dialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { GetRoles, Addrole, Edirrole,RemoveRole } from '@/http/api'
export default {
  data() {
    return {
      RolesList: [
        //角色列表数据
        {
          roleName: '', //角色名称
          roleDesc: '' //角色描述
        }
      ],
      title: '', // 弹出框的标题
      dialogVisible: false, // 添加用户控制模态框显示和隐藏
      roleform: [
        //添加角色数据
        {
          roleName: '',
          roleDesc: ''
        }
      ]
    }
  },
  methods: {
    // 获取角色列表
    async getroles() {
      const res = await GetRoles()
      // console.log(res)
      this.RolesList = res
    },
    //  添加 按钮
    OpenAdd() {
      this.title = '添加角色'
      this.dialogVisible = true
    },

    // 编辑按钮
    OpenEdit(row) {
      this.title = '编辑角色'
      this.roleform = row
      this.dialogVisible = true
    },
    // 添加角色数据
    async submitForm() {
      await Addrole(this.roleform)
      this.dialogVisible = false
      this.roleform.roleName = ''
      this.roleform.roleDesc = ''
      this.getroles()
    },
    // 保存修改角色数据
    async save() {
      await Edirrole(this.roleform)
      this.dialogVisible = false
      this.getroles()
    },
    // 删除
    async removeRole(row) {
      await RemoveRole(row.id)
      this.getroles()
    }
  },
  created() {
    // 调用获取角色列表
    this.getroles()
  },
  mounted() {},
  components: {},
  computed: {},
  watch: {}
}
</script>

<style lang="scss" scoped>
.el-row {
  margin: 10px 0;
}
.el-breadcrumb {
  margin-bottom: 10px;
}
</style>
