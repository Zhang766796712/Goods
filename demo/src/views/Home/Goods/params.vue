<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 警告条 -->
      <el-alert
        title="注意:只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
      ></el-alert>
      <!-- 选择商品分类： -->
      <el-row>
        <el-col :span="4">
          <h2>选择商品分类：</h2>
        </el-col>
        <el-col :span="8">
          <!-- 级联选择器 -->
          <el-cascader
            v-model="checkedArr"
            :options="goodsCateList"
            :props="defaultProps"
              @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!--  -->
      <!-- tabs导航栏 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 按钮 -->
          <el-button
            class="but"
            :disabled="isdisabled"
            type="primary"
            size="small"
            @click="dialogFormVisible1 = true"
          >
            添加参数
          </el-button>
          <!-- 表格 -->
          <el-table :data="manyParams" border>
            <el-table-column type="expand" width="150">
              <template slot-scope="scope">
                <div>
                  <el-tag
                    :key="index"
                    v-for="(item, index) in scope.row.attr_vals"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)"
                  >
                    {{ item }}
                  </el-tag>
                  <el-input
                    class="input-new-tag input"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  ></el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                  >
                    + New Tag
                  </el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="#"
              type="index"
              width="150"
            ></el-table-column>
            <el-table-column
              width="550"
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column fixed="right" label="操作" width="300">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  @click="edit(scope.row)"
                  icon="el-icon-edit"
                  size="small"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  @click="del(scope.row)"
                  icon="el-icon-delete"
                  size="small"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 按钮 -->
          <el-button
            class="but"
            :disabled="isdisabled"
            type="primary"
            size="small"
          >
            添加属性
          </el-button>
            <!-- 表格 -->
          <el-table :data="manyParams" border>
            <el-table-column type="expand" width="150">
              <template slot-scope="scope">
                <div>
                  <el-tag
                    :key="index"
                    v-for="(item, index) in scope.row.attr_vals"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)"
                  >
                    {{ item }}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  ></el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                  >
                    + New Tag
                  </el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="#"
              type="index"
              width="150"
            ></el-table-column>
            <el-table-column
              width="550"
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column fixed="right" label="操作" width="300">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  @click="edit(scope.row)"
                  icon="el-icon-edit"
                  size="small"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  @click="del(scope.row)"
                  icon="el-icon-delete"
                  size="small"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- dialog对话框 -->
      <el-dialog title="添加动态参数" :visible.sync="dialogFormVisible1">
        <el-form :model="form">
          <el-form-item label="活动名称">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">
            确 定
          </el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getGoodsCateList, getGoodsParams, editParams } from '@/http/api'
export default {
  data() {
    return {
      //是否显示隐藏输入框
      inputVisible: false,
      //要添加的参数值
      inputValue: '',
      manyParams: [], //动态参数
      activeName: 'many', //tab导航栏默认选中状态
      checkedArr: [], //级联框选中的id数组
      goodsCateList: [], //级联框的数据源
      // 级联框配置项
      defaultProps: {
        label: 'cat_name',
        children: 'children',
        value: 'cat_id',
        expandTrigger: 'hover'
      },
      tableData: [
        {
          name: ''
        }
      ],
      dialogFormVisible1: false,//动态参数
      dialogFormVisible2: false,//静态参数
      form: {}
    }
  },
  methods: {
    // 编辑按钮
    edit() {},
    //  删除按钮
    del() {},
    handleClose() {},
    //点击按钮显示输入框方法
    showInput(row) {
      row.inputVisible = true
      //等待dom加载更新完成时才对dom进行操作
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    //敲回车或失去焦点时触发
    async handleInputConfirm(row) {
      const inputValue = row.inputValue
      if (inputValue.trim().length > 0) {
        row.attr_vals.push(inputValue)
        //调更新参数接口
        await editParams(this.current_cate_id, row.attr_id, {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals:
            this.activeName === 'many' ? row.attr_vals.join(',') : row.attr_vals
        })
      }
      row.inputVisible = false
      row.inputValue = ''
    },

    // 获取参数列表的方法
    async getGoodsParamsList() {
      //判断选择的分类是否够三级，不够显示报错提示
      if (this.checkedArr.length !== 3) {
        this.$message({
          type: 'error',
          message: '您选择的级别不够三级，请重新选择'
        })
        this.checkedArr = []
        return false
      }
      // 调取分类参数接口列表数据
      if (this.activeName === 'many') {
        const res = await getGoodsParams(this.current_cate_id)
        res.forEach((item) => {
          // console.log(item)
          item.inputVisible = false
          item.inputValue = ''
          item.attr_vals =
            item.attr_vals.length > 0 ? item.attr_vals.split(',') : []
        })
        // console.log('获取到参数列表：' , res)
        this.manyParams = res
      } else if (this.activeName === 'only') {
        const res = await getGoodsParams(this.current_cate_id, this.activeName)
        // console.log('静态属性：' ,res)
      }
    },

    // 级联框选中操作
    handleChange() {
      this.getGoodsParamsList()
    },
    // tabs导航栏点击触发
    handleClick() {
      this.getGoodsParamsList()
    },
    // 获取商品分类数据源
    async getGoodsCateList() {
      const res = await getGoodsCateList()
      this.goodsCateList = res
    }
  },
  created() {
    // 调用分类接口
    this.getGoodsCateList()
  },
  mounted() {},
  components: {},
  computed: {
    // 获取当前分类
    current_cate_id() {
      return this.checkedArr.at(-1)
    },
    // 判断选择分类级别是否够3级
    isdisabled() {
      return this.checkedArr.length !== 3
    }
  },
  watch: {}
}
</script>

<style lang="scss" scoped>
.el-row {
  display: flex;
  align-items: center;
}
.el-cascader {
  width: 540px;
}
.but {
  margin: 0 0 15px;
}
.el-tag {
  margin: 6px 12px;
}

.input {
  width: 80px;
}
</style>
