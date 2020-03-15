<template>
  <d2-container class="page">
    <el-form ref="searchForm" :model="searchPostForm" size="mini" :inline="true" :label-position="position">
      <el-form-item>
        <el-input v-model="searchPostForm.name" placeholder="岗位名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button plain>查询</el-button>
        <el-button type="primary" @click="handleAddNew" plain>新增</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="2">
      <el-col :xs="10">
        <el-table :data="postList" style="width: 100%;" border :fit="true"
                  :header-cell-style="{'text-align':'center'}">
          <el-table-column prop="code" label="岗位编码" sortable resizable :show-overflow-tooltip="true"
                           align="center"></el-table-column>
          <el-table-column prop="name" label="岗位名称" sortable resizable :show-overflow-tooltip="true"
                           align="center"></el-table-column>
          <el-table-column prop="describe" label="岗位描述" sortable resizable :show-overflow-tooltip="true"
                           align="center"></el-table-column>
          <el-table-column prop="isEnabled" label="岗位状态" sortable resizable :show-overflow-tooltip="true"
                           align="center">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.isEnabled ===1 ? 'success': 'danger'"
                disable-transitions>{{scope.row.isEnabled ===1? '启用':'禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" sortable resizable :show-overflow-tooltip="true"
                           align="center"></el-table-column>
          <el-table-column label="操作" sortable resizable :show-overflow-tooltip="true"
                           align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="handleEdit(scope.$index,scope.row)" size="mini">
                <i class="el-icon-edit"></i>
                编辑
              </el-button>
              <el-button type="text" @click="handleRemove(scope.$index,scope.row)" size="mini">
                <i class="el-icon-delete"></i>
                删除
              </el-button>
              <el-button type="text" @click="handlePostDept(scope.$index,scope.row)" size="mini">
                <i class="el-icon-plus"></i>
                组织
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
    <el-dialog title="岗位信息" :visible.sync="dialogFormVisible" center>
      <el-form ref="postForm" :model="postInfo" required-asterisk label-width="auto" :rules="rules"
               :label-position="position"
               center>
        <el-form-item required prop="code" label="岗位编码:">
          <el-input v-model="postInfo.code" clearable></el-input>
        </el-form-item>
        <el-form-item required prop="name" label="岗位名称:">
          <el-input v-model="postInfo.name" clearable></el-input>
        </el-form-item>
        <el-form-item prop="describe" label="岗位描述:">
          <el-input v-model="postInfo.describe" clearable></el-input>
        </el-form-item>
        <el-form-item prop="isEnabled" label="状态:">
          <el-radio-group v-model="postInfo.isEnabled">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button plain @click="dialogFormVisible = false">取 消</el-button>
        <el-button plain type="primary" @click="handleSave">保存</el-button>
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
        <el-button plain type="primary" @click="handlePostDeptSave">确定</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>
<script> import { mapActions } from 'vuex'
import { PostDeletePath, PostGetPagePath, PostSavePath, PostUpdatePath } from '@/api/adminApi/post'
import { PostDeptBindingPath, PostDeptGetBindingIdPath } from '@/api/adminApi/postDept'
import { DeptTreePath } from '@/api/adminApi/dept'
import { MessageBox } from 'element-ui'

export default {
  data: function () {
    return {
      searchPostForm: {},
      position: 'left',
      postList: [],
      treeData: [],
      treeProps: {
        children: 'children',
        label: 'name'
      },
      // 分页
      pages: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      isUpdate: false,
      dialogFormVisible: false,
      postInfo: {},
      // 表单校验
      rules: {
        code: [{
          required: true,
          message: '请输入岗位编码',
          trigger: 'blur'
        }
        ],
        name: [{
          required: true,
          message: '请输入岗位名称',
          trigger: 'blur'
        }]
      },
      dialogDeptFormVisible: false,
      currentPostId: '',
      bindingDeptList: []
    }
  },
  mounted () {
    let _self = this
    _self.posts()
  },
  methods: {
    ...mapActions('cloudAdmin/post', ['postSave', 'postGetPage', 'postDelete', 'postUpdate']),
    ...mapActions('cloudAdmin/postDept', ['postDeptGetBindingId', 'postDeptBinding']),
    ...mapActions('cloudAdmin/dept', ['deptTree']),
    /**
     * 岗位集
     */
    posts () {
      let _self = this
      let url = PostGetPagePath + '/' + _self.pages.page + '/' + _self.pages.pageSize
      let params = {}
      _self.postGetPage({ url: url, data: params }).then(result => {
        let code = result.errCode
        if (code != 200) {
          _self.$message.error(result.data)
        } else {
          _self.postList = result.data.list
          _self.pages.total = result.data.total
        }
      })
    },
    handleSizeChange (val) {
      this.pages.pageSize = val
    },
    handleCurrentChange (Page) {
      this.pages.page = Page
    },
    handleAddNew () {
      let _self = this
      _self.isUpdate = false
      _self.postInfo = {}
      _self.dialogFormVisible = true
    },
    handleSave () {
      let _self = this
      // 校验
      this.$refs.postForm.validate((valid) => {
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
    handleRemove (index, row) {
      let _self = this
      MessageBox.confirm('是否删除当前数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        _self.remove(row.id)
      }).catch(() => {
      })
    },
    handlePostDept (index, row) {
      let _self = this
      _self.currentPostId = row.id
      _self.getBinding(row.id)
    },
    handleEdit (index, row) {
      let _self = this
      _self.postInfo = JSON.parse(JSON.stringify(row))
      _self.dialogFormVisible = true
      _self.isUpdate = true
    },
    handlePostDeptSave () {
      let _self = this
      let keys = _self.$refs.tree.getCheckedKeys(false)
      if (!keys.length <= 0) {
        _self.bindingDept(_self.currentPostId, keys)
      } else {
        _self.dialogDeptFormVisible = false
      }
    },
    save () {
      let _self = this
      let params = JSON.parse(JSON.stringify(_self.postInfo))
      let url = PostSavePath
      _self.postSave({ url: url, data: params }).then(result => {
        let code = result.errCode
        if (code != 200) {
          _self.$message.error(result.data)
        } else {
          _self.dialogFormVisible = false
          _self.postInfo = {}
          _self.posts()
        }
      })
    },
    remove (id) {
      let _self = this
      if (id) {
        let url = PostDeletePath + '/' + id
        _self.postDelete({ url: url, data: null }).then(result => {
          let code = result.errCode
          if (code != 200) {
            _self.$message.error(result.data)
          } else {
            _self.dialogFormVisible = false
            _self.postInfo = {}
            _self.posts()
          }
        })
      }
    },
    update () {
      let _self = this
      let params = JSON.parse(JSON.stringify(_self.postInfo))
      if (params.id) {
        let url = PostUpdatePath + '/' + params.id
        _self.postUpdate({ url: url, data: params }).then(result => {
          let code = result.errCode
          if (code != 200) {
            _self.$message.error(result.data)
          } else {
            _self.dialogFormVisible = false
            _self.postInfo = {}
            _self.posts()
          }
        })
      }
    },
    getBinding (id) {
      let _self = this
      if (id) {
        let url = PostDeptGetBindingIdPath + '/' + id
        _self.postDeptGetBindingId({ url: url, data: null }).then(result => {
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
        let url = PostDeptBindingPath + '/' + postId
        _self.postDeptBinding({ url: url, data: params }).then(result => {
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

</style>
