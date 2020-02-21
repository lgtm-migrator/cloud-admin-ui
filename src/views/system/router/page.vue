<template>
  <d2-container class="page">
    <el-form ref="searchForm" :model="searchForm" size="mini" :inline="true" :label-position="position">
      <el-form-item>
        <el-input v-model="searchForm.id" placeholder="路由id"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.description" placeholder="路由名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.uri" placeholder="转换目标uri"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button>查询</el-button>
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
          <el-table-column prop="predicates" :formatter="toJsonPredicates" label="断言(json)" sortable resizable
                           :show-overflow-tooltip="true"
                           align="center"></el-table-column>
          <el-table-column prop="filters" :formatter="toJsonFilters" label="路由过滤器(JSON)" sortable resizable
                           :show-overflow-tooltip="true"
                           align="center"></el-table-column>
          <el-table-column prop="uri" label="转发的目标uri" sortable resizable :show-overflow-tooltip="true"
                           align="center"></el-table-column>
          <el-table-column prop="order" label="执行顺序" sortable resizable :show-overflow-tooltip="true"
                           align="center"></el-table-column>
          <el-table-column prop="createUserName" label="创建者" sortable resizable :show-overflow-tooltip="true"
                           align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" sortable resizable :show-overflow-tooltip="true"
                           align="center"></el-table-column>
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
        <el-form-item label="执行顺序" prop="order">
          <el-input v-model.number="routerInfo.order" clearable></el-input>
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
import { routerSavePath, routersPath } from '@api/adminApi/router'

export default {
  data: function () {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      position: 'left',
      dialogFormVisible: false,
      // 查询条件
      searchForm: {
        description: '',
        id: '',
        uri: ''
      },
      // 路由集
      routerList: [],
      // 路由详情
      routerInfo: {
        order: 0
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
        }]
      }
    }
  },
  mounted () {
    this.getRouters()
  },
  methods: {
    ...mapActions('cloudAdmin/router', ['routers', 'addRouter']),
    /**
     * 路由集
     */
    getRouters () {
      let _self = this
      this.routers({ url: routersPath, data: '' }).then(result => {
        _self.routerList = result
      })
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
    },
    handleCurrentChange (Page) {
    },
    /**
     * 新增
     */
    addNew: function () {
      let _self = this
      _self.dialogFormVisible = true
    },
    /**
     * 保存
     */
    submit: function () {
      let _self = this
      // 校验
      this.$refs.routerForm.validate((valid) => {
        if (valid) {
          let predicates = _self.routerInfo.predicates
          if (predicates) {
            let isJson = _self.isJson(predicates)
            if (!isJson) {
              this.$message.error('断言(JSON)格式不正确，请检查')
              return null
            } else {
              _self.routerInfo.predicates = JSON.parse(predicates)
            }
          }
          let filters = _self.routerInfo.filters
          if (filters) {
            let isJson = _self.isJson(filters)
            if (!isJson) {
              this.$message.error('路由过滤器(JSON)格式不正确，请检查')
              return null
            } else {
              _self.routerInfo.filters = JSON.parse(filters)
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
      console.log('保存用户')
      let _self = this
      _self.addRouter({ url: routerSavePath, data: _self.routerInfo }).then(result => {
        _self.getRouters()
      })
    },
    /**
     * 修改
     */
    update: function () {

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
    }
  }
}

</script>

<style lang="scss" scoped>
</style>
