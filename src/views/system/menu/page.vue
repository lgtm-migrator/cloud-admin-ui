<template>
  <d2-container class="page">
    <div class="avue-crud__menu">
      <div>
        <button type="button" class="el-button el-button--primary el-button--small" @click="handleAddNew">
          <i class="el-icon-plus"></i>
          <span>新 增</span>
        </button>
      </div>
      <div>
        <button type="button" class="el-button el-tooltip el-button--default el-button--small is-circle"
                aria-describedby="el-tooltip-177" tabindex="0">
          <i class="el-icon-refresh"></i>
        </button>
      </div>
    </div>
    <el-table
      :data="dataList"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="loadNode"
      :tree-props="{children: 'children', hasChildren: 'hasChild'}"
      :header-cell-style="{'text-align':'center'}"
      highlight-current-row
      @expand-change="tableExpandChange"
      :fit="true"
      ref="tableDom">
      <el-table-column
        type="index"
        label="#">
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        sortable
        resizable
        :show-overflow-tooltip="true"
        align="center">
      </el-table-column>
      <el-table-column
        prop="enname"
        label="英文菜单名称"
        sortable
        resizable
        :show-overflow-tooltip="true"
        align="center">
      </el-table-column>
      <el-table-column
        prop="url"
        label="菜单路径"
        sortable
        resizable
        :show-overflow-tooltip="true"
        align="center">
      </el-table-column>
      <el-table-column
        prop="icon"
        label="菜单图标"
        sortable
        resizable
        :show-overflow-tooltip="true"
        align="center">
        <template slot-scope="scope">
          <i :class='scope.row.icon'></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序"
        sortable
        resizable
        :show-overflow-tooltip="true"
        align="center">
      </el-table-column>
      <el-table-column
        prop="description"
        label="说明"
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
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="菜单信息" width="60%" :visible.sync="dialogFormVisible"
               :before-close="handleDialogClose">
      <el-form ref="menuInfoForm" :inline="true" label-width="auto" :model="menuInfo" required-asterisk
               :rules="rules"
               :label-position="position">
        <el-row>
          <el-col :md="12"
                  :xs="24"
                  :offset="0"
                  style="padding-left:10px;padding-right:10px">
            <el-form-item required label="名称" prop="name">
              <el-input v-model="menuInfo.name" placeholder="名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12"
                  :xs="24"
                  :offset="0"
                  style="padding-left:10px;padding-right:10px">
            <el-form-item label="英文名称" prop="enname">
              <el-input v-model="menuInfo.enname" placeholder="英文名称" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12"
                  :xs="24"
                  :offset="0"
                  style="padding-left:10px;padding-right:10px">
            <el-form-item required label="路径" prop="url">
              <el-input v-model="menuInfo.url" placeholder="路径" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12"
                  :xs="24"
                  :offset="0"
                  style="padding-left:10px;padding-right:10px">
            <el-form-item label="上级菜单" prop="parentId">
              <el-cascader v-model="menuInfo.parentId" :key="cascaderKey"
                           :props="optionProps" :options="menuTreeInfo" filterable
                           clearable></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12"
                  :xs="24"
                  :offset="0"
                  style="padding-left:10px;padding-right:10px">
            <el-form-item label="图标" prop="icon">
              <e-icon-picker v-model="menuInfo.icon" clearable/>
              <!--<el-input v-model="menuInfo.icon" placeholder="图标" clearable></el-input>-->
            </el-form-item>
          </el-col>
          <el-col :md="12"
                  :xs="24"
                  :offset="0"
                  style="padding-left:10px;padding-right:10px">
            <el-form-item label="排序" prop="sort">
              <el-input-number controls-position="right" v-model="menuInfo.sort" placeholder="排序"
                               clearable></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12"
                  :xs="24"
                  :offset="0"
                  style="padding-left:10px;padding-right:10px">
            <el-form-item label="备注" prop="description">
              <el-input type="textarea" v-model="menuInfo.description" placeholder="备注" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12"
                  :xs="24"
                  :offset="0"
                  style="padding-left:10px;padding-right:10px">
            <el-form-item label="是否启用" prop="isEnabled">
              <el-radio-group v-model="menuInfo.isEnabled">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="handleDialogClose">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="菜单信息" width="60%" :visible.sync="dialogViewVisible">
      <el-form disabled :inline="true" label-width="auto" :model="viewInfo"
               :label-position="position">
        <el-row>
          <el-col :md="12"
                  :xs="24"
                  :offset="0"
                  style="padding-left:10px;padding-right:10px">
            <el-form-item required label="名称" prop="name">
              <el-input v-model="viewInfo.name" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12"
                  :xs="24"
                  :offset="0"
                  style="padding-left:10px;padding-right:10px">
            <el-form-item label="英文名称" prop="enname">
              <el-input v-model="viewInfo.enname" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12"
                  :xs="24"
                  :offset="0"
                  style="padding-left:10px;padding-right:10px">
            <el-form-item required label="路径" prop="url">
              <el-input v-model="viewInfo.url" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12"
                  :xs="24"
                  :offset="0"
                  style="padding-left:10px;padding-right:10px">
            <el-form-item label="上级菜单" prop="parentId">
              <el-cascader v-model="viewInfo.parentId" :key="Math.random()"
                           :show-all-levels="false" :props="optionProps" placeholder="-1"
                           :options="menuTreeInfo"
                           filterable
                           clearable></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12"
                  :xs="24"
                  :offset="0"
                  style="padding-left:10px;padding-right:10px">
            <el-form-item label="图标" prop="icon">
              <el-input v-model="viewInfo.icon" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12"
                  :xs="24"
                  :offset="0"
                  style="padding-left:10px;padding-right:10px">
            <el-form-item label="排序" prop="sort">
              <el-input v-model="viewInfo.sort" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12"
                  :xs="24"
                  :offset="0"
                  style="padding-left:10px;padding-right:10px">
            <el-form-item label="备注" prop="description">
              <el-input type="textarea" v-model="viewInfo.description" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12"
                  :xs="24"
                  :offset="0"
                  style="padding-left:10px;padding-right:10px">
            <el-form-item label="是否启用" prop="isEnabled">
              <el-radio-group v-model="viewInfo.isEnabled">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </d2-container>
