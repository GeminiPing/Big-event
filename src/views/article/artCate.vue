<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="addCateShowDialogFn">添加分类</el-button>
      </div>
      <!-- 分类数据表格 -->
      <el-table style="width: 100%" border stripe :data="cateList">
        <!-- tyep为table-column的属性当值为index时则显示改该行索引并从1开始 -->
        <el-table-column type="index" label="序号" width="100"></el-table-column>
        <el-table-column prop="cate_name" label="分类名称"></el-table-column>
        <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
        <el-table-column label="操作">
          <!-- scope对象: { row: 行对象 } -->
          <!-- 通过作用域插槽获取对象 -->
          <template v-slot="scope"
            ><el-button type="primary" size="mini" @click="updateCateBtnFn(scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="delCateFn(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加文章分类对话框  el-dialog对话框组件 title:框左上标题 visible:控制对话框是否显示(true显示)-->
    <!-- before-close: 对话框关闭前的回调可以用done()关闭,不调用则阻止关闭 -->
    <!-- .sync类似v-model可以实现子组件的双向绑定 -->
    <!-- v-model本质:给所在标签绑定:value="Vue变量" @input="val=>Vue变量=val" -->
    <!-- <标签 :visible.sync='Vue变量'></标签> 相当于 -->
    <!-- <标签 :visible="Vue变量"@update:visible="val=>Vue变量=val"></标签> -->
    <!-- visible.sync:组件检测到对话框关闭(ESC,点击关闭,点击蒙层)后便会传递false给Vue变量来隐藏对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" @close="dialogCloseFn">
      <!-- 添加的表单 -->
      <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="80px">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="addForm.cate_name" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input v-model="addForm.cate_alias" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFn">取 消</el-button>
        <el-button type="primary" @click="confirmFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//  如果同一个按钮想要做状态区分
//  1.定义一个标记变量isEdit(这里true为编辑false为新增),同时定义本次要编辑数据的唯一id值editId
//  2.点击修改按钮时将isEdit改为true,editId保存为要修改的数据id
//  3.点击新增按钮的时候,isEdit改为false,将editId置空
//  4.点击保存按钮(确定按钮时)通过isEdit变量做区分
import { getArtCateListAPI, addArtCateListAPI, updateArtCateListAPI, delArtCateListAPi } from '@/api'
export default {
  name: 'ArtCate',
  data() {
    return {
      cateList: [], //  文章分类数组
      dialogVisible: false, //  控制对话框的出现或隐藏
      addForm: { cate_name: '', cate_alias: '' },
      addRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '输入名称为1到10位的非空字符', trigger: 'blur' }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,10}$/, message: '输入别名为1到10位的字母数字', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getArtCateFn()
  },
  methods: {
    //  获取文章分类
    async getArtCateFn() {
      const { data: res } = await getArtCateListAPI()
      this.cateList = res.data
    },
    //  添加分类按钮
    addCateShowDialogFn() {
      this.isEdit = false // 转回新增状态
      this.editId = ''
      this.dialogVisible = true
    },
    //  对话框取消按钮
    cancelFn() {
      this.dialogVisible = false
    },
    //  对话框确定按钮
    confirmFn() {
      this.$refs.addRef.validate(async valid => {
        if (!valid) return false
        //  通过JS基础校验
        if (this.isEdit) {
          //  点击了修改
          // this.addForm.id = this.editId
          // updateArtCateListAPI(this.addForm)
          // 这里将对象解构并和前面的id键值对重新形成三个键值对来传递
          const { data: res } = await updateArtCateListAPI({ id: this.editId, ...this.addForm })
          console.log(res)
          if (res.code !== 0) return this.$message.error('修改文章分类失败')
          this.$message.success('修改文章分类成功')
        } else {
          //  点击了新增
          const { data: res } = await addArtCateListAPI(this.addForm)
          if (res.code !== 0) return this.$message.error('增加文章分类失败')
          this.$message.success('增加文章分类成功')
        }
        //  再次请求文章列表
        this.getArtCateFn()
        //  关闭对话框
        this.dialogVisible = false
      })
    },
    //  弹窗关闭的回调
    dialogCloseFn() {
      //  重置表表单
      this.$refs.addRef.resetFields()
    },
    //  修改分类按钮
    updateCateBtnFn(obj) {
      //  obj: { id: 文章分类的id , cate_name:文章分类的名字 , cate_alias:文章分类的别名  }
      console.log(obj)
      this.isEdit = true
      this.editId = obj.id
      this.dialogVisible = true
      //  先让addForm空字符串初始值绑定到el-form内部,后续用于resetFields重置
      //  让真实DOM先创建并在内部绑定并复制初始值(此时为空)
      //  等真实DOM绑定结束再进行数据回显
      this.$nextTick(() => {
        //  数据回显
        this.addForm.cate_name = obj.cate_name
        this.addForm.cate_alias = obj.cate_alias
      })
    },
    //  删除文章分类
    async delCateFn(obj) {
      //  obj: { id: 文章分类的id , cate_name:文章分类的名字 , cate_alias:文章分类的别名  }
      const { data: res } = await delArtCateListAPi(obj.id)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      //  再次获取列表
      this.getArtCateFn()
    }
  }
}
//  bug: 第一次打开网页点击修改按钮再点击新增按钮发现输入框有预留值
//  说明: 点击修改关闭对话框后表单置空(resetFields)失效了
//  线索:Dialog 的内容是懒渲染的,即在第一次被打开之前,传入的默认slot不会被渲染到DOM上,第二次只是做css的隐藏和显示。
//  线索:vue数据改变先执行同步所有再去执行异步(更新DOM)
//  线索:resetFields对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
//  第一次打开网页点击修改按钮dialogvisible显示为true同时进行了数据回显->对addForm里的变量进行了
// 初始默认赋值,则之后进行的所谓resetFields重置,用的却是初始绑定的值做为初始值而重置则出现置空失效的情况
//  分析:第一次点击修改->dialogvisible改为true并对addForm进行数据赋值->DOM异步更新->dialog渲染
// 同时el-form第一次渲染(使用addForm的值做数据回显也就是所谓的初始值)->将它作为之后进行的resetFields重置初始值
//  解决:让数据回显等到DOM完成更新后(绑定初值后)再次执行
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
