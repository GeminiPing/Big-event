// 封装具体的接口方法

import request from '@/utils/request'
// 导出接口方法为了之后的引用
/**
 * 注册接口
 * @param {*} param0 { username:用户名,password:密码,repassword:确认密码 }
 * @returns Promise
 */
export const registerAPI = ({ username, password, repassword }) => {
  return request({
    method: 'post',
    url: '/api/reg',
    data: {
      username,
      password,
      repassword
    }
    //  axios传参params，data，params的键值对
    // axios会把他们拼接到url?后面然后给后台（query查询字符串）
    // data会把他们拼接到请求体里（body参数）
  })
}
/**
 *  登录接口
 * @param {*} param0 { username: 用户名, password:密码}
 * @returns Promise对象
 */
export const loginAPI = ({ username, password }) => {
  return request({
    method: 'post',
    url: '/api/login',
    data: {
      username,
      password
    }
  })
}
/**
 * 获取用户信息
 * @returns Promis对像
 */
export const getUserInfoAPI = () => {
  return request({
    method: 'get',
    url: '/my/userinfo',
    headers: {
      // 传参给后台: params(查询字符串query)、data(请求体body)、headers(请求头)
      // 注意这里如果this.$store.state.token无效因为这里不是组件对象不能用this.$store
      // Authorization: store.state.token
    }
  })
}
/**
 * 获取侧边栏菜单数据
 * @returns Promise对像
 */
export const getMenuListAPI = () => {
  return request({
    method: 'get',
    url: '/my/menus'
    // headers: { Authorization: store.state.token }
  })
}
/**
 * 更新基本资料
 * @param {} param0 {id:id, username:username, nickname:nickname, email:email, user_pic:user_pic}
 * @returns Promise对象
 */
export const updateUserInfoAPI = ({ id, username, nickname, email, user_pic }) => {
  return request({
    method: 'put',
    url: '/my/userinfo',
    data: { id, username, nickname, email, user_pic }
  })
}
/**
 *更新用户头像
 * @param {*} avatar 头像图片base64字符串
 * @returns Promise
 */
export const updateUserAvatarAPI = avatar => {
  return request({
    method: 'patch',
    url: '/my/update/avatar',
    data: {
      avatar
    }
  })
}

/**
 * 修改密码
 * @param {*} param0  { old_pwd:旧密码,new_pwd:新密码,re_pwd:再次输入的密码 }
 * @returns  Promise对象
 */
export const updatePwdAPI = ({ old_pwd, new_pwd, re_pwd }) => {
  return request({
    method: 'patch',
    url: '/my/updatepwd',
    data: {
      old_pwd,
      new_pwd,
      re_pwd
    }
  })
}
/** 获取文章分类清单
 *
 * @returns Promise对象
 */
export const getArtCateListAPI = () => {
  return request({
    method: 'get',
    url: '/my/cate/list'
  })
}
/**
 * 增加文件分类
 * @param {*} param0  { cate_name: 文章分类名字 ,cate_alias:文章分类别名  }
 * @returns Promise对象
 */
export const addArtCateListAPI = ({ cate_name, cate_alias }) => {
  return request({
    method: 'post',
    url: '/my/cate/add',
    data: {
      cate_name,
      cate_alias
    }
  })
}
/**
 * 修改文章分类
 * @param {*} param0 { id: 文章分类id ,cate_name: 文章分类名字 ,cate_alias:文章分类别名  }
 * @returns Promise对像
 */
export const updateArtCateListAPI = ({ id, cate_alias, cate_name }) => {
  return request({
    method: 'put',
    url: '/my/cate/info',
    data: { id, cate_name, cate_alias }
  })
}
/**
 * 删除文章分类
 * @param {*} param0 { id: 文章id }
 * @returns Promise对象
 */
export const delArtCateListAPi = id => {
  return request({
    method: 'delete',
    url: '/my/cate/del',
    params: {
      id
    }
  })
}
/**
 * 发布文章
 * @param {*} fd FormData表单数据对象
 * @returns Promise对象
 */
export const uploadArticleAPI = fd => {
  return request({
    method: 'post',
    url: '/my/article/add',
    data: fd
    //  如果请求体里是一个普通对象,axios会把它转化为json字符串再交给后台
    //  要求: 请求体里是个FormData类型(表单数据对象)携带文件给后台
  })
}

/**
 * 获取文章列表
 * @param {*} param0 { pagenum:'当前页码数' ,pagesize:'当前页条数' ,cate_id:'文章分类id' ,state:'文章状态'   }
 * @returns Promise对象
 */
export const getArticleListAPI = ({ pagenum, pagesize, cate_id, state }) => {
  return request({
    method: 'get',
    url: '/my/article/list',
    params: { pagenum, pagesize, cate_id, state }
  })
}

/**
 * 获取文章详情
 * @param {*} id 文章id
 * @returns Promise对象
 */
export const getArtDetailAPI = id => {
  return request({
    method: 'get',
    url: '/my/article/info',
    params: { id }
  })
}

/**
 * 删除文章
 * @param {*} id 文章id
 * @returns Promise对象
 */
export const delArtListAPI = id => {
  return request({
    method: 'delete',
    url: '/my/article/info',
    params: { id }
  })
}
