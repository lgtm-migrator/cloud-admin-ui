<template>
  <d2-container class="page">
    <div class="avue-crud__menu">
      <div>
        <button type="button" class="el-button el-button--primary el-button--small">
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
  </d2-container>
</template>
<script>import { mapActions } from 'vuex'
import { MenusByParentIdPath } from '@api/adminApi/menu'
import router from '@/router'

export default {
  data () {
    return {
      dataList: []
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
