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
      <el-button type="primary" @click="OpenAdd" class="OpenAdd">
        添加角色
      </el-button>
      <!-- 表格 -->
      <el-table :data="RolesList" style="width: 100%" border>
        <el-table-column type="expand">
          <!--  -->
          <template slot-scope="scope">
            <div v-if="scope.row.children.length > 0">
              <div
                class="_role_detail"
                v-for="item in scope.row.children"
                :key="item.id"
              >
                <div class="_role_detail_first">
                  <el-tag
                    :disable-transitions="false"
                    closable
                    @close="delrights(scope.row.id, item.id)"
                  >
                    {{ item.authName }}
                  </el-tag>
                </div>
                <div class="_role_detail_second">
                  <div
                    class="_role_son"
                    v-for="val in item.children"
                    :key="val.id"
                  >
                    <div class="_role_son_first">
                      <el-tag
                        type="success"
                        :disable-transitions="false"
                        closable
                        @close="delrights(scope.row.id, val.id)"
                      >
                        {{ val.authName }}
                      </el-tag>
                    </div>
                    <div
                      class="_role_son_second"
                      v-for="arr in val.children"
                      :key="arr.id"
                    >
                      <el-tag
                        type="warning"
                        :disable-transitions="false"
                        closable
                        @close="delrights(scope.row.id, arr.id)"
                      >
                        {{ arr.authName }}
                      </el-tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 否则显示该角色暂无权限 -->
            <div v-else>该角色暂无权限</div>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="100"></el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName"
          width="300"
        ></el-table-column>
        <el-table-column
          label="角色描述"
          prop="roleDesc"
          width="500"
        ></el-table-column>
        <el-table-column label="操作" prop="doing" width="300">
          <template slot-scope="scope">
            <div>
              <el-button type="primary" @click="OpenEdit(scope.row)">
                编辑
              </el-button>
              <el-button type="danger" @click="removeRole(scope.row)">
                删除
              </el-button>
              <el-button type="success" @click="AssignRole(scope.row)">
                分配权限
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加 编辑对话框 -->
      <el-dialog :title="title" :visible.sync="dialogVisible" width="50%">
        <!-- 验证表单 -->
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input
              v-model="ruleForm.roleName"
              :disabled="title == '编辑角色'"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="ruleForm.roleDesc"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm"
              v-show="title == '添加角色'"
            >
              添加
            </el-button>
            <el-button
              type="primary"
              v-show="title == '编辑角色'"
              @click="save"
            >
              保存修改
            </el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 树形图对话框  -->
      <el-dialog title="提示" :visible.sync="dialogVisible1" width="50%">
        <!-- 树形控件 -->
        <el-tree
          ref="RightTreeRef"
          :data="TreeArr"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="checkedArr"
          :props="defaultProps"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="setRoles">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  GetRoles,
  Addrole,
  Edirrole,
  RemoveRole,
  RemoveRights,
  getRights,
  changeRoles
} from '@/http/api'
export default {
  data() {
    return {
      RoleId: '', //当前角色id
      TreeArr: [], //tree数据源
      checkedArr: [], //默认选中项组成的数组
      title: '', // 弹出框的标题
      dialogVisible: false, // 添加用户控制模态框显示和隐藏
      dialogVisible1: false, //树形图对话框
      defaultProps: {
        //tree默认配置项
        label: 'authName',
        children: 'children'
      },
      RolesList: [
        //角色列表数据
        {
          roleName: '', //角色名称
          roleDesc: '' //角色描述
        }
      ],
      ruleForm: {
        //添加角色数据
        roleName: '',
        roleDesc: ''
      },
      rules: {
        // 校验验证
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 10,
            max: 50,
            message: '长度在 10 到 50 个字符',
            trigger: 'blur'
          }
        ]
      }
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
      this.ruleForm = row
      this.dialogVisible = true
    },
    // 添加角色数据
    async submitForm() {
      await Addrole(this.ruleForm)
      this.dialogVisible = false
      this.ruleForm.roleName = ''
      this.ruleForm.roleDesc = ''
      this.getroles()
    },
    // 保存修改角色数据
    async save() {
      await Edirrole(this.ruleForm)
      this.dialogVisible = false
      this.getroles()
    },
    // 删除
    async removeRole(row) {
      await RemoveRole(row.id)
      this.getroles()
    },
    // 获取 删除角色指定权限
    async delrights(id, tid) {
      // console.log(id, tid);
      await RemoveRights({ id, tid })
      this.getroles()
    },
    //打开分配权限对话框 按钮
    async AssignRole(row) {
      //获取当前角色id
      this.RoleId = row.id
      //调用树形权限接口
      const res = await getRights('tree')
      this.TreeArr = res
      //调用递归函数获取当前角色所有的权限id组成的数组
      this.getCurrentRoleRightsArr(row, this.checkedArr)
      //显示对话框
      this.dialogVisible1 = true
    },
    //递归函数获取当前角色所有的权限方法
    getCurrentRoleRightsArr(row, checkedArr) {
      //没有下一级，则直接将id 添加到checkArr中
      if (!row.children) {
        return checkedArr.push(row.id)
      }
      //有children代表有下一级权限，则再递归调用自己
      row.children.forEach((item) => {
        this.getCurrentRoleRightsArr(item, checkedArr)
      })
    },
    //向后台更新当前角色最新权限
    async setRoles() {
      //1.如何获取当前角色id
      console.log('当前角色id：', this.RoleId)
      //2.如何获取当前角色所有权限id组成的字符串
      //第一步：获取全选状态id数组
      const arr1 = this.$refs.RightTreeRef.getCheckedKeys()
      //第二步：获取半选状态id数组
      const arr2 = this.$refs.RightTreeRef.getHalfCheckedKeys()
      console.log('半选状态id数组:', arr2)
      //合并全选和半选字符串
      const arr3 = [...arr1, ...arr2].join(',')
      console.log('全选+半选字符串:', arr3)
      //3.调用更新权限接口更新
      await changeRoles(this.RoleId, arr3)
      this.dialogVisible1 = false
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
.OpenAdd {
  margin-bottom: 10px;
}
._role_detail {
  display: flex;
  margin-top: 5px;
  ._role_detail_second {
    margin-left: 80px;
    margin-top: 5px;
    display: flex;
    flex-direction: column;

    ._role_son {
      display: flex;
      margin-top: 5px;
      ._role_son_second {
        display: flex;
        flex-wrap: wrap;
      }
    }
  }
}
.el-tag {
  margin-left: 10px;
}
</style>
