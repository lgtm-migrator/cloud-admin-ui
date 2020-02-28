<template>
  <d2-container class="page">
    <el-col :span="6">
      <el-card shadow="never">
        <div slot="header">
          <span>系统菜单</span>
        </div>
        <div>
          <el-tree
            :props="props"
            :load="loadNode"
            :data="datamenuList"
            ref="tree"
            node-key="id"
            lazy
            show-checkbox
            @check="handleNodeCheckEvent">
          </el-tree>
        </div>
      </el-card>
    </el-col>
    <el-col :span="18">
      <el-card shadow="never">
        <div slot="header">
          <span>权限</span>
          <el-button style="float: right; padding: 3px 0" @click="handleAddEvent" type="text">新增</el-button>
        </div>
        <el-table :data="permissionList" style="width: 100%;" border :fit="true"
                  :header-cell-style="{'text-align':'center'}">
          <el-table-column prop="systemPermissionVO.name" label="权限名称" sortable resizable :show-overflow-tooltip="true"
                           align="center"></el-table-column>
          <el-table-column prop="systemPermissionVO.url" label="权限标识" sortable resizable :show-overflow-tooltip="true"
                           align="center"></el-table-column>
          <el-table-column prop="systemMenuVO.description" label="所属菜单" sortable resizable :show-overflow-tooltip="true"
                           align="center"></el-table-column>
          <el-table-column prop="systemPermissionVO.createTime" label="创建时间" sortable resizable :show-overflow-tooltip="true"
                           align="center"></el-table-column>
          <el-table-column
            label="操作"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="handlerView(scope.row)" size="mini">
                <i class="el-icon-view"></i>
                查看
              </el-button>
              <el-button type="text" @click="handleEdit(scope.row)" size="mini">
                <i class="el-icon-edit"></i>
                编辑
              </el-button>
              <el-button type="text" @click="handleRemove(scope.row)" size="mini">
                <i class="el-icon-delete"></i>
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-dialog title="权限信息" :before-close="handleDialogClose" :visible.sync="dialogPermissionFormVisible">
      <el-form :inline="true" label-width="auto" :model="permissionInfo"
               :label-position="position"
               ref="permissionForm" required-asterisk
               :rules="rules">
        <el-row>
          <el-col :md="12"
                  :xs="24"
                  :offset="0"
                  style="padding-left:10px;padding-right:10px">
            <el-form-item required label="名称" prop="name">
              <el-input v-model="permissionInfo.name" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12"
                  :xs="24"
                  :offset="0"
                  style="padding-left:10px;padding-right:10px">
            <el-form-item label="英文名称" prop="enname">
              <el-input v-model="permissionInfo.enname" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12"
                  :xs="24"
                  style="padding-left:10px;padding-right:10px">
            <el-form-item label="所属菜单" prop="menu">
              <el-input disabled v-model="permissionInfo.menuName" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12"
                  :xs="24"
                  style="padding-left:10px;padding-right:10px">
            <el-form-item required label="权限标识" prop="url">
              <el-input v-model="permissionInfo.url" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24"
                  :xs="24"
                  style="padding-left:10px;padding-right:10px">
            <el-form-item label="说明" prop="description">
              <el-input type="textarea" v-model="permissionInfo.description" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSaveEvent">保存</el-button>
        <el-button @click="handleDialogCloseEvent">取 消</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>
<script>import { mapActions } from 'vuex'
import { MenusByParentIdPath } from '@api/adminApi/menu'
import { PermissionSavePath } from '@api/adminApi/permission'
import { PermissionMenuByMenuIdPath } from '@api/adminApi/permissionMenu'
import router from '@/router'

