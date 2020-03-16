<template>
  <d2-container class="page">
    <div class="avue-crud__menu">
      <div>
        <button type="button" @click="handleAdd" class="el-button el-button--primary el-button--small">
          <i class="el-icon-edit"></i>
          <span>添 加</span>
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
        <el-table :data="roleList" style="width: 100%;" border :fit="true"
                  highlight-current-row
                  :header-cell-style="{'text-align':'center'}">
          <el-table-column
            type="index"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="name"
            label="角色名称"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center">
          </el-table-column>
          <el-table-column
            prop="enname"
            label="角色标识"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center">
          </el-table-column>
          <el-table-column
            prop="description"
            label="角色说明"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center">
          </el-table-column>
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
              <el-button type="text" @click="handlePermission(scope.row)" size="mini">
                <i class="el-icon-plus"></i>
                权限
              </el-button>
              <el-button type="text" @click="handleDept(scope.row)" size="mini">
                <i class="el-icon-plus"></i>
                数据范围
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
    <el-dialog title="角色信息" :before-close="handleDialogClose" width="60%" :visible.sync="dialogRoleFormVisible">
      <el-form ref="roleInfoForm" lable-width="auto" :model="roleInfoForm" required-asterisk
               :rules="rules"
               :label-position="position"
               :disabled="isDisabled">
        <el-row :span="24">
          <el-form-item required label="角色名称" prop="name">
            <el-input v-model.number="roleInfoForm.name" autosize
                      placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-form-item required label="角色标识" prop="enname">
            <el-input v-model.number="roleInfoForm.enname" autosize
                      placeholder="请输入角色标识"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model.number="roleInfoForm.description" autosize
                      type="textarea" placeholder="请输入角色描述"></el-input>
          </el-form-item>
          <el-form-item label="是否启用" prop="isEnabled">
            <el-radio-group v-model="roleInfoForm.isEnabled">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!isDisabled" type="primary" @click="handlerSave"><i class="el-icon-circle-plus-outline"></i>保存
        </el-button>
        <el-button v-if="!isDisabled" @click="handleDialogClose"><i class="el-icon-circle-close"></i>取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="权限信息" :before-close="handlePermissionDialogClose" width="60%"
               :visible.sync="dialogPermissionFormVisible">
      <div style="max-height: 400px;
    overflow-y: auto;">
        <el-tree
          ref="tree"
          :data="permissionMenu"
          show-checkbox
          node-key="id"
          :props="defaultProps"
          default-expand-all>
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleUpdatePermission" type="primary">更新
        </el-button>
        <el-button @click="handleUpdatePermissionDialogClose">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="组织信息" :visible.sync="dialogDeptFormVisible" center>
      <el-tree :data="treeData"
               show-checkbox
               ref="tree"
               node-key="id"
               :props="treeProps"
               :highlight-current='true'
               default-expand-all
      >
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button plain @click="dialogDeptFormVisible = false">取 消</el-button>
        <el-button plain type="primary" @click="handleDeptSave">确定</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>
<script> import { mapActions } from 'vuex'
import { RoleListPath, RoleSavePath, RoleUpdatePath, RoleRemovePath } from '@api/adminApi/role'
import { PermissionMenuAllPath } from '@api/adminApi/permissionMenu'
import { RolePermissionSavePath, RolePermissionPermissionIdsPath } from '@api/adminApi/rolePermission'
import { MessageBox } from 'element-ui'
import { RoleDeptGetDeptIdByRoleIdPath, RoleDeptBinDingDeptByRoleIdPath } from '@/api/adminApi/roleDept'
import { DeptTreePath } from '@/api/adminApi/dept'

