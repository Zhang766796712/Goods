<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="page.query" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
      </el-row> 
      <!-- 表格 -->
      <el-table :data="GoodsList" border style="width: 100%">
        <el-table-column fixed type="index" label="#" width="80"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="240"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="130"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="130">
          <template slot-scope="scope">
            <el-tag v-show="scope.row.order_pay == '0'" type="danger">未付款</el-tag>
            <el-tag v-show="scope.row.order_pay == '1'" type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="130"></el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="300">
          <template slot-scope="scope">
            <p>{{ scope.row.create_time | filTime }}</p>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="primary" size="small" icon="el-icon-edit"></el-button>
            <el-button @click="location(scope.row)" type="success" size="small" icon="el-icon-location"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 修改地址 弹出框 -->
      <el-dialog title="修改地址" :visible.sync="dialogFormVisible1">
        <el-form :model="form" label-width="100px">
          <el-form-item label="省市区/县">
            <!-- 级联选择器 -->
            <el-cascader v-model="checkedArr" :options="city" :props="defaultProps"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible1 = false">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 物流进度 弹出框 -->
      <el-dialog title="物流进度" :visible.sync="dialogFormVisible2">
        <!-- Timeline 时间线 -->
        <el-timeline :reverse="false">
          <el-timeline-item v-for="(activity, index) in logistics" :key="index" :timestamp="activity.time">
            {{ activity.context }}
          </el-timeline-item>
        </el-timeline>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible2 = false">确 定</el-button>
        </div>
      </el-dialog>
      <!-- Pagination 分页 完整功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="page.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { OrdersListApi } from '@/http/api'
import logistics from '@/assets/js/logistics'
import city from '@/assets/js/city'
export default {
  data() {
    return {
      GoodsList: [],
      total: 0,
      page: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      form: {},
      city,
      logistics: logistics.data,
      checkedArr: [],
      defaultProps: {
        expandTrigger: 'hover',
        label: 'label',
        value: 'value',
        children: 'children'
      },
      dialogFormVisible1: false,
      dialogFormVisible2: false
    }
  },
  methods: {
    // 每页条数发生变化的时候触发
    handleSizeChange(val) {
      this.page.pagesize = val
      this.OrdersList()
    },
    // 页码变化的时候触发
    handleCurrentChange(val) {
      this.page.pagenum = val
      this.OrdersList()
    },
    // 搜索按钮
    search() {
      this.OrdersList()
    },
    // 编辑按钮
    edit() {
      this.dialogFormVisible1 = true
    },
    // 物流 地图按钮
    location() {
      this.dialogFormVisible2 = true
    },
    // 获取用户列表
    async OrdersList() {
      const res = await OrdersListApi(this.page)
      const { total, goods } = res
      this.GoodsList = goods
      this.total = total
    }
  },
  created() {
    this.OrdersList()
  },
  mounted() {},
  components: {},
  computed: {},
  watch: {}
}
</script>

<style lang="scss" scoped>
.el-cascader {
  width: 100%;
}
</style>
