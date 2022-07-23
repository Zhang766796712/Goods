// 主要是对axios进行二次封装
import axios from 'axios'
import envConfig from './env'
import { Message } from 'element-ui'

const service = axios.create({
  // 配置基准地址
  baseURL: envConfig.prod.baseURL,
  // 配置超时时间
  timeout: 5000
})

// 创建请求拦截
// service.interceptors.request.use(成功请求函数,失败请求函数)
service.interceptors.request.use(
  (config) => {
    // 应该先配置loding.token

    // 如果不是登录接口 需要配置请求头，添加token
    if (config.url !== '/login') {
      const token = sessionStorage.getItem('token')
      token && (config.headers.Authorization = token)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 创建响应拦截
service.interceptors.response.use(
  (res) => {
    // console.log(res)
    // 解构res.data
    const {
      meta: { msg, status: code },
      data: result
    } = res.data
    // console.log(msg);
    // console.log(code);
    // console.log(result);

    // 讲项目中可能返回的状态码 存放到一个数组
    const successArr = [200, 201, 204]
    // 判断res返回的状态码是否在数组中，如果在的话 就提示成功 并返回结果
    if (successArr.includes(code)) {
      Message({
        message: msg,
        type: 'success'
      })
      //   如果登录成功将返回的token保存到本地
      if (res.config.url === '/login') {
        sessionStorage.setItem('token', result.token)
      }
      // 返回成功后的数据
      return result
    }
    //错误消息
    Message({
      message: msg,
      type: 'error'
    })
    
    if (msg === '无效token') {
      router.replace('/login')
    }
    return Promise.reject(msg)
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default service