export default {
  data: function () {
    return {
      // 分页
      pages: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      roleList: [],
      dialogRoleFormVisible: false,
      dialogPermissionFormVisible: false,
      roleInfoForm: {},
      rules: {
        name: [{
          required: true,
          message: '请输入角色名称',
          trigger: 'blur'
        }],
        enname: [{
          required: true,
          message: '请输入角色标识',
          trigger: 'blur'
        }]
      },
      position: 'left',
      isUpdate: false,
      isDisabled: false,
      permissionMenu: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      currentRow: null,
      permissionIds: [],
      dialogDeptFormVisible: false,
      treeData: [],
      treeProps: {
        children: 'children',
        label: 'name'
      },
      bindingDeptList: []
    }
  },
  mounted () {
    this.rolePageList()
  },
  methods: {
    ...mapActions('cloudAdmin/role', ['roleListPage', 'roleSave', 'roleUpdate', 'roleRemove']),
    ...mapActions('cloudAdmin/permissionMenu', ['permissionMenuAll']),
    ...mapActions('cloudAdmin/rolePermission', ['rolePermissionSave', 'rolePermissionIds']),
    ...mapActions('cloudAdmin/roleDept', ['roleDeptGetDeptIdByRoleId', 'roleDeptBindingDeptByRoleId']),
    ...mapActions('cloudAdmin/dept', ['deptTree']),
    rolePageList () {
      let _self = this
      let url = RoleListPath + '/' + _self.pages.page + '/' + _self.pages.pageSize
      _self.roleListPage({ url: url, data: null }).then(result => {
        let code = result.errCode
        if (code !== 200) {
          _self.$message.error(result.data)
        } else {
          _self.roleList = result.data.list
          _self.pages.total = result.data.total
        }
      })
    },
    handleSizeChange (val) {
      this.pages.pageSize = val
      this.rolePageList()
    },
    handleCurrentChange (Page) {
      this.pages.page = Page
      this.rolePageList()
    },
    handleDialogClose () {
      let _self = this
      _self.roleInfoForm = {}
      _self.dialogRoleFormVisible = false
    },
    handlePermissionDialogClose () {
      let _self = this
      _self.dialogPermissionFormVisible = false
    },
    handleAdd () {
      let _self = this
      _self.roleInfoForm = {}
      _self.dialogRoleFormVisible = true
      _self.isDisabled = false
      _self.isUpdate = false
    },
    handlerSave () {
      let _self = this
      this.$refs.roleInfoForm.validate((valid) => {
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
    handlerView (row) {
      let _self = this
      _self.roleInfoForm = row
      _self.isDisabled = true
      _self.dialogRoleFormVisible = true
    },
    handleEdit (row) {
      let _self = this
      _self.roleInfoForm = row
      _self.isDisabled = false
      _self.dialogRoleFormVisible = true
      _self.isUpdate = true
    },
    handleRemove (row) {
      let _self = this
      let id = row.id
      MessageBox.confirm('是否删除该数据', '删除', {
        type: 'warning'
      }).then(() => {
        _self.remove(id)
      })
    },
    /**
     * 编辑权限
     */
    handlePermission (row) {
      let _self = this
      _self.currentrow = row
      _self.getPermissionMenuAll()
    },
    handleDept (row) {
      let _self = this
      _self.currentrow = row
      _self.getBindingDept(row.id)
    },
    handleDeptSave () {
      let _self = this
      let keys = _self.$refs.tree.getCheckedKeys(false)
      if (!keys.length <= 0) {
        _self.bindingDept(_self.currentrow.id, keys)
      } else {
        _self.dialogDeptFormVisible = false
      }
    },
    save () {
      let _self = this
      let info = JSON.parse(JSON.stringify(_self.roleInfoForm))
      let url = RoleSavePath
      _self.roleSave({ url: url, data: info }).then(result => {
        let code = result.errCode
        if (code !== 200) {
          _self.$message.error(result.data)
        } else {
          _self.roleInfoForm = {}
          _self.dialogRoleFormVisible = false
          _self.rolePageList()
        }
      })
    },
    update () {
      let _self = this
      let info = JSON.parse(JSON.stringify(_self.roleInfoForm))
      let url = RoleUpdatePath + '/' + info.id
      _self.roleUpdate({ url: url, data: info }).then(result => {
        let code = result.errCode
        if (code !== 200) {
          _self.$message.error(result.data)
        } else {
          _self.roleInfoForm = {}
          _self.dialogRoleFormVisible = false
          _self.rolePageList()
        }
      })
    },
    remove (id) {
      let _self = this
      if (id) {
        let url = RoleRemovePath + '/' + id
        _self.roleRemove({ url: url, data: null }).then(result => {
          let code = result.errCode
          if (code !== 200) {
            _self.$message.error(result.data)
          } else {
            _self.roleInfoForm = {}
            _self.dialogRoleFormVisible = false
            _self.rolePageList()
          }
        })
      }
    },
    /**
     * 获取菜单权限集
     */
    getPermissionMenuAll () {
      let _self = this
      let url = PermissionMenuAllPath
      _self.permissionMenuAll({ url: url, data: null }).then(result => {
        let code = result.errCode
        if (code !== 200) {
          _self.$message.error(result.data)
        } else {
          _self.permissionMenu = result.data
          _self.getPermissionIdsByRoleId(_self.currentrow.id)
        }
      })
    },
    /**
     * 属性根据key设置选中的node
     */
    setCheckedKeys () {
      let _self = this
      let permissions = _self.permissionIds
      if (permissions.length > 0) {
        _self.dialogPermissionFormVisible = true
        this.$nextTick(() => {
          _self.$refs.tree.setCheckedKeys(permissions, true)
        })
      }
    },
    /**
     * 获取当前选中
     */
    getCheckeds () {
      let _self = this
      return _self.$refs.tree.getCheckedNodes(true)
    },

    /**
     * 更新角色权限
     */
    handleUpdatePermission () {
      let _self = this
      let permissionMenu = _self.getCheckeds()
      let permissionId = []
      if (permissionMenu.length > 0) {
        permissionMenu.filter((item, i) => {
          if (item.type == 1) {
            permissionId.push(item.id)
          }
        })
      }
      _self.updatePermissionForRole(permissionId)
    },
    /**
     * 关闭
     */
    handleUpdatePermissionDialogClose () {
      let _self = this
      _self.dialogPermissionFormVisible = false
    },
    /**
     * 更新角色权限
     *
     */
    updatePermissionForRole (permissionIds) {
      let _self = this
      console.info(_self.currentrow)
      if (permissionIds.length <= 0) {
        _self.dialogPermissionFormVisible = false
      }
      let url = RolePermissionSavePath + '/' + _self.currentrow.id
      _self.rolePermissionSave({ url: url, data: permissionIds }).then(result => {
        let code = result.errCode
        if (code !== 200) {
          _self.$message.error(result.data)
        } else {
          _self.dialogPermissionFormVisible = false
        }
      })
    },
    /**
     * 根据角色id获取权限id
     * @param id
     */
    getPermissionIdsByRoleId (id) {
      let _self = this
      if (id) {
        let url = RolePermissionPermissionIdsPath + '/' + id
        _self.rolePermissionIds({ url: url, data: null }).then(result => {
          let code = result.errCode
          if (code !== 200) {
            _self.$message.error(result.data)
          } else {
            _self.permissionIds = result.data
            _self.setCheckedKeys()
          }
        })
      }
    },
    getBindingDept (id) {
      let _self = this
      if (id) {
        let url = RoleDeptGetDeptIdByRoleIdPath + '/' + id
        _self.roleDeptGetDeptIdByRoleId({ url: url, data: null }).then(result => {
          let code = result.errCode
          if (code != 200) {
            this.$message.error(result.data)
          } else {
            _self.bindingDeptList = result.data
            _self.getDeptTree()
          }
        })
      }
    },
    getDeptTree () {
      let _self = this
      let url = DeptTreePath
      _self.deptTree({ url: url, data: null }).then(result => {
        let code = result.errCode
        if (code != 200) {
          _self.$message.error(result.data)
        } else {
          _self.treeData = result.data
          this.$nextTick(() => {
            _self.$refs.tree.setCheckedKeys(_self.bindingDeptList, false)
          })
          _self.dialogDeptFormVisible = true
        }
      })
    },
    bindingDept (postId, deptIds) {
      if (postId) {
        let _self = this
        let params = JSON.parse(JSON.stringify(deptIds))
        let url = RoleDeptBinDingDeptByRoleIdPath + '/' + postId
        _self.roleDeptBindingDeptByRoleId({ url: url, data: params }).then(result => {
          let code = result.errCode
          if (code != 200) {
            _self.$message.error(result.data)
          } else {
            _self.dialogDeptFormVisible = false
          }
        })
      }
    }
  }
}
</script>
<style>
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
</style>
