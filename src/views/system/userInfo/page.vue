<template>
  <d2-container class="page">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="信息管理" name="info">
        <el-row>
          <el-col :span="8"></el-col>
          <el-col :span="8">
            <el-form ref="routerForm" :model="userInfo"  required-asterisk  label-width="auto"  :rules="rules"
                     :label-position="position"
                     center>
              <el-form-item prop="username" label="用户账号">
                <el-input v-model="userInfo.username" clearable></el-input>
              </el-form-item>
              <el-form-item prop="phone" label="手机号码">
                <el-input v-model="userInfo.phone" clearable></el-input>
              </el-form-item>
              <el-form-item prop="email" label="邮箱">
                <el-input v-model="userInfo.email" clearable></el-input>
              </el-form-item>
              <el-form-item prop="" label="头像">
                <el-upload
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item>
                <el-button type="primary">提交</el-button>
                <el-button>重置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8"></el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="密码管理" name="password">
        <el-row>
          <el-col :span="8"></el-col>
          <el-col :span="8">
            <el-form ref="routerForm" :model="passwordInfo" required-asterisk label-width="auto"  :rules="passwordRules"
                     :label-position="position"
                     center>
              <el-form-item prop="oldPassword" label="原密码">
                <el-input v-model="passwordInfo.oldPassword" clearable></el-input>
              </el-form-item>
              <el-form-item prop="newPassword" label="新密码">
                <el-input v-model="passwordInfo.newPassword" clearable></el-input>
              </el-form-item>
              <el-form-item prop="newpassword2" label="确认密码">
                <el-input v-model="passwordInfo.newpassword2" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary">提交</el-button>
                <el-button>重置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8"></el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>export default {
  data () {
    return {
      activeName: 'info',
      userInfo: {},
      // 表单校验
      rules: {},
      // password 表单校验
      passwordRules: {},
      position: 'left',
      imageUrl: '',
      passwordInfo: {}
    }
  },
  mounted () {

  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'info') {

      } else if (tab.name === 'password') {

      }
    },
    /**
     * 获取当前用户
     *
     */
    getCurrentInfo: function () {

    }
  }
}
</script>
<style>
  .el-form-item__label{
    width: auto!important;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
