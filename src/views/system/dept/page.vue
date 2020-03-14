<template>
  <d2-container class="page">
    <el-col :span="10">
      <el-card shadow="never">
        <div slot="header">
          <el-button type="primary" size="medium" @click="handlerAddNew" icon="el-icon-plus" plain>添加</el-button>
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
                   :model="deptInfo"
                   label-width="auto"
                   center
                   :label-position="labelPosition"
                   :rules="rules"
                   required-asterisk>
            <el-form-item label="上级组织编码">
              <el-input v-model="deptInfo.parentNumber" effect="dark" content="-1为顶级组织" placement="top"
                        :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="组织编码" prop="number" required>
              <el-input clearable v-model="deptInfo.number"></el-input>
            </el-form-item>
            <el-form-item label="组织名称" prop="name" required>
              <el-input clearable v-model="deptInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="负责人">
              <el-input clearable v-model="deptInfo.leader"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input clearable v-model="deptInfo.phone"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input clearable v-model="deptInfo.email"></el-input>
            </el-form-item>
            <el-form-item label="是否启用" prop="isEnabled" required>
              <el-radio-group v-model="deptInfo.isEnabled" size="medium">
                <el-radio border label="1">启用</el-radio>
                <el-radio border label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="排序">
              <el-input-number v-model="deptInfo.order" :min="0" step-strictly></el-input-number>
            </el-form-item>
          </el-form>
          <div>
            <el-button type="primary" size="medium" @click="handlerSave" plain class="button" v-if="!isUpdate">新增
            </el-button>
            <el-button type="primary" size="medium" plain class="button" @click="handlerUpdate" v-if="isUpdate">修改
            </el-button>
          </div>
        </div>

      </el-card>
    </el-col>
  </d2-container>
</template>
<script> import { mapActions } from 'vuex'
import { DeptSavePath, DeptTreePath, DeptUpdatePath } from '@api/adminApi/dept'

export default {
  data () {
    return {
      treeData: [],
      treeProps: {
        children: 'children',
        label: 'name'
      },
      buttonForm: {},
      deptInfo: {
        parentId: -1,
        parentNumber: -1,
        order: 0,
        isEnabled: '1'
      },
      labelPosition: 'left',
      cardTitle: '新增',
      isUpdate: false,
      // 表单校验
      rules: {
        number: [{
          required: true,
          message: '请输入组织编码',
          trigger: 'blur'
        }
        ],
        name: [{
          required: true,
          message: '请输入组织名称',
          trigger: 'blur'
        }],
        isEnabled: [{
          required: true,
          message: '请选择是否启用',
          trigger: 'blur'
        }]
      },
      i: 0
    }
  },
  mounted () {
    let _self = this
    _self.getTree()
  },
  methods: {
    ...mapActions('cloudAdmin/dept', ['deptTree', 'deptSave', 'deptUpdate']),
    getTree () {
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
    handleNodeCheckClickEvent (data, node) {
      let _self = this
      _self.deptInfo = {
        id: data.id,
        parentId: data.parentId,
        number: data.number,
        name: data.name,
        leader: data.leader,
        phone: data.phone,
        email: data.email,
        isEnabled: data.isEnabled + '',
        order: data.order
      }
      _self.isUpdate = true
    },
    /**
     * 新增
     */
    handlerAddNew () {
      let _self = this
      let nodes = this.$refs.tree.getCheckedNodes()
      if (nodes.length > 1) {
        _self.$message.error('请选择菜单(有且只有一个)')
      } else if (nodes.length < 1) {
        _self.isUpdate = false
        _self.deptInfo = {
          parentId: -1,
          parentNumber: -1,
          order: 0,
          isEnabled: '1'
        }
      } else {
        let node = nodes[0]
        let currentData = node
        _self.isUpdate = false
        _self.deptInfo = {
          parentId: currentData.id,
          parentNumber: currentData.number,
          order: 0,
          isEnabled: '1'
        }
      }
    },
    /**
     * 新增
     */
    handlerSave () {
      let _self = this
      if (_self.deptInfo.parentNumber === -1) {
        _self.deptInfo.parentId = -1
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
    /**
     * 更新
     */
    handlerUpdate () {
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
    save () {
      let _self = this
      let params = JSON.parse(JSON.stringify(_self.deptInfo))
      let url = DeptSavePath
      _self.deptSave({ url: url, data: params }).then(result => {
        let code = result.errCode
        if (code !== 200) {
          _self.$message.error(result.data)
        } else {
          _self.getTree()
          _self.handlerAddNew()
        }
      })
    },
    update () {
      let _self = this
      let params = JSON.parse(JSON.stringify(_self.deptInfo))
      let url = DeptUpdatePath + '/' + _self.deptInfo.id
      _self.deptUpdate({ url: url, data: params }).then(result => {
        let code = result.errCode
        if (code !== 200) {
          _self.$message.error(result.data)
        } else {
          _self.getTree()
          _self.handlerAddNew()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .button {
    float: right;
  }
</style>
