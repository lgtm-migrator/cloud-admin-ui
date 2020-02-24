<template>
  <d2-container class="page">
    <div class="avue-crud__menu">
      <div>
        <button type="button" class="el-button el-button--primary el-button--small">
          <i class="el-icon-plus"></i>
          <span @click="handleAddNew">新 增</span>
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
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChild'}">
      <el-table-column
        type="index"
        label="#"
        width="50">
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="url"
        label="菜单路径"
        width="180">
      </el-table-column>
      <el-table-column
        prop="icon"
        label="菜单图标">
      </el-table-column>
    </el-table>
    <el-dialog title="菜单信息" width="60%" :visible.sync="dialogFormVisible">
      <el-form ref="menuInfoForm" :inline="true" label-width="auto" :model="menuInfo" required-asterisk
               :rules="rules"
               :label-position="position">
        <el-row>
          <el-col :md="12"
                  :xs="24"
                  :offset="0"
                  style="padding-left:10px;padding-right:10px">
            <el-form-item label="名称" prop="name">
              <el-input v-model="menuInfo.name" placeholder="名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12"
                  :xs="24"
                  :offset="0"
                  style="padding-left:10px;padding-right:10px">
            <el-form-item label="路径" prop="url">
              <el-input v-model="menuInfo.url" placeholder="路径" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12"
                  :xs="24"
                  :offset="0"
                  style="padding-left:10px;padding-right:10px">
            <el-form-item label="上级菜单" prop="parentId">
              <el-cascader v-model="menuInfo.parentId" :options="menuTreeInfo" filterable
                           clearable></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :md="12"
                  :xs="24"
                  :offset="0"
                  style="padding-left:10px;padding-right:10px">
            <el-form-item label="图标" prop="icon">
              <el-input v-model="menuInfo.icon" placeholder="图标" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="innerVisible = true">保存</el-button>
        <el-button @click="outerVisible = false">取 消</el-button>
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
      position: 'left',
      dataList: [],
      dialogFormVisible: true,
      menuInfo: {},
      rules: {},
      menuTreeInfo: []
    }
  },
  mounted () {
    let _self = this
    _self.getMenusByParentId(0)
  },
  methods: {
    ...mapActions('cloudAdmin/menu', ['menuList']),
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
          _self.dataList = result.data
        }
      })
    },
    load (tree, treeNode, resolve) {
      let _self = this
      let id = tree.id
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
    },
    /**
     * 新增
     */
    handleAddNew () {
      this.$refs.d2Crud.showDialog({
        mode: 'add'
      })
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

  .avue-form__menu--right {
    text-align: right;
  }

  .avue-form__menu {
    width: 100%;
    padding: 5px 10px 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
