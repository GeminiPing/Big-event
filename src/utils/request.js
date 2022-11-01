// 基于axios自定义封装网络请求函数
import axios from 'axios'
import store from '@/store'
import router from '../router'
import { Message } from 'element-ui'
// 接口和图片资源所在的服务器地址
export const baseURL = 'http://big-event-vue-api-t.itheima.net'
const myAxios = axios.create({
  baseURL: baseURL,
  timeout: 0,
  headers: {}
})

// 定义请求拦截器
// api里每次调用request都会先走这个请求拦截器
myAxios.interceptors.request.use(
  // 成功的回调
  function (config) {
    // config配置对象(要请求后台的参数都在这个对象上)
    // 在请求时会触发一次,这个return交给axios源码内,根据配置项发起请求
    // 在发起时,统一携带请求头Authorization和token值
    // 在登录页面和注册页面vuex里无token而且登录接口和注册接口也不需要携带token其他界面需要
    if (store.state.token) {
      config.headers.Authorization = store.state.token
    }
    return config
  },
  // 失败的回调
  function (error) {
    // 返回一个拒绝状态的Promise对像(axios留在原地的Primise对象状态就为失败结果为error变量值)
    // return非Promise对象值,会作为成功的结果,返回个下一个Promise对象(axios留在原地)
    // returnPromise对象，这个Promise对象状态返回个下一个Promise对象
    // Promise.reject()原地留下一个新的Promise对象(状态为失败)它是Promise的类方法reject()

    return Promise.reject(error)
    // 等同于
    /**
     * return new Promise((resolve,reject)=>{
     * reject(error)
     * })
     */
  }
)

// 定义响应拦截器
myAxios.interceptors.response.use(
  function (response) {
    // 响应状态码为 2xx或3xx 时触发成功的回调，形参中的 response 是“成功的结果”
    // return到axios原地Promise对象作为成功的结果
    return response
  },
  function (error) {
    console.log(error)
    console.dir(error)
    // 本次响应是token过期
    if (error.response.status === 401) {
      store.commit('updateToken', '')
      store.commit('updateUserInfo', {})
      router.push('/login')
      Message.error('用户身份已过期')
    }
    // 响应状态码是 4xx或5xx 时触发失败的回调，形参中的 error 是“失败的结果”
    // return到axios原地Promise对象作为失败拒绝的状态(如果使用try+catch或者catch函数捕获,可以获得传递的error变量值)
    return Promise.reject(error)
  }
)
export default myAxios
