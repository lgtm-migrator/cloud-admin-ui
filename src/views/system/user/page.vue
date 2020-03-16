<template>
  <d2-container class="page">
    <el-col :span="10">
      <div>
        <span>组织机构</span>
      </div>
      <div>
        <el-tree :data="treeData"
                 show-checkbox
                 ref="tree"
                 node-key="id"
                 :props="treeProps"
                 check-strictly
                 :highlight-current='true'
                 default-expand-all
                 @check-change="handleNodeChangeCheckEvent"
                 @check="handleNodeCheck"
        >
        </el-tree>
      </div>
    </el-col>
    <el-col :span="14">
      <div class="avue-crud__menu">
        <div>
          <button type="button" @click="handleAddNew" class="el-button el-button--primary el-button--small">
            <i class="el-icon-plus"></i>
            <span>新 增</span>
          </button>
          <button type="button" class="el-button el-button--success el-button--small">
            <i class="el-icon-plus"></i>
            <span>修改</span>
          </button>
          <button type="button" class="el-button el-button--danger el-button--small">
            <i class="el-icon-plus"></i>
            <span>删除</span>
          </button>
        </div>
        <div>
          <button type="button" class="el-button el-tooltip el-button--default el-button--small is-circle"
                  aria-describedby="el-tooltip-177" tabindex="0">
            <i class="el-icon-refresh"></i>
          </button>
        </div>
      </div>
      <el-row :gutter="2">
        <el-col :xs="10">
          <el-table :data="userList" style="width: 100%;" border :fit="true"
                    :header-cell-style="{'text-align':'center'}">
          </el-table>
        </el-col>
      </el-row>
    </el-col>
    <el-dialog title="用户信息" :visible.sync="dialogFormVisible" center>
      <el-form id="userInfoForm" ref="userInfoForm" :model="userInfo" required-asterisk label-width="auto"
               :rules="rules"
               :label-position="position"
               center>
        <el-form-item required prop="name" label="用户名称">
          <el-input v-model="userInfo.name" clearable></el-input>
        </el-form-item>
        <el-form-item required prop="username" label="登录账号">
          <el-input v-model="userInfo.username" clearable></el-input>
        </el-form-item>
        <el-form-item required prop="password" label="登录密码">
          <el-input v-model="userInfo.password" clearable></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="userInfo.phone" clearable></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="userInfo.email" clearable></el-input>
        </el-form-item>
        <el-form-item prop="dept" label="所属组织">
          <el-cascader
            :model="userInfo.dept"
            :options="treeData"
            :props="{ checkStrictly: true, children: 'children',label: 'name',value:'id'}"
            clearable
            @change="handleChangeDept"></el-cascader>
        </el-form-item>
        <el-form-item prop="post" label="所属岗位">
          <el-cascader
            :model="userInfo.post"
            :options="postData"
            :props="{ checkStrictly: true,multiple: true ,children: 'children',label: 'name',value:'id'}"
            clearable></el-cascader>
        </el-form-item>
        <el-form-item prop="role" label="用户角色">
          <el-select
            v-model="userInfo.role"
            multiple
            collapse-tags
            placeholder="请选择">
            <el-option
              v-for="item in roleData"
              :key="item.value"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="isEnabled" label="状态">
          <el-radio-group v-model="userInfo.isEnabled">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"><i class="el-icon-circle-plus-outline"></i>保存
        </el-button>
        <el-button><i class="el-icon-circle-close"></i>取 消</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>
<script> import { mapActions } from 'vuex'
import { DeptTreePath } from '@api/adminApi/dept'
import { PostAllPath } from '@/api/adminApi/post'

export default {
  data: function () {
    return {
      treeData: [],
      treeProps: {
        children: 'children',
        label: 'name'
      },
      postData: [],
      roleData: [],
      i: 0,
      labelPosition: 'left',
      position: 'left',
      searchUserForm: {},
      userList: [],
      currentNodeData: {},
      dialogFormVisible: false,
      isUpdate: false,
      userInfo: {},
      // 表单校验
      rules: {}
    }
  },
  mounted () {
    let _self = this
    _self.getDeptTree()
    _self.getPostList()
  },
  methods: {
    ...mapActions('cloudAdmin/dept', ['deptTree']),
    ...mapActions('cloudAdmin/post', ['postAll']),
    /**
     * 获取组织机构
     */
    getDeptTree () {
      let _self = this
      let url = DeptTreePath
      _self.deptTree({ url: url, data: null }).then(result => {
        let code = result.errCode
        if (code !== 200) {
          _self.$message.error(result.data)
        } else {
          _self.treeData = result.data
        }
      })
    },
    /**
     * 岗位信息
     */
    getPostList () {
      let _self = this
      let url = PostAllPath
      _self.postAll({ url: url, data: null }).then(result => {
        let code = result.errCode
        if (code !== 200) {
          _self.$message.error(result.data)
        } else {
          _self.postData = result.data
        }
      })
    },
    /**
     * 单选,选中change
     */
    handleNodeChangeCheckEvent (data, checked, node) {
      this.i++
      if (this.i % 2 === 0) {
        if (checked) {
          this.$refs.tree.setCheckedNodes([])
          this.$refs.tree.setCheckedNodes([data])
          // 交叉点击节点
        } else {
          this.$refs.tree.setCheckedNodes([])
          // 点击已经选中的节点，置空
        }
      }
    },
    /**
     * 属性选中
     * @param data
     * @param obj
     */
    handleNodeCheck (data, obj) {
      let _self = this
      _self.currentNodeData = JSON.parse(JSON.stringify(data))
    },
    handleAddNew () {
      let _self = this
      _self.isUpdate = false
      _self.userInfo = {}
      _self.dialogFormVisible = true
    },
    /**
     * 组织选中
     */
    handleChangeDept () {
    }
  }
}

</script>

<style lang="scss" scoped>
  .avue-crud__menu {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    position: relative;
    width: 100%;
    min-height: 40px;
    height: auto;
    overflow: hidden;
    margin-bottom: 5px;
  }

  #userInfoForm .el-cascader {
    display: block;
    position: relative;
    font-size: 14px;
    line-height: 40px;
  }

  #userInfoForm .el-select {
    display: block;
    position: relative;
  }
</style>
