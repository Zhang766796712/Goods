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
          <template slot-scope="scope">
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
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName"
          width="200"
        ></el-table-column>
        <el-table-column
          label="角色描述"
          prop="roleDesc"
          width="320"
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
              <el-button type="info" @click="emitRoles(scope.row.id)">
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
      <el-dialog title="提示" :visible.sync="dialogVisibleOk" width="50%">
        <!-- 树形控件 -->
        <el-tree
          :data="list"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          :props="defaultProps"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleOK = false">取 消</el-button>
          <el-button type="primary" @click="setRoles()">确 定</el-button>
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
  getRights
} from '@/http/api'
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
      id: '',
      list: [], // 树形控件数据
      title: '', // 弹出框的标题
      dialogVisible: false, // 添加用户控制模态框显示和隐藏
      dialogVisibleOK: false, //树形图对话框
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
      this.roleform = row
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
    // 分配权限按钮
    async emitRoles(id) {
      this.dialogVisibleOK = true
      await getRights(id)
      this.id = id
      console.log(res)
      this.list = res
      
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
