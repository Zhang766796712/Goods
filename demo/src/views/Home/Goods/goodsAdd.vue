<template>
  <div>
     <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 警告条 -->
      <el-alert
        title="消息提示的文案"
        type="info"
        center
        show-icon
        :closable="false"
      ></el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        align-center
        :active="activeName * 1"
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tabs导航栏 -->
      <el-form :model="addGoodsData" :rules="rules" ref="addGoodsData" label-width="100px">
        <el-tabs
          :before-leave="beforeLeave"
          tab-position="left"
          v-model="activeName"
          @tab-click="handleClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsData.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsData.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsData.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsData.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类"  prop="checkedArr">
              <!-- 级联选择器 -->
              <el-cascader
                v-model="checkedArr"
                :options="goodsCateList"
                :props="defaultProps"
              
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 动态参数 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyParams"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(item2, index) in item.attr_vals"
                  :key="index"
                  border
                  :label="item2"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 静态参数 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyParams"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              action="http://www.ysqorz.top:8888/api/private/v1/upload"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              :headers="headersConfig"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容 富文本编辑器 -->
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addGoodsData.goods_introduce"></quill-editor>
            <el-button class="addGoodsOk" type="primary" @click="addGoodsOk">
              添加商品
            </el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getGoodsCateList, getGoodsParams, addGoods } from '@/http/api'
export default {
  name: '',
  components: {},
  data() {
    return {
      // 配置上传图片请求头信息
      headersConfig: {
        Authorization: sessionStorage.getItem('token')
      },
      manyParams: [], //动态参数
      onlyParams: [], //静态参数
      activeName: '0', //tab栏index
      addGoodsData: {
        pics: []
      }, //添加商品表单对象
      goodsCateList: [], //商品分类数据
      checkedArr: [], //已选择分类id组成的数组
      defaultProps: {
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        value: 'cat_id'
      },
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
         checkedArr: [
          { required: true, message: '请输入分类商品', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 添加商品成功
    addGoodsOk() {
      // 处理商品分类数组转化为字符串
      this.addGoodsData.goods_cat = this.checkedArr.join(',')

      // 处理动态参数
      const manyAttrs = this.manyParams.map((item) => {
        return {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(',')
        }
      })
      // 处理静态参数
      const onlyAttrs = this.onlyParams.map((item) => {
        return {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        }
      })
      // 合并动静参数
      const mergeAttrs = [...manyAttrs, ...onlyAttrs]
      this.addGoodsData.attrs = mergeAttrs

      // console.log(this.addGoodsData)
      // 调接口添加到后台
      addGoods(this.addGoodsData).then((res) => {
        // console.log(res)
      })
      // 跳转到商品页面
      this.$router.push('/goods')
    },
    // 删除图片成功
    handleRemove(res) {
      // console.log(res)
    },
    // 上传图片成功
    handleSuccess(res) {
      this.addGoodsData.pics.push({ pic: res.data.tmp_path })
      // console.log(this.addGoodsData.pics)
    },
    // 获取商品分类数据
    async getGoodsCateList() {
      const res = await getGoodsCateList()
      // console.log(res)
      this.goodsCateList = res
    },
    // 导航栏跳转之前进行的操作
    beforeLeave(newActive, oldActive) {
      // 判断是否进行下一项
      if (oldActive === '0' && this.checkedArr.length !== 3) {
        this.$message({
          message: '请先选择商品分类',
          type: 'error'
        })
        return false
      }
    },
    // 获取存储动态和静态资源
    async handleClick() {
      // console.log(this.activeName)
      if (this.activeName === '1') {
        const res = await getGoodsParams(this.current_cate_id)
        res.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length > 0 ? item.attr_vals.split(',') : []
        })
        // console.log(res)
        this.manyParams = res
      } else if (this.activeName === '2') {
        const res = await getGoodsParams(this.current_cate_id, 'only')
        // console.log(res)
        this.onlyParams = res
      }
    }
  },
  computed: {
    // 获取选中的最后一项的id
    current_cate_id() {
      return this.checkedArr.at(-1)
    }
  },
  created() {
    // 调用商品分类数据
    this.getGoodsCateList()
  }
}
</script>
<style scoped lang="scss">
.el-form {
  margin-top: 16px;
}

::v-deep .ql-editor {
  height: 300px;
}
.addGoodsOk {
  margin-top: 20px;
}
::v-deep  .el-input__inner{
  width: 700px;
 margin: 10px 0 20px;
}
</style>
