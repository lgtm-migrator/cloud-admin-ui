<template>
  <d2-container class="page">
    <el-form ref="searchForm" :model="searchForm" size="mini" :inline="true" :label-position="position">
      <el-form-item>
        <el-input v-model="searchForm.id" placeholder="路由id" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.description" placeholder="路由名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.uri" placeholder="转换目标uri" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.isEnabled" placeholder="是否启用" clearable>
          <el-option
            v-for="item in isEnabledOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleSearch">查询</el-button>
        <el-button type="primary" @click="addNew">新增</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="2">
      <el-col :xs="10">
        <el-table :data="routerList" style="width: 100%;" border :fit="true"
                  :header-cell-style="{'text-align':'center'}">
          <el-table-column prop="id" label="路由id" sortable resizable :show-overflow-tooltip="true"
                           align="center"></el-table-column>
          <el-table-column prop="description" label="说明" sortable resizable :show-overflow-tooltip="true"
                           align="center"></el-table-column>
          <el-table-column prop="predicates" label="断言(json)" sortable resizable
                           :show-overflow-tooltip="true"
                           align="center"></el-table-column>
          <el-table-column prop="filters" label="路由过滤器(JSON)" sortable resizable
                           :show-overflow-tooltip="true"
                           align="center"></el-table-column>
          <el-table-column prop="uri" label="转发的目标uri" sortable resizable :show-overflow-tooltip="true"
                           align="center"></el-table-column>
          <el-table-column prop="order" label="执行顺序" sortable resizable :show-overflow-tooltip="true"
                           align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" sortable resizable :show-overflow-tooltip="true"
                           align="center"></el-table-column>
          <el-table-column label="操作" sortable resizable :show-overflow-tooltip="true"
                           align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="handleEdit(scope.$index, scope.row)" size="mini">
                <i class="el-icon-edit"></i>
                编辑
              </el-button>
              <el-button type="text" @click="handleRemove(scope.$index,scope.row)" size="mini">
                <i class="el-icon-delete"></i>
                删除
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
    <el-dialog title="路由信息" :visible.sync="dialogFormVisible" center>
      <el-form ref="routerForm" :model="routerInfo" required-asterisk label-width="auto" :rules="rules"
               :label-position="position"
               center>
        <el-form-item required prop="description" label="路由说明">
          <el-input v-model="routerInfo.description" clearable></el-input>
        </el-form-item>
        <el-form-item label="断言(JSON)" prop="predicates">
          <el-input type="textarea" v-model="routerInfo.predicates" clearable></el-input>
        </el-form-item>
        <el-form-item label="路由过滤器(JSON)" prop="filters">
          <el-input type="textarea" v-model="routerInfo.filters" clearable></el-input>
        </el-form-item>
        <el-form-item required label="转发目标Uri" prop="uri">
          <el-input v-model="routerInfo.uri" clearable></el-input>
        </el-form-item>
        <el-form-item required label="执行顺序" prop="order">
          <el-input v-model.number="routerInfo.order" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="isEnabled">
          <el-radio-group v-model="routerInfo.isEnabled">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>
<script> import { mapActions } from 'vuex'
import { routerRemovePath, routerSavePath, routersPath, routerUpdatePath } from '@api/adminApi/router'
import router from '@/router'
import { MessageBox } from 'element-ui'

