<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>重置密码</span>
    </div>
    <!-- 表单 -->
    <el-form :model="pwdForm" :rules="pwdFormRules" ref="pwdFormRef" label-width="100px">
      <el-form-item label="原密码" prop="old_pwd">
        <el-input v-model="pwdForm.old_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input v-model="pwdForm.new_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="re_pwd">
        <el-input v-model="pwdForm.re_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updatePwdFn">修改密码</el-button>
        <el-button ref="resetRef" @click="resetFn">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { updatePwdAPI } from '@/api'
export default {
  name: 'UserPwd',
  data() {
    // 新密码和旧密码不能相同
    const samePwd = (rule, value, callback) => {
      if (this.pwdForm.old_pwd === value) {
        callback(new Error('新旧密码不能相同'))
      } else {
        callback()
      }
    }
    // 确认密密码于新密码要一致
    const rePwd = (rule, value, callback) => {
      if (this.pwdForm.new_pwd !== value) {
        callback(new Error('两次密码输入不相同'))
      } else {
        callback()
      }
    }
    return {
      // 表单的数据对象
      pwdForm: {
        old_pwd: '',
        new_pwd: '',
        re_pwd: ''
      },
      // 表单的验证规则对象
      pwdFormRules: {
        old_pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码长度必须是6-15位的非空字符串', trigger: 'blur' }
        ],
        new_pwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码长度必须是6-15位的非空字符串', trigger: 'blur' },
          { validator: samePwd, trigger: 'blur' }
        ],
        re_pwd: [
          { required: true, message: '请再次确认新密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码长度必须是6-15位的非空字符串', trigger: 'blur' },
          { validator: rePwd, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置密码
    resetFn() {
      this.$refs.resetRef.resetFields()
    },
    // 修改密码
    updatePwdFn() {
      this.$refs.pwdFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await updatePwdAPI(this.pwdForm)
        console.log(res)
        if (res.code !== 0) return this.$message.error('修改密码失败')
        this.$message.success('修改密码成功')
        // 修改后重置
        this.$refs.pwdFormRef.resetFields()
        // 清除vuex
        this.$store.commit('updateToken', '')
        this.$store.commit('updateUserInfo', {})
        // 强制跳转到登录页
        this.$router.push('login')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-form {
  width: 500px;
}
</style>
