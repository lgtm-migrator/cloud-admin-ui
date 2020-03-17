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
            <i class="el-icon-edit"></i>
            <span>修改</span>
          </button>
          <button type="button" class="el-button el-button--danger el-button--small">
            <i class="el-icon-delete"></i>
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
            <el-table-column
              type="selection"
              sortable resizable
              :show-overflow-tooltip="true"
              align="center">
            </el-table-column>
            <el-table-column prop="username" label="用户账号" sortable resizable :show-overflow-tooltip="true"
                             align="center"></el-table-column>
            <el-table-column prop="name" label="用户名称" sortable resizable :show-overflow-tooltip="true"
                             align="center"></el-table-column>
            <el-table-column prop="phone" label="手机号码" sortable resizable :show-overflow-tooltip="true"
                             align="center"></el-table-column>
            <el-table-column prop="email" label="邮箱" sortable resizable :show-overflow-tooltip="true"
                             align="center"></el-table-column>
            <el-table-column prop="isEnabled" label="状态" sortable resizable :show-overflow-tooltip="true"
                             align="center">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.isEnabled ==1 ? 'success' : 'danger'"
                  disable-transitions>{{scope.row.isEnabled==1?'启用':'禁用'}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" sortable resizable :show-overflow-tooltip="true"
                             align="center"></el-table-column>
            <el-table-column label="操作" sortable resizable :show-overflow-tooltip="true"
                             align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="handleEdit(scope.$index, scope.row)" size="mini">
                  <i class="el-icon-edit"></i>
                  编辑
                </el-button>
                <el-button type="text" @click="handleRemove(scope.$index,scope.row)" size="mini">
                  <i class="el-icon-delete"></i>
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination align='left'
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="pages.page"
                         :page-sizes="[10, 20, 50, 100]"
                         :page-size="pages.pageSize"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="pages.total">
          </el-pagination>
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
        <el-form-item v-if="!isUpdate" required prop="password" label="登录密码">
          <el-input type="password" v-model="userInfo.password" clearable></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="userInfo.phone" clearable></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="userInfo.email" clearable></el-input>
        </el-form-item>
        <el-form-item prop="dept" label="所属组织">
          <treeselect v-model="userInfoDept"
                      :options="treeData"
                      :normalizer="normalizer"/>
        </el-form-item>
        <el-form-item prop="post" label="所属岗位">
          <el-cascader
            v-model="userInfoPost"
            :options="postData"
            :props="{ checkStrictly: true,multiple: true ,children: 'children',label: 'name',value:'id'}"
            clearable></el-cascader>
        </el-form-item>
        <el-form-item prop="role" label="用户角色">
          <el-select
            v-model="userInfoRole"
            multiple
            collapse-tags
            placeholder="请选择">
            <el-option
              v-for="item in roleData"
              :key="item.id"
              :label="item.name"
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
        <el-button type="primary" @click="handleSave"><i class="el-icon-circle-plus-outline"></i>保存
        </el-button>
        <el-button @click="handleClose"><i class="el-icon-circle-close"></i>取 消</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>
<script> import { mapActions } from 'vuex'
import { DeptTreePath } from '@api/adminApi/dept'
import { PostAllPath } from '@/api/adminApi/post'
import { RoleListPath } from '@/api/adminApi/role'
import { UserInfoPath, UserPagePath, UserSavePath, UserUpdatePath, UserDeletePath } from '@/api/adminApi/user'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { MessageBox } from 'element-ui'

export default {
  components: { Treeselect },
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
      rules: {},
      userInfoDept: null,
      userInfoPost: [],
      userInfoRole: [],
      userPageInfo: {},
      // 分页
      pages: {
        page: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  mounted () {
    let _self = this
    _self.getDeptTree()
    _self.getPostList()
    _self.getRoleList()
  },
  methods: {
    ...mapActions('cloudAdmin/dept', ['deptTree']),
    ...mapActions('cloudAdmin/post', ['postAll']),
    ...mapActions('cloudAdmin/role', ['roleListPage']),
    ...mapActions('cloudAdmin/user', ['userSave', 'userPage', 'userInfoId', 'userUpdate', 'userDelete']),
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
     * 角色信息
     */
    getRoleList () {
      let _self = this
      let url = RoleListPath
      _self.roleListPage({ url: url, data: null }).then(result => {
        let code = result.errCode
        if (code !== 200) {
          _self.$message.error(result.data)
        } else {
          _self.roleData = result.data
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
    normalizer (node) {
      // 去掉children=[]的children属性
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
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
      _self.getUserPage()
    },
    handleSizeChange (val) {
      this.pages.pageSize = val
      this.getUserPage()
    },
    handleCurrentChange (Page) {
      this.pages.page = Page
      this.getUserPage()
    },
    handleAddNew () {
      let _self = this
      _self.isUpdate = false
      _self.userInfo = {}
      _self.userInfoDept = null
      _self.userInfoRole = []
      _self.userInfoPost = []
      _self.dialogFormVisible = true
    },
    handleSave () {
      let _self = this
      // 校验
      this.$refs.userInfoForm.validate((valid) => {
        if (valid) {
          if (_self.isUpdate) {
            _self.update()
          } else {
            _self.save()
          }
        } else {
          // 校验失败
          // 登录表单校验失败
          this.$message.error('表单校验失败，请检查')
        }
      })
    },
    /**
     * 弹窗关闭
     */
    handleClose () {
      let _self = this
      _self.dialogFormVisible = false
      _self.userInfo = {}
      _self.userInfoDept = null
      _self.userInfoRole = []
      _self.userInfoPost = []
    },
    /**
     * 编辑
     */
    handleEdit (index, row) {
      let _self = this
      let id = row.id
      _self.userInfo = {}
      _self.userInfoDept = null
      _self.userInfoRole = []
      _self.userInfoPost = []
      _self.getUserInfo(id)
      _self.isUpdate = true
    },
    handleRemove (index, row) {
      let _self = this
      MessageBox.confirm('是否删除该数据', '删除', {
        type: 'warning'
      }).then(() => {
        _self.delete(row.id)
      })
    },
    /**
     * 组织选中
     */
    handleChangeDept () {
    },
    /**
     * 获取用户详情
     */
    getUserInfo (id) {
      let _self = this
      if (id) {
        let url = UserInfoPath + '/' + id
        _self.userInfoId({ url: url, data: null }).then(result => {
          let code = result.errCode
          if (code != 200) {
            _self.$message.error(result.data)
          } else {
            _self.dialogFormVisible = true
            _self.userInfo = result.data
            _self.userInfoDept = _self.userInfo.deptId
            _self.userInfoRole = _self.userInfo.roles
            _self.userInfoPost = _self.userInfo.posts
          }
        })
      }
    },
    save () {
      let _self = this
      let info = JSON.parse(JSON.stringify(_self.userInfo))
      info.deptId = _self.userInfoDept
      let role = JSON.parse(JSON.stringify(_self.userInfoRole))
      info.roles = role
      let posts = JSON.parse(JSON.stringify(_self.userInfoPost))
      posts = this.steamroller(posts)
      info.posts = posts
      let url = UserSavePath
      console.info(info)
      _self.userSave({ url: url, data: info }).then(result => {
        let code = result.errCode
        if (code != 200) {
          _self.$message.error(result.data)
        } else {
          _self.getDeptTree()
          _self.getPostList()
          _self.getRoleList()
          _self.dialogFormVisible = false
        }
      })
    },
    update () {
      let _self = this
      let info = JSON.parse(JSON.stringify(_self.userInfo))
      info.deptId = _self.userInfoDept
      let role = JSON.parse(JSON.stringify(_self.userInfoRole))
      info.roles = role
      let posts = JSON.parse(JSON.stringify(_self.userInfoPost))
      posts = this.steamroller(posts)
      info.posts = posts
      let url = UserUpdatePath + '/' + info.id
      _self.userUpdate({ url: url, data: info }).then(result => {
        let code = result.errCode
        if (code != 200) {
          _self.$message.error(result.data)
        } else {
          _self.getDeptTree()
          _self.getPostList()
          _self.getRoleList()
          _self.dialogFormVisible = false
        }
      })
    },
    delete (id) {
      let _self = this
      if (id) {
        let url = UserDeletePath + '/' + id
        _self.userDelete({ url: url, data: null }).then(result => {
          let code = result.errCode
          if (code != 200) {
            _self.$message.error(result.data)
          } else {
            _self.getDeptTree()
            _self.getPostList()
            _self.getRoleList()
            _self.userList = []
          }
        })
      }
    },
    /**
     * 二维变一维
     * @param arr
     * @returns {Array}
     */
    steamroller (arr) {
      if (Array.isArray(arr)) {
        var newArray = []
        for (var i = 0; i < arr.length; i++) {
          if (Array.isArray(arr[i])) {
            newArray.push(arr[i][0])
          } else {
            newArray.push(arr[i])
          }
        }
        return newArray
      } else {
        return arr
      }
    },
    /**
     * 获取用户集合
     */
    getUserPage () {
      let _self = this
      let params = {
        'deptId': _self.currentNodeData.id
      }
      let url = UserPagePath + '/' + _self.pages.page + '/' + _self.pages.pageSize
      _self.userPage({ url: url, data: params }).then(result => {
        let code = result.errCode
        if (code != 200) {
          _self.$message.error(result.data)
        } else {
          _self.userList = result.data.list
          _self.pages.total = Number(result.data.total)
        }
      })
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
