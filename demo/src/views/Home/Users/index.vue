<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索框  按钮 -->
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="page.query"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="open">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="users" border style="width: 100%">
        <el-table-column type="index" label="#" width="70"></el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="role_name"
          label="角色"
          width="120"
        ></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="120">
          <template slot-scope="scope">
            <!-- switch 开关 -->
            <el-switch v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="edit(item)"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="del"
            ></el-button>
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="AssignRoles"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--  -->
      <!-- 对话框 -->
      <el-dialog :title="title" :visible.sync="dialogVisible" width="50%">
        <!-- 带验证的表单 -->
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <!-- disabled  禁用 -->
            <el-input
              v-model="ruleForm.username"
              :disabled="title == '编辑用户'"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="密码"
            prop="password"
            v-show="title == '添加用户'"
          >
            <el-input v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="ruleForm.mobile"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              v-show="title == '添加用户'"
              @click="submitForm()"
              >添加</el-button
            >
            <el-button type="primary" v-show="title == '编辑用户'" @click="save"
              >保存修改</el-button
            >
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- Pagination 分页 完整功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="page.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { Usersapi, AddUsersapi, UsersDeitapi, UsersDelapi } from '@/http/api'
export default {
  name: 'users',
  data() {
    //编写邮箱验证规则函数
    const checkEmail = (rule, value, callback) => {
      //1.编写邮箱正则
      const reg = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      //2.如果不满足规则，报错提示
      if (!reg.test(value)) {
        //报错提示
        return callback(
          new Error('您的邮箱格式不正确，邮箱格式应该为xxxxx@xxx.com')
        )
      }
      //3.满足规则放行！
      callback()
    }
    //编写手机号验证规则
    const checkMobile = (rule, value, callback) => {
      //1.编写手机正则，第1位必须是1,第二位可以是3或5或6或8，第三位到第11位不限制  \d代表数字
      const reg = /^1[3568]\d{9}$/
      //2.如果不满足规则，报错提示
      if (!reg.test(value)) {
        //报错提示
        return callback(
          new Error('您的手机号式不正确，手机号格式格式：13xxxxxxxxxx')
        )
      }
      //3.满足规则放行！
      callback()
    }
    return {
      users: [], // 用户列表
      total: 0, // 用户列表总条数
      editId: '', // 编辑的id
      title: '', // 弹出框的标题
      page: {
        query: '', // 搜索的内容
        pagenum: 1, // 当前页码
        pagesize: 5 // 每页的条数
      },
      dialogVisible: false, // 控制模态框显示和隐藏
      ruleForm: {
        username: '', // 用户名
        password: '', // 密码
        email: '', // 邮箱
        mobile: '' // 电话
      },
      rules: {
        // 校验验证
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取用户列表
    async getUsers() {
      const res = await Usersapi(this.page)
      const { total, users } = res
      this.users = users
      this.total = total
      // console.log(res)
    },
    // 每页条数发生变化的时候触发
    handleSizeChange(val) {
      this.page.pagesize = val
      this.getUsers() // 调用获取用户列表
    },
    // 页码变化的时候触发
    handleCurrentChange(val) {
      this.page.pagenum = val
      this.getUsers() // 调用获取用户列表
    },
    // 点击添加按钮
    open() {
      this.dialogVisible = true // 显示弹出框
      this.title = '添加用户'
    },
    // 搜索按钮
    search() {
      this.getUsers() // 调用获取用户列表
    },
    // 提交表单验证
    submitForm() {
      //验证输入是否合法
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return false
        //调添加新用户接口
        const res = await AddUsersapi(this.ruleForm)
        // console.log('添加用户的结果：', res)
        this.dialogVisible = false // 关闭模态框
        this.getUsers() // 获取用户列表
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 编辑按钮
    edit(item) {
      this.dialogVisible = true // 显示弹出框
      this.title = '编辑用户'
      // 数据回填
    },
    // 编辑保存修改
    save() {
      this.dialogVisible = false // 关闭弹出框
      this.getUsers() //调用获取用户列表函数
    },
    // 删除单个用户
    del() {},
    // 分配角色
    AssignRoles(){

    }
  },
  created() {
    // 调用获取用户列表
    this.getUsers()
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
</style>
