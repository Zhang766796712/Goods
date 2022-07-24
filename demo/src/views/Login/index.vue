<template>
  <div class="login">
    <div class="login_box">
      <h2 class="title">后台管理系统</h2>
      <el-form
        ref="LoginFormRef"
        :model="LoginForm"
        :rules="LoginFormRules"
        label-width="60px"
      >
        <el-form-item label="用户" prop="username">
          <el-input
            v-model="LoginForm.username"
            type="text"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            show-password
            v-model="LoginForm.password"
            type="password"
             prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item class="login-btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Loginapi } from '@/http/api'
export default {
  name: 'login',
  data() {
    return {
      LoginForm: {
        username: 'admin',
        password: '123456'
      },
      //   表单验证规则
      LoginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }, //判断是否为空
          { min: 5, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs.LoginFormRef.validate(async (valid) => {
        if (!valid) return false
        const res = await Loginapi(this.LoginForm)
        // 登录成功跳转
        this.$router.push('/')
      })
    }
  },
  created() {},
  mounted() {},
  components: {},
  computed: {},
  watch: {}
}
</script>

<style scoped lang="scss">
// 导入水平垂直居中样式
@import '@/style/mixin.scss';

.login {
  background-color: rgb(40, 169, 220);
  width: 100%;
  height: 100%;

  .login_box {
    border-radius: 8px;
    width: 40%;
    min-width: 400px;
    height: 350px;
    background-color: #fff;
    @include v-h-center;
    padding: 0 30px;
    box-sizing: border-box;

    .title {
      text-align: center;
    }
  }
}

.el-form {
  margin-top: 36px;
}

.login-btn {
  display: flex;
  justify-content: center;
}
</style>
