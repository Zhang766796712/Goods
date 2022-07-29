<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加按钮 -->
      <el-button type="primary" @click="add">添加分类</el-button>
      <!-- 表格 -->
      <el-table :data="tableData" border style="width: 100%" row-key="cat_id">
        <el-table-column fixed label="#" type="index" width="150">
          <template slot-scope="scope">
            {{ scope.row.index }}
          </template>
        </el-table-column>
        <el-table-column prop="cat_name" label="分类名称" width="320"></el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效" width="320">
          <template slot-scope="scope">
            <div>
              <i v-if="!scope.row.cat_deleted" class="el-icon-success"></i>
              <i v-else class="el-icon-error"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序" width="220">
          <template slot-scope="scope">
            <el-tag v-show="scope.row.cat_level == '0'">一级</el-tag>
            <el-tag v-show="scope.row.cat_level == '1'" type="success">二级</el-tag>
            <el-tag v-show="scope.row.cat_level == '2'" type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" @click="edit(scope.row)" icon="el-icon-edit" size="small">编辑</el-button>
            <el-button type="danger" @click="del(scope.row)" icon="el-icon-delete" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加 Dialog 对话框 -->
      <el-dialog title="添加分类" :visible.sync="dialogFormVisible1">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="ruleForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!-- 级联选择器 -->
            <el-cascader v-model="checkedArr" :options="goodsCateList" :props="defaultProps"></el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="AddRuleForm">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑 Dialog 对话框 -->
      <el-dialog title="编辑分类" :visible.sync="dialogFormVisible2">
        <el-form :model="ruleForm" label-width="100px" :rules="rules" ref="ruleForm">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="ruleForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="EditRuleForm">确 定</el-button>
        </div>
      </el-dialog>
      <!-- Pagination 分页 完整功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pagenum"
        :page-sizes="[7, 10, 15, 20]"
        :page-size="page.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getGoodsCateList, CategoriesDelApi, EditClassification, addGoodsApi } from '@/http/api'
export default {
  data() {
    return {
      tableData: [], //商品分类数据
      total: 0, // 用户列表总条数
      page: {
        query: '', // 搜索的内容
        pagenum: 1, // 当前页码
        pagesize: 7 // 每页的条数
      },
      dialogFormVisible1: false, //添加
      dialogFormVisible2: false, //编辑
      //添加分类表单数据源
      ruleForm: {
        //分类名称
        cat_name: '',
        //分类父尖
        cat_pid: '',
        //分类级别
        cat_level: ''
      },
      rules: {
        cat_name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
      },
      defaultProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        children: 'children',
        value: 'cat_id',
        //实现任意级别的选择
        checkStrictly: true
      },
      goodsCateList: [], //商品分类数据
      checkedArr: [], //已选择分类id组成的数组
      id: '' //编辑id
    }
  },
  methods: {
    // 添加按钮
    add() {
      this.dialogFormVisible1 = true
    },
    //确定添加分类按钮
    async AddRuleForm() {
      if (this.checkedArr.length !== 0) {
        //pid 父id
        this.ruleForm.cat_pid = this.checkedArr[this.checkedArr.length - 1]
        //level 级别
        this.ruleForm.cat_level = this.checkedArr.length
      } else {
        this.ruleForm.cat_pid = 0
        //level 级别
        this.ruleForm.cat_level = 0
      }
      //调用添加分类接口
      await addGoodsApi(this.ruleForm)
      //隐藏对话框
      this.dialogFormVisible1 = false
      //刷新分类列表
      this.getGoodsCateList()
    },
    // 保存编辑提交分类
    async EditRuleForm() {
      await EditClassification(this.ruleForm, this.id)
      this.dialogFormVisible2 = false
      this.getGoodsCateList()
    },
    // 编辑按钮
    edit(row) {
      this.id = row.cat_id
      this.ruleForm.cat_name = row.cat_name
      this.dialogFormVisible2 = true
    },
    // 删除
    async del(row) {
      const res = await CategoriesDelApi(row.cat_id)
      this.getGoodsCateList()
    },
    // 获取分类接口
    async getGoodsCateList() {
      const res = await getGoodsCateList(this.page)
      const res1 = await getGoodsCateList()
      const { total, result } = res
      result.forEach((item, index) => {
        item.index = index + 1
      })
      this.tableData = result
      this.total = total
      this.goodsCateList = res1
    },
    // 每页条数发生变化的时候触发
    handleSizeChange(val) {
      this.page.pagesize = val
      this.getGoodsCateList()
    },
    // 页码变化的时候触发
    handleCurrentChange(val) {
      this.page.pagenum = val
      this.getGoodsCateList()
    }
  },
  created() {
    // 调用商品分类接口
    this.getGoodsCateList()
  },
  mounted() {},
  components: {},
  computed: {},
  watch: {}
}
</script>

<style lang="scss" scoped>
.el-icon-error {
  color: red;
}
.el-icon-success {
  color: #90ed94f0;
}
.el-cascader {
  width: 100%;
}
::v-deep .el-icon-arrow-right::before {
  content: '\2666' !important;
  font-size: 20px;
  color: #000;
}
</style>
