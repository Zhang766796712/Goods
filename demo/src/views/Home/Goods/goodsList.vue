<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
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
          <el-button type="primary" @click="openAdd">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="goods" border style="width: 100%">
        <el-table-column
          fixed
          type="index"
          label="#"
          width="70"
        ></el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          width="550"
        ></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="130"
        ></el-table-column>
        <el-table-column
          prop="goods_number"
          label="商品数量"
          width="130"
        ></el-table-column>
         <el-table-column prop="add_time" label="创建时间" width="200">
          <template slot-scope="scope">
            <!-- | 叫做管道符   | 后面是过滤器的名称 -->
            <p>{{ scope.row.add_time | filTime }}</p>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="edit(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="del(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑 Dialog 对话框-->
      <el-dialog title="编辑商品" :visible.sync="dialogFormVisible">
      <!-- 编辑 表单 -->
        <el-form :model="form" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDialog">
            确 定
          </el-button>
        </div>
      </el-dialog>
      <!-- Pagination 分页 完整功能-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pagenum"
        :page-sizes="[5, 20, 30, 40]"
        :page-size="page.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getGoods, GoodsDelapi,GoodsEditapi } from '@/http/api'
export default {
  data() {
    return {
      dialogFormVisible: false, //编辑 Dialog 对话框
      goods: [], //商品列表数据
      total: 0, // 用户列表总条数
      page: {
        query: '', // 搜索的内容
        pagenum: 1, // 当前页码
        pagesize: 5 // 每页的条数
      },
      form: {//编辑 表单
        goods_weight:'',
        goods_price:'',
        goods_name:'',
        goods_number:''
      }
    }
  },
  methods: {
    // 添加按钮
    openAdd() {
      this.$router.push('/add')
    },
    // 搜索按钮
    search() {
      this.getGoods() // 调用获取用户列表
    },
    // 编辑按钮
    edit(row) {
      this.dialogFormVisible = true
      this.form = row
    },
    // 删除按钮  删除商品
    async del(row) {
      // console.log(row.goods_id);
      const res = await GoodsDelapi(row.goods_id)
      this.getGoods()
    },
    // 编辑确定按钮   没有完成 "商品ID必须是数字"
    async editDialog() {
      await GoodsEditapi(this.form)
      this.dialogFormVisible = false 
      this.getGoods() 
    },
    // 每页条数发生变化的时候触发
    handleSizeChange(val) {
      this.page.pagesize = val
      this.getGoods()
    },
    // 页码变化的时候触发
    handleCurrentChange(val) {
      this.page.pagenum = val
      this.getGoods()
    },
    // 获取商品列表数据
    async getGoods() {
      const res = await getGoods(this.page)
      const { total, goods } = res
      this.goods = goods
      this.total = total
      // console.log(res)
    }
  },
  created() {
    // 调用获取用户列表
    this.getGoods()
  },
  mounted() {},
  components: {},
  computed: {},
  watch: {}
}
</script>

<style lang="scss" scoped></style>