</template>
<script>import { mapActions } from 'vuex'
import {
  MenuRemovePath,
  MenuSavePath,
  MenusByParentIdPath,
  MenusTreePath,
  MenuUpdateByIdPath
} from '@api/adminApi/menu'
import router from '@/router'

export default {
  data () {
    return {
      position: 'left',
      dataList: [],
      dialogFormVisible: false,
      dialogViewVisible: false,
      viewInfo: {},
      menuInfo: {},
      cascaderKey: '',
      rules: {
        name: [{
          required: true,
          message: '请输入菜单名称',
          trigger: 'blur'
        }],
        url: [{
          required: true,
          message: '请输入菜单路径',
          trigger: 'blur'
        }]
      },
      menuTreeInfo: [],
      optionProps: {
        value: 'id',
        label: 'name',
        children: 'childrens',
        checkStrictly: true

      },
      isUpdate: false,
      loadNodeMap: new Map()
    }
  },
  mounted () {
    let _self = this
    _self.getMenusByParentId(0)
    _self.MenusTreeAll(0)
  },
  methods: {
    ...mapActions('cloudAdmin/menu', ['menuList', 'menuTree', 'menuSave', 'menuUpdateById', 'menuRemove']),
    handleDialogClose (done) {
      let _self = this
      this.$confirm('确认关闭？')
        .then(_ => {
          _self.menuInfo = {}
          _self.dialogFormVisible = false
          done()
        })
        .catch(_ => {
        })
    },
    /**
     * 获取菜单集
     */
    getMenusByParentId (params) {
      let _self = this
      let url = MenusByParentIdPath + '/' + params
      _self.menuList({ url: url, data: '' }).then(result => {
        _self.dataList = result
      })
    },
    loadNode (tree, treeNode, resolve) {
      let _self = this
      let id = tree.id
      _self.loadNodeMap.set(id, { tree, treeNode, resolve })
      let url = MenusByParentIdPath + '/' + id
      _self.menuList({ url: url, data: '' }).then(result => {
        resolve(result)
      })
    },
    /**
     *
     */
    MenusTreeAll: function (type) {
      let url = MenusTreePath + '/' + type
      let _self = this
      _self.menuTree({ url: url, data: null }).then(result => {
        _self.menuTreeInfo = result
      })
    },
    /**
     * 新增
     */
    handleAddNew () {
      let _self = this
      _self.menuInfo = {}
      _self.isUpdate = false
      _self.dialogFormVisible = true
    },
    /**
     * 保存
     */
    handleSave () {
      let _self = this
      this.$refs.menuInfoForm.validate((valid) => {
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
     * 保存
     */
    save () {
      let _self = this
      let info = JSON.parse(JSON.stringify(_self.menuInfo))
      if (info.parentId) {
        if (Array.isArray(info.parentId)) {
          info.parentId = info.parentId[info.parentId.length - 1]
        }
      } else {
        info.parentId = 0
      }
      let url = MenuSavePath
      _self.menuSave({ url: url, data: info }).then(result => {
        if (info.parentId == 0) {
          _self.getMenusByParentId(0)
        } else {
          if (_self.loadNodeMap.get(info.parentId)) {
            const { tree, treeNode, resolve } = _self.loadNodeMap.get(info.parentId)
            if (tree) {
              _self.loadNode(tree, treeNode, resolve)
            }
          }
        }
        _self.MenusTreeAll(0)
        _self.menuInfo = {}
        _self.dialogFormVisible = false
      })
    },
    /**
     * 修改
     */
    update () {
      let _self = this
      let info = JSON.parse(JSON.stringify(_self.menuInfo))
      if (info.parentId) {
        if (Array.isArray(info.parentId)) {
          info.parentId = info.parentId[info.parentId.length - 1]
        }
      } else {
        info.parentId = 0
      }
      let url = MenuUpdateByIdPath + '/' + info.id
      _self.menuUpdateById({ url: url, data: info }).then(result => {
        if (info.parentId == 0) {
          _self.getMenusByParentId(0)
        } else {
          this.$set(this.$refs.tableDom.store.states.lazyTreeNodeMap, info.id, [])
          const { tree, treeNode, resolve } = this.loadNodeMap.get(info.id)
          _self.loadNode(tree, treeNode, resolve)
        }
        _self.MenusTreeAll(0)
        _self.menuInfo = {}
        _self.dialogFormVisible = false
      })
    },
    /**
     * 删除
     */
    remove () {

    },
    /**
     * 查看
     */
    handlerView (row) {
      let _self = this
      _self.viewInfo = row
      _self.dialogViewVisible = true
    },
    /**
     * 编辑
     * @param row
     */
    handleEdit (row) {
      let _self = this
      let info = JSON.parse(JSON.stringify(row))
      _self.menuInfo = info
      _self.dialogFormVisible = true
      _self.isUpdate = true
    },
    /**
     * 删除
     */
    handleRemove (row) {
      let _self = this
      let info = JSON.parse(JSON.stringify(row))
      _self.$confirm('确认删除？')
        .then(_ => {
          let id = info.id
          let url = MenuRemovePath + '/' + id
          _self.menuRemove({ url: url, data: null }).then(result => {
            if (info.parentId == 0) {
              _self.getMenusByParentId(0)
            } else {
              this.$set(this.$refs.tableDom.store.states.lazyTreeNodeMap, info.parentId, [])
              const { tree, treeNode, resolve } = this.loadNodeMap.get(info.parentId)
              _self.loadNode(tree, treeNode, resolve)
            }
            this.cascaderKey = String(new Date().getTime())
            _self.MenusTreeAll(0)
          })
        })
        .catch(_ => {
        })
    },
    /**
     *
     */
    tableExpandChange (row, expanded) {
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

  .ui-fas {
    width: 80%;
  }
</style>
