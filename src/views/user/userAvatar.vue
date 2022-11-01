<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <img class="the_img" v-if="!this.avatar" src="../../assets/images/avatar.jpg" alt="" />
      <img class="the_img" v-else :src="this.avatar" alt="" />

      <!-- 按钮区域 -->
      <div class="btn-box">
        <input type="file" accept="image/*" style="display: none" ref="iptRef" @change="onFileChange" />
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg">选择图片</el-button>
        <el-button type="success" icon="el-icon-upload" :disabled="avatar === ''" @click="uploadFn">上传头像</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { updateUserAvatarAPI } from '@/api'
export default {
  name: 'UserAvatar',
  data() {
    return {
      avatar: '' // 保存图片的base64字符串
    }
  },
  methods: {
    // 选择图片通过点击事件触发
    // 因为input[type=file]是原生标签不方便直接改样式(绑事件)
    // 于是通过在button上的点击事件来获取file相关DOM并通过JS代码来触发默认行为生成一个供于文件选择的窗口

    chooseImg() {
      this.$refs.iptRef.click()
    },
    // 确定要选择的图片
    onFileChange(e) {
      // 通过原生事件对象e来拿到用户选择的文件数组
      const files = e.target.files
      if (files.length === 0) {
      } else {
        // 选择了一张图片
        console.log(files[0])
        // 需求: 选择的图片文件要在<img>上做纯前端的预览
        // img的src值只能是图片的链接地址(外链htto://开头,图片文件相对路径)
        // 或是图片的base64字符串(后台要求字符串为data:imge/png;base64,图片转base64字符串)
        // 解决方法:通过URL.createObject()将File类型文件转化成一个Blob类型的一个临时的js内存地址(只能前端预览不能发给后台)
        // 通过FileReader对象里的readAsDataURL来读取选择的前端文件
        // this.avatar = URL.createObjectURL(files[0])
        // 创建文件对象
        const fr = new FileReader()
        // 读取传入文件对象
        fr.readAsDataURL(files[0])
        // fr的onload的监听函数,等待把文件读为base64字符串后触发并将读完的结果e.target.result给avatar变量让他显示在img里
        fr.onload = e => {
          this.avatar = e.target.result
        }
      }
    },
    // 用户上传头像
    async uploadFn() {
      const { data: res } = await updateUserAvatarAPI(this.avatar)
      console.log(res)
      if (res.code !== 0) return this.$message.error('更新头像失败')
      this.$message.success('更新头像成功')
      // 让action再次提出获取用户信息请求更新vuex的数据
      this.$store.dispatch('getUserInfoAction')
    }
  }
}
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
  margin-left: 40px;
}
.preview {
  object-fit: cover;
}
.the_img {
  width: 350px;
  height: 350px;
}
</style>
