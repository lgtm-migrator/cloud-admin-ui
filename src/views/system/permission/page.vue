<template>
  <d2-container class="page">
    <el-col :span="12">
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
            show-checkbox>
          </el-tree>
        </div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card shadow="never">
        <div slot="header">
          <span>权限</span>
          <el-button style="float: right; padding: 3px 0" @click="handleAddEvent" type="text">新增</el-button>
        </div>
        <div>
          权限
        </div>
      </el-card>
    </el-col>
    <el-dialog title="权限信息" :before-close="handleDialogClose" :visible.sync="dialogPermissionFormVisible">
      <el-form :inline="true" label-width="auto" :model="permissionInfo"
               :label-position="position">
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
        <el-button type="primary">保存</el-button>
        <el-button @click="handleDialogCloseEvent">取 消</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>
<script>import { mapActions } from 'vuex'
import { MenusByParentIdPath } from '@api/adminApi/menu'
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
      permissionInfo: {}
    }
  },
  mounted () {
    let _self = this
    _self.getMenusByParentId(0)
  },
  methods: {
    ...mapActions('cloudAdmin/menu', ['menuList', 'menuTree', 'menuSave', 'menuUpdateById', 'menuRemove']),
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
        _self.dialogPermissionFormVisible = true
      }
    }
  }
}
</script>
<style></style>