export default {
  data: function () {
    return {
      isEnabledOptions: [{
        value: 1,
        label: '启用'
      }, {
        value: 0,
        label: '禁用'
      }],
      position: 'left',
      dialogFormVisible: false,
      // 查询条件
      searchForm: {
        description: '',
        id: '',
        uri: '',
        isEnabled: ''
      },
      // 路由集
      routerList: [],
      // 路由详情
      routerInfo: {
        order: 0,
        description: '',
        predicates: '',
        filters: '',
        uri: '',
        isEnabled: ''
      },
      isUpdate: false,
      // 分页
      pages: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      // 表单校验
      rules: {
        description: [{
          required: true,
          message: '请输入路由说明',
          trigger: 'blur'
        }
        ],
        uri: [{
          required: true,
          message: '请输入转发目标uri',
          trigger: 'blur'
        }],
        order: [{
          required: true,
          message: '请输入执行顺序',
          trigger: 'blur'
        }]
      }
    }
  },
  mounted () {
    this.getRouters()
  },
  methods: {
    ...mapActions('cloudAdmin/router', ['routers', 'addRouter', 'updateRouter', 'removeRouter']),
    /**
     * 路由集
     */
    getRouters: function () {
      let _self = this
      let routers = routersPath + '/' + _self.pages.page + '/' + _self.pages.pageSize
      let search = JSON.parse(JSON.stringify(_self.searchForm))
      this.routers({ url: routers, data: search }).then(result => {
        if (result.errCode === 514) {
          _self.$message.error(result.data)
          router.push({
            name: 'login'
          })
        } else if (result.errCode !== 200) {
          _self.$message.error(result.data)
          return null
        }
        _self.routerList = result.data.list
        _self.pages.total = result.data.total
      })
    },
    /**
     * 查询
     */
    handleSearch: function () {
      let _self = this
      _self.getRouters()
    },
    /**
     *  断言
     * @param row
     * @param column
     * @returns {string}
     */
    toJsonPredicates: function (row, column) {
      return JSON.stringify(row.predicates)
    },
    /**
     * 过滤
     * @param row
     * @param column
     * @returns {string}
     */
    toJsonFilters: function (row, column) {
      return JSON.stringify(row.filters)
    },
    handleSizeChange (val) {
      this.pages.pageSize = val
      this.getRouters()
    },
    handleCurrentChange (Page) {
      this.pages.page = Page
      this.getRouters()
    },
    /**
     * 新增
     */
    addNew: function () {
      let _self = this
      _self.setRouterInfoIsNull()
      _self.dialogFormVisible = true
      _self.isUpdate = false
    },
    /**
     *编辑
     */
    handleEdit: function (index, row) {
      let _self = this
      let info = row
      _self.routerInfo = info
      _self.dialogFormVisible = true
      _self.isUpdate = true
    },
    /**
     * 删除
     */
    handleRemove: function (index, row) {
      let _self = this
      MessageBox.confirm('是否删除该数据', '删除', {
        type: 'warning'
      }).then(() => {
        _self.remove(row.id)
      })
    },
    /**
     * 保存
     */
    submit: function () {
      let _self = this
      // 校验
      this.$refs.routerForm.validate((valid) => {
        if (valid) {
          let info = _self.routerInfo
          let predicates = info.predicates
          if (predicates) {
            let isJson = _self.isJson(predicates)
            if (!isJson) {
              this.$message.error('断言(JSON)格式不正确，请检查')
              return null
            }
          }
          let filters = info.filters
          if (filters) {
            let isJson = _self.isJson(filters)
            if (!isJson) {
              this.$message.error('路由过滤器(JSON)格式不正确，请检查')
              return null
            }
          }
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
    save: function () {
      let _self = this
      let info = JSON.parse(JSON.stringify(_self.routerInfo))
      _self.addRouter({ url: routerSavePath, data: info }).then(result => {
        if (result.errCode !== 200) {
          this.$message.error(result.data)
        } else {
          _self.dialogFormVisible = false
          _self.getRouters()
          _self.setRouterInfoIsNull()
        }
      })
    },
    /**
     * 修改
     */
    update: function () {
      let _self = this
      // let info = _self.routerInfo 为地址copy
      let info = JSON.parse(JSON.stringify(_self.routerInfo))
      _self.updateRouter({ url: routerUpdatePath, data: info }).then(result => {
        if (result.errCode !== 200) {
          this.$message.error(result.data)
        } else {
          _self.dialogFormVisible = false
          _self.getRouters()
          _self.setRouterInfoIsNull()
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    /**
     * 删除
     */
    remove: function (id) {
      let _self = this
      if (id) {
        let removePath = routerRemovePath + '/' + id
        _self.removeRouter({ url: removePath, data: null }).then(result => {
          if (result.errCode === 514) {
            _self.$message.error(result.data)
            router.push({
              name: 'login'
            })
          } else if (result.errCode !== 200) {
            _self.$message.error(result.data)
            return null
          }
          _self.getRouters()
        })
      }
    },
    /**
     * 判断是否为json
     * @param str
     */
    isJson: function (str) {
      if (typeof str === 'string') {
        try {
          var obj = JSON.parse(str)
          return !!(typeof obj === 'object' && obj)
        } catch (e) {
          return false
        }
      }
    },
    /**
     * 转json对象
     */
    toJsonObj: function (str) {
      if (!str) {
        return null
      }
      return JSON.parse(str)
    },
    /**
     * 转jsonstring
     * @param obj
     */
    toJsonString: function (obj) {
      if (!obj) {
        return null
      }
      return JSON.stringify(obj)
    },
    setRouterInfoIsNull: function () {
      let _self = this
      _self.routerInfo = {
        order: 0
      }
    }
  }
}

</script>

<style lang="scss" scoped>
</style>
