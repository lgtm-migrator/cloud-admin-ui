<template>
  <d2-container class="page">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="信息管理" name="info">
        <el-row>
          <el-col :span="8"></el-col>
          <el-col :span="8">
            <el-form ref="userInfoForm" :model="userInfo" required-asterisk :rules="rules"
                     :label-position="position"
                     center>
              <el-form-item prop="username" label="用户账号">
                <el-input v-model="userInfo.username" disabled clearable></el-input>
              </el-form-item>
              <el-form-item prop="name" label="昵称">
                <el-input v-model="userInfo.name" clearable></el-input>
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
                  <img v-if="userInfo.portraits" :src="userInfo.portraits" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="settingUserInfo">提交</el-button>
                <el-button @click="resetForm('userInfoForm')">重置</el-button>
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
            <el-form ref="passwordForm" :model="passwordInfo" required-asterisk :rules="passwordRules"
                     :label-position="position"
                     center>
              <el-form-item required prop="oldPassword" label="原密码">
                <el-input type="password" v-model="passwordInfo.oldPassword" clearable></el-input>
              </el-form-item>
              <el-form-item required prop="newPassword" label="新密码">
                <el-input type="password" v-model="passwordInfo.newPassword" clearable></el-input>
              </el-form-item>
              <el-form-item required prop="newPassword2" label="确认密码">
                <el-input type="password" v-model="passwordInfo.newPassword2" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="settingPassword">提交</el-button>
                <el-button @click="resetForm('passwordForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8"></el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script> import util from '@/libs/util.js'
import router from '@/router'
import { mapActions } from 'vuex'
import { userUpdatePath, userUpdatePasswordCurrentPath } from '@api/adminApi/user'

export default {
  data () {
    var validateNewPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.passwordInfo.oldPassword === this.passwordInfo.newPassword) {
          callback(new Error('新密码与旧密码相同'))
        }
        callback()
      }
    }
    var validateNewPassword2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认新密码'))
      } else if (this.passwordInfo.newPassword !== this.passwordInfo.newPassword2) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      activeName: 'info',
      userInfo: {
        username: '',
        name: '',
        phone: '',
        email: '',
        portraits: ''
      },
      // 表单校验
      rules: {},
      // password 表单校验
      passwordRules: {
        oldPassword: [{
          required: true,
          message: '请输入原密码',
          trigger: 'blur'
        }],
        newPassword: [{
          validator: validateNewPassword, trigger: 'blur'
        }],
        newPassword2: [{
          validator: validateNewPassword2, trigger: 'blur'
        }]
      },
      position: 'left',
      imageUrl: '',
      passwordInfo: {}
    }
  },
  mounted () {
    let _self = this
    _self.getCurrentInfo()
  },
  methods: {
    ...mapActions('cloudAdmin/user', ['userInfoById', 'userSetting', 'userSettingPasswordCurrent']),
    ...mapActions('d2admin/account', ['logout']),
    ...mapActions('d2admin/user', ['set']),
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
      let _self = this
      let id = util.cookies.get('userId')
      if (id) {
        this.userInfoById({ url: '/' + id, data: '' }).then(result => {
          if (result.errCode === 514) {
            router.push({
              name: 'login'
            })
          } else if (result.errCode !== 200) {
            this.$message.error(result.data)
          } else {
            _self.userInfo = result.data
          }
        })
      } else {
        // 跳转路由
        router.push({
          name: 'login'
        })
      }
    },
    /**
     * 提交用户修改信息
     */
    settingUserInfo () {
      let _self = this
      let url = userUpdatePath
      let info = JSON.parse(JSON.stringify(_self.userInfo))
      if (!info.id) {
        _self.$message.error('修改失败,用户id为空,请重新登录')
        return null
      }
      let params = {
        id: info.id,
        phone: info.phone,
        name: info.name,
        email: info.email,
        portraits: info.portraits
      }
      _self.userSetting({ url: url, data: params }).then(result => {
        if (result.errCode === 200) {
          _self.resetForm('userInfoForm')
          _self.set({
            name: info.name
          })
        } else {
          _self.$message.error(result.data)
        }
      })
    },
    /**
     * 设置密码
     */
    settingPassword () {
      let _self = this
      _self.$refs['passwordForm'].validate((valid) => {
        if (valid) {
          let url = userUpdatePasswordCurrentPath
          let parms = {
            oldPassword: _self.passwordInfo.oldPassword,
            newPassword: _self.passwordInfo.newPassword,
            newPassword2: _self.passwordInfo.newPassword2
          }
          _self.userSettingPasswordCurrent({ url: url, data: parms }).then(result => {
            let code = result.errCode
            if (code !== 200) {
              _self.$message.error(result.data)
            } else {
              _self.logout()
            }
          })
        } else {
          _self.$message.error('表单校验失败，请检查')
        }
      })
    },
    /**
     * 重置表单
     * @param formName
     */
    resetForm (formName) {
      let _self = this
      let username = null
      if (formName === 'userInfoForm') {
        username = _self.userInfo.username
      }
      _self.$refs[formName].resetFields()
      if (formName === 'userInfoForm') {
        _self.userInfo.username = username
      }
    }
  }
}
</script>
<style>
  .el-form-item__label {
    width: auto !important;
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
