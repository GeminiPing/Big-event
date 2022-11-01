<template>
  <!-- 注册页面的整体盒子 -->
  <div class="reg-container">
    <!-- 注册的盒子 -->
    <div class="reg-box">
      <!-- 标题的盒子 -->
      <div class="title-box"></div>
      <!-- 注册的表单区域 -->
      <el-form ref="registerRef" :model="registerForm" :rules="registerRules">
        <el-form-item prop="username">
          <el-input placeholder="请输入用户名" v-model="registerForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="registerForm.password"></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input type="password" placeholder="请再次确认密码" v-model="registerForm.repassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-reg" type="primary" @click="registerFn">注册</el-button>
          <el-link type="info" @click="$router.push('/login')">去登录</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { registerAPI } from '@/api'
export default {
  name: 'my-register',
  data() {
    // 定义一个确认密码校验函数这里必须摇在data下建立否则this.form对象无法使用
    const samePass = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        // 如果验证失败，则调用 回调函数时，指定一个 Error 对象。
        callback(new Error('两次输入的密码不一致!'))
      } else {
        // 如果验证成功，则直接调用 callback 回调函数即可。
        callback()
      }
    }

    return {
      registerForm: {
        // 表单数据对象
        username: '', // 用户名
        password: '', // 密码
        repassword: '' // 确认密码
      },
      // 表单规则对象
      registerRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{1,10}$/,
            message: '用户名必须是1到10个的大小写字母数字',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^\S{6,15}$/,
            message: '密码必须是6到15位的非空字符',
            trigger: 'blur'
          }
        ],
        repassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          {
            pattern: /^\S{6,15}$/,
            message: '密码必须是6到15位的非空字符',
            trigger: 'blur'
          },
          { validator: samePass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 注册新用户
    registerFn() {
      // js校验
      this.$refs.registerRef.validate(async valid => {
        if (valid) {
          // 通过校验并获取到绑定数据form
          console.log(this.registerForm)
          // 调用接口
          const { data: res } = await registerAPI(this.registerForm)
          console.log(res)
          // 注册失败并提示用户
          if (res.code !== 0) return this.$message.error(res.message)
          // 注册成功并提示用户
          this.$message.success(res.message)
          // 跳转到登录页
          this.$router.push('/login')
        } else {
          // 阻止默认提交行为
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.reg-container {
  background: url('../../assets/images/login_bg.jpg') center;
  background-size: cover;
  height: 100%;

  .reg-box {
    width: 400px;
    height: 335px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 30px;
    box-sizing: border-box;

    .title-box {
      height: 60px;
      background: url('../../assets/images/login_title.png') center no-repeat;
    }

    .btn-reg {
      width: 100%;
    }
  }
}
</style>