export default {
  data () {
    return {
      props: {
        value: 'id',
        label: 'name',
        children: 'childrens',
        checkStrictly: true
      },
      datamenuList: [],
      currentNode: '',
      dialogPermissionFormVisible: false,
      position: 'left',
      permissionInfo: {},
      isUpdate: false,
      rules: {
        name: [{
          required: true,
          message: '请输入权限名称',
          trigger: 'blur'
        }],
        url: [{
          required: true,
          message: '请输入权限标识',
          trigger: 'blur'
        }]
      },
      permissionList: []
    }
  },
  mounted () {
    let _self = this
    _self.getMenusByParentId(0)
  },
  methods: {
    ...mapActions('cloudAdmin/menu', ['menuList']),
    ...mapActions('cloudAdmin/permission', ['permissionSave']),
    ...mapActions('cloudAdmin/permissionMenu', ['permissionMenuByMenuId']),
    /**
     * 获取菜单集
     */
    getMenusByParentId (params) {
      let _self = this
      let url = MenusByParentIdPath + '/' + params
      _self.menuList({ url: url, data: '' }).then(result => {
        let code = result.errCode
        if (code === 514) {
          router.push({
            name: 'login'
          })
        } else if (code !== 200) {
          _self.$message.error(result.data)
        } else {
          _self.datamenuList = result.data
        }
      })
    },
    loadNode (node, resolve) {
      let _self = this
      if (node.level === 0) {

      } else {
        let id = node.data.id
        let url = MenusByParentIdPath + '/' + id
        _self.menuList({ url: url, data: '' }).then(result => {
          let code = result.errCode
          if (code === 514) {
            router.push({
              name: 'login'
            })
          } else if (code !== 200) {
            _self.$message.error(result.data)
          } else {
            resolve(result.data)
          }
        })
      }
    },
    handleDialogClose (done) {
      let _self = this
      _self.permissionInfo = {}
      done()
    },
    handleDialogCloseEvent () {
      let _self = this
      _self.permissionInfo = {}
      _self.dialogPermissionFormVisible = false
    },
    /**
     * 新增
     */
    handleAddEvent () {
      let _self = this
      let keys = this.$refs.tree.getCheckedKeys(true)
      if (keys.length > 1) {
        _self.$message.error('请选择菜单(有且只有一个)')
      } else if (keys.length < 1) {
        _self.$message.error('请选择菜单')
      } else {
        let key = keys[0]
        let currentData = this.$refs.tree.getNode(key)
        _self.permissionInfo.menuId = currentData.data.id
        _self.permissionInfo.menuName = currentData.data.name
        _self.isUpdate = false
        _self.dialogPermissionFormVisible = true
      }
    },
    /**
     * 树形节点点击
     */
    handleNodeCheckEvent (data, node) {
      let _self = this
      if (node.checkedKeys.length > 1) {
        return null
      } else if (node.checkedKeys.length < 1) {
        return null
      }
      let id = data.id
      _self.permissionMenuByMenuIdHandler(id)
    },
    /**
     * 保存
     */
    handleSaveEvent () {
      let _self = this
      this.$refs.permissionForm.validate((valid) => {
        if (valid) {
          if (_self.isUpdate) {

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
     * 根据菜单id获取权限
     */
    permissionMenuByMenuIdHandler (meuId) {
      let _self = this
      if (meuId) {
        let url = PermissionMenuByMenuIdPath + '/' + meuId
        _self.permissionMenuByMenuId({ url: url, data: '' }).then(result => {
          if (result.errCode !== 200) {
            this.$message.error(result.data)
          } else {
            _self.permissionList = result.data
          }
        })
      }
    },
    /**
     * 保存
     */
    save () {
      let _self = this
      let info = JSON.parse(JSON.stringify(_self.permissionInfo))
      let url = '/' + PermissionSavePath
      _self.permissionSave({ url: url, data: info }).then(result => {
        if (result.errCode !== 200) {
          this.$message.error(result.data)
        } else {
          _self.dialogPermissionFormVisible = false
          _self.permissionInfo = {}
        }
      })
    }
  }
}
</script>
<style></style>
