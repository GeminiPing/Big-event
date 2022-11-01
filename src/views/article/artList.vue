<template>
  <div>
    <!-- 内容区域 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
              <el-option v-for="obj in cateList" :key="obj.id" :label="obj.cate_name" :value="obj.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="chooseFn">筛选</el-button>
            <el-button type="info" size="small" @click="resetFn">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button type="primary" size="small" class="btn-pub" @click="showPubDialogFn">发表文章</el-button>
      </div>

      <!-- 文章表格区域 -->
      <el-table :data="artList" style="width: 100%" border stripe>
        <el-table-column label="文章标题" prop="title">
          <template v-slot="scope">
            <el-link type="primary" @click="showDetailFn(scope.row.id)">{{ scope.row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="cate_name"></el-table-column>
        <el-table-column label="发表时间" prop="pub_date">
          <template v-slot="scope">
            <span> {{ $formatDate(scope.row.pub_date) }} </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="danger" @click="removeFn(scope.row.id)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChangeFn"
        @current-change="handleCurrentChangeFn"
        :current-page.sync="q.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size.sync="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 发表文章的 Dialog 对话框 -->
    <el-dialog title="发表文章" :visible.sync="pubDialogVisible" fullscreen :before-close="handleClose" @close="dialogCloseFn">
      <!-- 发布文章的对话框 -->
      <el-form :model="pubForm" :rules="pubFormRules" ref="pubFormRef" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%">
            <el-option v-for="obj in cateList" :key="obj.id" :label="obj.cate_name" :value="obj.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <quill-editor v-model="pubForm.content" @blur="contentChangeFn"></quill-editor>
        </el-form-item>
        <el-form-item label="文章封面" prop="cover_img">
          <!-- 用来显示封面的图片 -->
          <img src="../../assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef" />
          <br />
          <!-- 文件选择框，默认被隐藏 -->
          <input type="file" style="display: none" accept="image/*" ref="iptFileRef" @change="changeCoverFn" />
          <!-- 选择封面的按钮 -->
          <el-button type="text" @click="selCoverFn">+ 选择封面</el-button>
        </el-form-item>
        <!-- 发布/保存草稿 -->
        <el-form-item>
          <el-button type="primary" @click="pubArticleFn('已发布')">发布</el-button>
          <el-button type="info" @click="pubArticleFn('草稿')">存为草稿</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 查看文章详情的对话框 -->
    <el-dialog title="文章预览" :visible.sync="detaliVisible" width="80%">
      <h1 class="title">{{ artDetail.title }}</h1>
      <div class="info">
        <span>作者:{{ artDetail.nickname || artDetail.username }}</span>
        <span>发布时间:{{ $formatDate(artDetail.pub_date) }}</span>
        <span>所属分类:{{ artDetail.cate_name }}</span>
        <span>状态:{{ artDetail.state }}</span>
      </div>
      <!-- 分割线 -->
      <el-divider></el-divider>

      <!-- 文章的封面 -->
      <img :src="baseURL + artDetail.cover_img" />

      <!-- 文章的详情 -->
      <div v-html="artDetail.content" class="detail-box"></div>
    </el-dialog>
  </div>
</template>

<script>
//  标签和样式中,引入图片可以写路径但js不行他会默认为字符串需要用import引入图片
//  webpack会把图片变成一个base64字符串或是临时地址
import defaultImg from '@/assets/images/cover.jpg'
import { getArtCateListAPI, uploadArticleAPI, getArticleListAPI, getArtDetailAPI, delArtListAPI } from '@/api'
import { baseURL } from '@/utils/request'
export default {
  name: 'ArtList',
  data() {
    return {
      // 查询参数对象
      q: {
        pagenum: 1, //  默认请求第一页的数据
        pagesize: 2, // 默认当前页需要几条数据
        cate_id: '',
        state: ''
      },
      baseURL, //  基地址
      pubDialogVisible: false, //  控制发布框的显示和隐藏(true/false)
      detaliVisible: false, // 控制文章详情对话框的显示和隐藏
      cateList: [], //  保存文章分类数据
      artList: [], // 保存文章列表
      total: 0, //  保存现有文章的总条数
      // 发布文章的表单的数据对象
      pubForm: {
        title: '', // 文章标题
        cate_id: '', //  文章id
        content: '', //  文章内容
        cover_img: '', // 文章封面图片文件
        state: '' //  文章状态('已发布'和'草稿')
      },
      // 发布文章的表单的验证规则对象
      pubFormRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
        ],
        cate_id: [{ required: true, message: '请选择文章标题', trigger: 'change' }],
        //  因为content是来自quill-editor的而不是el-form提供的表单标签所以本身没有change和blur两个事件
        //  需要手动绑定change事件通过调用el-form中的validateField来校验
        content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
        cover_img: [{ required: true, message: '请选择文章封面', trigger: 'blur' }]
      },
      // 文章详情
      artDetail: {}
    }
  },
  methods: {
    // 初始化文章列表
    async getArtListFn() {
      const { data: res } = await getArticleListAPI(this.q)
      this.artList = res.data
      this.total = res.total
    },
    //  发布文章对话框关闭前的回调,执行done才能让对话框关闭
    async handleClose(done) {
      //  用户是否关闭对话框
      const confirmResult = await this.$confirm('此操作将导致文章信息丢失看,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err) //  这里的catch用于捕获Promise对象为拒绝状态时返回的'cancel结果字符串'
      console.log(confirmResult)
      //  $confirm是个确认提示框,并使用了Promise语法来管理,点击确定它的状态为兑现成功状态并返回'confirm'
      // 点击取消则为拒绝状态返回'cancel'
      //  await只能用在被async修饰的函数内,async修饰的是异步函数,如果此函数被调用则返回一个全新的Promise对象
      // 而await之前的代码回同步执行,它只会暂停async内的代码并等待await后的异步结果
      // 注意await只能拿到成功的结果后才会继续往下执行代码,如果拿到失败结果则会向浏览器抛出异常并停止执行后面的代码

      if (confirmResult === 'cancel') return
      done()
    },
    //  发布文章对话框点击出现
    showPubDialogFn() {
      this.pubDialogVisible = true
    },
    //  获取文章分类
    async getCateListFn() {
      const { data: res } = await getArtCateListAPI()
      console.log(res)
      this.cateList = res.data
    },
    //  选中封面的点击事件
    selCoverFn() {
      this.$refs.iptFileRef.click() //  触发一次input原生上的点击
    },
    //  用户选择了封面文件
    changeCoverFn(e) {
      //  原生事件对象e 通过e.target可以拿到触发事件的那个标签(这里是input标签对象本身)\
      //  e.target.files 可以获取到选择的文件数组
      const files = e.target.files
      if (files.length === 0) {
        //  用户未选择图片
        this.pubForm.cover_img = null
        //  将img显示为默认
        this.$refs.imgRef.setAttribute('src', defaultImg)
      } else {
        //  用户选择了图片则把文件保存到表单对象的属性里
        this.pubForm.cover_img = files[0]
        //  把图片文件显示到img标签里
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
      }
      //  封面改变校验
      this.$refs.pubFormRef.validateField('cover_img')
    },
    //  文章(发布/存为草稿)按钮的点击事件
    pubArticleFn(state) {
      this.pubForm.state = state // 保存到统一表单对象pubForm
      this.$refs.pubFormRef.validate(async valid => {
        if (valid) {
          console.log(this.pubForm)
          //  准备一个容器fd存放(FormData是专门H5用于存参数和文件的容器)
          const fd = new FormData()
          fd.append('title', this.pubForm.title)
          fd.append('cate_id', this.pubForm.cate_id)
          fd.append('content', this.pubForm.content)
          fd.append('cover_img', this.pubForm.cover_img)
          fd.append('state', this.pubForm.state)

          const { data: res } = await uploadArticleAPI(fd)
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
          //  关闭对话框
          this.pubDialogVisible = false
          //  刷新文章列表
          this.getArtListFn()
        } else {
          return false
        }
      })
    },
    //  富文本内容改变校验
    contentChangeFn() {
      this.$refs.pubFormRef.validateField('content')
    },
    //  发布文章对话框关闭时清空表单
    dialogCloseFn() {
      this.$refs.pubFormRef.resetFields()
      this.pubForm.state = ''
      //  封面需要设置回 初始值,因为img不受v-model的影响
      this.$refs.imgRef.setAttribute('src', defaultImg)
    },
    // 分页每条页数改变时触发
    handleSizeChangeFn(sizes) {
      //  每页多少条
      //  核心思想:根据选择的条数影响查询对象q的属性值,并再次发送获取请求让后台返回数据
      this.q.pagesize = sizes
      //  改变每页条数后设置为从第一页开始
      this.q.pagenum = 1
      this.getArtListFn()
    },
    // 当前页码改变时触发
    handleCurrentChangeFn(nowPage) {
      //  nowPage当前页
      this.q.pagenum = nowPage
      this.getArtListFn()
    },
    // 筛选按钮点击事件
    chooseFn() {
      //  当有了筛选目标后将页码和页数设置为默认值
      this.q.pagenum = 1
      this.q.pagesize = 2
      this.getArtListFn()
    },
    //  重置按钮点击事件
    resetFn() {
      this.q.pagenum = 1
      this.q.pagesize = 2
      this.q.cate_id = ''
      this.q.state = ''
      this.getArtListFn()
    },
    //  文章标题点击展示文章详情
    async showDetailFn(artId) {
      const { data: res } = await getArtDetailAPI(artId)
      console.log(res)
      this.detaliVisible = true
      this.artDetail = res.data
    },
    //  删除文章按钮的点击事件
    async removeFn(artId) {
      const { data: res } = await delArtListAPI(artId)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      //  当前删除的是否是该页码的最后一条
      if (this.artList.length === 1) {
        //  当前删除页是否是第一页
        if (this.q.pagenum > 1) {
          //  将页码数向前
          this.q.pagenum--
        }
      }
      //  再次获取文章数据
      this.getArtListFn()
    }
  },
  created() {
    //  请求分类的数据
    this.getCateListFn()
    //  获取文章列表
    this.getArtListFn()
  }
  //  bug:默认每条2页且当前总共条数为15的情况下,先点击最后一个页码,然后切换到10条每页,分页到了第2页却未显示数据
  //  分析:每页的条数改变了同时页码也从最后一页变成第二页那么也就意味着两个change事件都会触发则后台会返回两次值
  // 但这两个值谁先到不确定,如果第二页每页十条先回来了(当前数据足够实现分页),紧接着第八页的每页十条跟着回来了(此时没数据)
  // 则就是个空数组所以到页面上显示也是空的
  //  解决:当切换每页显示的条数则把当前页码设置为1,让两次请求都是从第一页开始

  //  bug:在最后一页删除最后一条数据时,虽然页码能回到上一页但是数据并没有出现
  //  分析:观察network里参数q.pagenum的值不会自己回到上一页,因为q.pagenum的值未被修改然后带着之前的参数去调getArtList方法,所以没数据
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}
// 分页样式
.el-pagination {
  margin-top: 15px;
}

// 设置富文本编辑器的默认最小高度
// scope属性的作用:让style里的选择器只能选中当前组件的标签(保证样式的独立性不会影响其他组件)
//<标签 data-v-xxxx class="xx"></标签> 选择器会成为 .xx[data-v-xxxx]
// 注意:scope只会给当前组件内的所有原生标签添加data-v-hash属性,还有组件标签内的根标签添加属性,而组件标签内的非根标签则不会添加
// ::v-deep作用: 穿透选择, 正常style上加了scope的话, 会给.ql-editor[data-v-hash]属性, 只能选择当前页面标签或者组件的根标签
// 如果想要选择组件内的标签(那些标签没有data-v-hash值)所以正常选择选不中, 加了::v-deep空格前置的话, 选择器就会变成如下形式
// [data-v-hash] .ql-editor 这样就能选中组件内的标签的class类名了
::v-deep .ql-editor {
  min-height: 300px;
}
// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}

.title {
  font-size: 24px;
  text-align: center;
  font-weight: normal;
  color: #000;
  margin: 0 0 10px 0;
}

.info {
  font-size: 12px;
  span {
    margin-right: 20px;
  }
}
</style>
