<template>
  <d2-container class="page">
    <el-col :span="6">
      <el-card shadow="never">
        <div slot="header">
          <span>系统菜单</span>
        </div>
        <div>
          <el-tree :data="datamenuList"
                   show-checkbox
                   ref="tree"
                   node-key="id"
                   :props="props"
                   check-strictly
                   :highlight-current='true'
                   default-expand-all
                   @check-change="handleNodeChangeCheckEvent"
                   @check="handleNodeCheckClickEvent"
          >
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
          <el-table-column prop="systemMenuVO.name" label="所属菜单" sortable resizable :show-overflow-tooltip="true"
                           align="center"></el-table-column>
          <el-table-column prop="systemPermissionVO.createTime" label="创建时间" sortable resizable
                           :show-overflow-tooltip="true"
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
      <el-form label-width="auto" :model="permissionInfo"
               :label-position="position"
               ref="permissionForm" required-asterisk
               :rules="rules" center>
        <el-form-item required label="名称" prop="name">
          <el-input v-model="permissionInfo.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="英文名称" prop="enname">
          <el-input v-model="permissionInfo.enname" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属菜单" prop="menu">
          <el-input disabled v-model="permissionInfo.menuName" clearable></el-input>
        </el-form-item>
        <el-form-item required label="权限标识" prop="url">
          <el-input v-model="permissionInfo.url" clearable></el-input>
        </el-form-item>
        <el-form-item label="说明" prop="description">
          <el-input type="textarea" v-model="permissionInfo.description" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="!isView" class="dialog-footer">
        <el-button type="primary" @click="handleSaveEvent">保存</el-button>
        <el-button @click="handleDialogCloseEvent">取 消</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>
<script>import { mapActions } from 'vuex'
import { MenusTreePath } from '@api/adminApi/menu'
import { PermissionSavePath, PermissionUnBindingPath, PermissionUpdatePath } from '@api/adminApi/permission'
import { PermissionMenuByMenuIdPath } from '@api/adminApi/permissionMenu'
import { MessageBox } from 'element-ui'

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
      dialogPermissionViewFormVisible: false,
      position: 'left',
      permissionInfo: {},
      permissionViewInfo: {},
      isUpdate: false,
      isView: false,
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
      permissionList: [],
      currentCheckedId: {},
      i: 0
    }
  },
  mounted () {
    let _self = this
    _self.getListAll()
  },
  methods: {
    ...mapActions('cloudAdmin/menu', ['menuTree']),
    ...mapActions('cloudAdmin/permission', ['permissionSave', 'permissionUpdate', 'permissionUnBinding']),
    ...mapActions('cloudAdmin/permissionMenu', ['permissionMenuByMenuId']),
    /**
     * 获取菜单集
     */
    getListAll () {
      let _self = this
      let url = MenusTreePath + '/' + 0
      _self.menuTree({ url: url, data: null }).then(result => {
        _self.datamenuList = result
      })
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
     * 选中change
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
     * 选中
     * @param data
     * @param node
     */
    handleNodeCheckClickEvent (data, node) {
      let _self = this
      let info = JSON.parse(JSON.stringify(data))
      _self.currentCheckedId = info.id
      _self.permissionMenuByMenuIdHandler(info.id)
    },
    /**
     * 保存
     */
    handleSaveEvent () {
      let _self = this
      this.$refs.permissionForm.validate((valid) => {
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
     * 根据菜单id获取权限
     */
    permissionMenuByMenuIdHandler (meuId) {
      let _self = this
      if (meuId) {
        let url = PermissionMenuByMenuIdPath + '/' + meuId
        _self.permissionMenuByMenuId({ url: url, data: '' }).then(result => {
          _self.permissionList = result
        })
      }
    },
    /**
     * 表格查看
     */
    handlerView (row) {
      let _self = this
      let menu = row.systemMenuVO
      let permission = row.systemPermissionVO
      _self.permissionInfo = {
        name: permission.name,
        enname: permission.enname,
        menuName: menu.name,
        url: permission.url,
        description: permission.description,
        id: permission.id
      }
      _self.isView = true
      _self.dialogPermissionFormVisible = true
    },
    /**
     *编辑
     */
    handleEdit (row) {
      let _self = this
      let menu = row.systemMenuVO
      let permission = row.systemPermissionVO
      _self.permissionInfo = {
        name: permission.name,
        enname: permission.enname,
        menuName: menu.name,
        url: permission.url,
        description: permission.description,
        id: permission.id
      }
      _self.isUpdate = true
      _self.isView = false
      _self.dialogPermissionFormVisible = true
    },
    /**
     * 删除
     */
    handleRemove (row) {
      let _self = this
      MessageBox.confirm('是否删除该数据', '删除', {
        type: 'warning'
      }).then(() => {
        let id = row.systemPermissionVO.id
        let menuId = row.systemMenuVO.id
        _self.remove(id, menuId)
      })
    },
    /**
     * 保存
     */
    save () {
      let _self = this
      let info = JSON.parse(JSON.stringify(_self.permissionInfo))
      let url = PermissionSavePath
      _self.permissionSave({ url: url, data: info }).then(result => {
        _self.dialogPermissionFormVisible = false
        _self.permissionInfo = {}
        _self.permissionMenuByMenuIdHandler(_self.currentCheckedId)
      })
    },
    update () {
      let _self = this
      let info = JSON.parse(JSON.stringify(_self.permissionInfo))
      let url = PermissionUpdatePath + '/' + info.id
      _self.permissionUpdate({ url: url, data: info }).then(result => {
        _self.dialogPermissionFormVisible = false
        _self.permissionInfo = {}
        _self.permissionMenuByMenuIdHandler(_self.currentCheckedId)
      })
    },
    /**
     * 删除
     */
    remove (id, menuId) {
      let _self = this
      if (id && menuId) {
        let url = PermissionUnBindingPath + '/' + id + '/' + menuId
        _self.permissionUnBinding({ url: url, data: null }).then(result => {
          _self.dialogPermissionFormVisible = false
          _self.permissionInfo = {}
          _self.permissionMenuByMenuIdHandler(_self.currentCheckedId)
        })
      }
    }
  }
}
</script>
<style></style>
