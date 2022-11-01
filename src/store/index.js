import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getUserInfoAPI } from '@/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用户信息对象 ("id","username","nickname","email","user_pic" )
    userInfo: {}, // 保存用户信息
    token: '' // 保存登录成功后得到的token字符串
  },
  getters: {
    username: state => {
      return state.userInfo.username // 用户名
    },
    nickname: state => {
      return state.userInfo.nickname // 用户昵称
    },
    user_pic: state => {
      return state.userInfo.user_pic // 用户头像
    }
  },

  mutations: {
    // 保存token
    updateToken(state, val) {
      state.token = val
    },
    // 保存用户信息
    updateUserInfo(state, val) {
      state.userInfo = val
    }
  },
  actions: {
    // 请求用户信息
    async getUserInfoAction(store) {
      const { data: res } = await getUserInfoAPI()
      console.log(res)
      if (res.code === 0) store.commit('updateUserInfo', res.data)
    }
  },
  modules: {},
  // 配置vuex持久化插件让token保存在本地里(vuex把token存在内存刷新即消失)
  plugins: [createPersistedState()]
})
