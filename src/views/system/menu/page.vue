<template>
  <d2-container class="page">
    <el-col :span="10">
      <el-card shadow="never">
        <div slot="header">
          <el-button type="primary" size="medium" @click="handleAddNew" icon="el-icon-plus" plain>添加</el-button>
          <el-button type="danger" size="medium" @click="handleRemove" icon="el-icon-delete" plain>删除</el-button>
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
                   @check="handleNodeCheckClickEvent"
          >
          </el-tree>
        </div>
      </el-card>
    </el-col>
    <el-col :span="14">
      <el-card shadow="never">
        <div style="padding-top: 10%;">
          <el-form ref="form"
                   :model="menuInfo"
                   label-width="auto"
                   center
                   :label-position="position"
                   :rules="rules"
                   required-asterisk>
            <el-form-item label="上级菜单">
              <el-input v-model="menuInfo.parentName" effect="dark" content="-1顶级菜单" placement="top"
                        :disabled="true"></el-input>
            </el-form-item>
            <el-form-item required label="名称" prop="name">
              <el-input v-model="menuInfo.name" clearable></el-input>
            </el-form-item>
            <el-form-item label="英文名称" prop="enname">
              <el-input v-model="menuInfo.enname" clearable></el-input>
            </el-form-item>
            <el-form-item required label="路径" prop="url">
              <el-input v-model="menuInfo.url" clearable></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="icon">
              <e-icon-picker v-model="menuInfo.icon" clearable/>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input-number style="width: 100%" controls-position="right" v-model="menuInfo.sort" placeholder="排序"
                               clearable></el-input-number>
            </el-form-item>
            <el-form-item label="备注" prop="description">
              <el-input type="textarea" v-model="menuInfo.description" placeholder="备注" clearable></el-input>
            </el-form-item>
            <el-form-item label="是否启用" prop="isEnabled">
              <el-radio-group v-model="menuInfo.isEnabled">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div>
            <el-button type="primary" size="medium" @click="handleSaveMenu" plain class="button" v-if="!isUpdate">新增
            </el-button>
            <el-button type="primary" size="medium" @click="handleUpdateMenu" plain class="button" v-if="isUpdate">修改
            </el-button>
          </div>
        </div>
      </el-card>
    </el-col>
  </d2-container>
</template>
<script>import { mapActions } from 'vuex'
import { MenuRemovePath, MenuSavePath, MenusTreePath, MenuUpdateByIdPath } from '@api/adminApi/menu'
import { MessageBox } from 'element-ui'

export default {
  data () {
    return {
      position: 'left',
      treeData: [],
      treeProps: {
        children: 'childrens',
        label: 'name'
      },
      i: 0,
      menuInfo: {
        parentId: -1,
        parentName: -1,
        order: 0,
        isEnabled: 1
      },
      // 表单校验
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
      isUpdate: false
    }
  },
  mounted () {
    let _self = this
    _self.getListAll()
  },
  methods: {
    ...mapActions('cloudAdmin/menu', ['menuList', 'menuTree', 'menuSave', 'menuUpdateById', 'menuRemove', 'menuRemoveByIds']),
    /**
     * 获取菜单集
     */
    getListAll () {
      let _self = this
      let url = MenusTreePath + '/' + 0
      _self.menuTree({ url: url, data: null }).then(result => {
        _self.treeData = result
      })
    },
    /**
     * 选中change(单选)
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
      _self.menuInfo = {
        id: info.id,
        name: info.name,
        enname: info.enname,
        url: info.url,
        icon: info.icon,
        description: info.description,
        parentId: info.parentId,
        sort: info.sort,
        isEnabled: info.isEnabled
      }
      _self.isUpdate = true
    },
    /**
     * 修改
     */
    handleUpdateMenu () {
      let _self = this
      // 校验
      _self.$refs.form.validate((valid) => {
        if (valid) {
          if (_self.isUpdate) {
            _self.update()
          }
        } else {
          // 校验失败
          // 登录表单校验失败
          this.$message.error('表单校验失败，请检查')
        }
      })
    },
    /**
     * 修改
     */
    update () {
      let _self = this
      let params = JSON.parse(JSON.stringify(_self.menuInfo))
      let url = MenuUpdateByIdPath + '/' + params.id
      _self.menuUpdateById({ url: url, data: params }).then(result => {
        _self.getListAll()
        _self.menuInfo = {}
      })
    },
    /**
     * 新增
     */
    handleAddNew () {
      let _self = this
      let nodes = this.$refs.tree.getCheckedNodes()
      if (nodes.length > 1) {
        _self.$message.warning('请选择菜单(有且只有一个)')
      } else if (nodes.length < 1) {
        _self.isUpdate = false
        _self.menuInfo = {
          parentId: -1,
          parentName: -1,
          sort: 0,
          isEnabled: 1
        }
      } else {
        let node = nodes[0]
        let currentData = node
        _self.isUpdate = false
        _self.menuInfo = {
          parentId: currentData.id,
          parentName: currentData.name,
          sort: 0,
          isEnabled: 1
        }
      }
    },
    /**
     * 保存
     */
    handleSaveMenu () {
      let _self = this
      if (_self.menuInfo.parentName === -1) {
        _self.menuInfo.parentId = -1
      }
      // 校验
      _self.$refs.form.validate((valid) => {
        if (valid) {
          if (!_self.isUpdate) {
            _self.save()
          }
        } else {
          // 校验失败
          // 登录表单校验失败
          this.$message.error('表单校验失败，请检查')
        }
      })
    },
    save () {
      let _self = this
      let params = JSON.parse(JSON.stringify(_self.menuInfo))
      let url = MenuSavePath
      _self.menuSave({ url: url, data: params }).then(result => {
        _self.getListAll()
        _self.menuInfo = {}
      })
    },
    /**
     * 删除
     */
    handleRemove () {
      let _self = this
      let keys = _self.$refs.tree.getCheckedKeys()
      if (keys.length <= 0) {
        _self.$message.warning('请选择菜单')
      } else {
        MessageBox.confirm('是否删除该数据', '删除', {
          type: 'warning'
        }).then(() => {
          _self.remove(keys)
        })
      }
    },
    remove (keys) {
      let _self = this
      let url = MenuRemovePath
      let params = JSON.parse(JSON.stringify(keys))
      _self.menuRemoveByIds({ url: url, data: params }).then(result => {
        _self.getListAll()
        _self.menuInfo = {}
      })
    }
  }
}
</script>
<style>
  .button {
    float: right;
  }
</style>
