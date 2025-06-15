<template>
  <div class="generic-table-container">
    <!-- 表格标题与操作区 -->
    <div class="table-header mb-4">
      <h3 class="text-xl font-semibold text-gray-800">{{ title }}</h3>
      <div class="flex flex-wrap gap-2 mt-2">
        <slot name="header-actions">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            <span>添加</span>
          </el-button>
        </slot>
      </div>
    </div>

    <!-- 搜索与筛选区域 -->
    <div class="mb-4" v-if="showSearch || filters.length > 0">
      <div class="flex flex-wrap gap-2">
        <!-- 搜索框 -->
        <div v-if="showSearch" class="flex-grow max-w-md">
          <el-input
            v-model="searchQuery"
            placeholder="请输入关键词搜索..."
            prefix-icon="Search"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button icon="Refresh" size="small" @click="clearSearch"></el-button>
            </template>
          </el-input>
        </div>

        <!-- 筛选条件 -->
        <div v-for="filter in filters" :key="filter.key" class="flex-grow-0">
          <el-select
            v-model="filter.value"
            placeholder="请选择{{ filter.label }}"
            @change="handleFilterChange"
            size="small"
          >
            <el-option
              v-for="option in filter.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>

        <!-- 筛选按钮 -->
        <el-button
          type="primary"
          size="small"
          @click="handleFilterChange"
          v-if="filters.length > 0"
        >
          <el-icon><Filter /></el-icon>
          <span>筛选</span>
        </el-button>
      </div>
    </div>

    <!-- 表格主体 -->
    <div class="table-content">
      <el-table
        :data="tableData"
        :row-key="row => row[primaryKey]"
        :border="border"
        :stripe="stripe"
        :empty-text="loading ? '加载中...' : '暂无数据'"
        :height="height"
        :header-cell-style="{ 'background-color': '#f5f7fa' }"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
      >
        <!-- 选择列 -->
        <el-table-column
          type="selection"
          width="55"
          v-if="showSelection"
        />

        <!-- 索引列 -->
        <el-table-column
          type="index"
          width="60"
          v-if="showIndex"
          :index="indexMethod"
        />

        <!-- 自定义列 -->
        <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :sortable="column.sortable"
          :fixed="column.fixed"
          :align="column.align"
          :formatter="column.formatter"
        >
          <!-- 自定义内容 -->
          <template #content="{ row, column, $index }">
            <slot :name="`column-${column.property}`" :row="row" :column="column" :index="$index">
              <div v-if="column.type === 'image'">
                <el-image
                  :src="row[column.prop]"
                  :preview-src-list="[row[column.prop]]"
                  class="image-thumbnail"
                />
              </div>
              <div v-else-if="column.type === 'date'">
                {{ formatDate(row[column.prop]) }}
              </div>
              <div v-else-if="column.type === 'status'">
                <el-tag :type="getStatusType(row[column.prop])">{{ getStatusText(row[column.prop]) }}</el-tag>
              </div>
              <div v-else>
                {{ row[column.prop] }}
              </div>
            </slot>
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column
          label="操作"
          width="200"
          fixed="right"
          v-if="showActions"
          align="center"
        >
          <template #content="{ row }">
            <div class="flex justify-center gap-1">
              <!-- 查看 -->
              <el-button
                type="text"
                size="mini"
                @click="handleView(row)"
                v-if="showView"
              >
                <el-icon><Eye /></el-icon>
                <span>查看</span>
              </el-button>

              <!-- 编辑 -->
              <el-button
                type="text"
                size="mini"
                @click="handleEdit(row)"
                v-if="showEdit"
              >
                <el-icon><Edit /></el-icon>
                <span>编辑</span>
              </el-button>

              <!-- 删除 -->
              <el-button
                type="text"
                size="mini"
                @click="handleDelete(row)"
                v-if="showDelete"
              >
                <el-icon><Delete /></el-icon>
                <span>删除</span>
              </el-button>

              <!-- 下载 -->
              <el-button
                type="text"
                size="mini"
                @click="handleDownload(row)"
                v-if="showDownload"
              >
                <el-icon><Download /></el-icon>
                <span>下载</span>
              </el-button>

              <!-- 自定义操作 -->
              <slot name="actions" :row="row">
                <!-- 默认不显示其他操作 -->
              </slot>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div class="flex justify-between items-center mt-4">
        <div class="text-sm text-gray-500">
          共 {{ total }} 条记录，当前显示 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, total) }} 条
        </div>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
        />
      </div>
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      title="编辑"
      width="600px"
      :close-on-click-modal="false"
      @close="handleDialogClose"
    >
      <template #content>
        <el-form
          ref="editFormRef"
          :model="editForm"
          :rules="editRules"
          label-width="120px"
        >
          <el-form-item
            v-for="field in editFields"
            :key="field.prop"
            :label="field.label"
            :prop="field.prop"
          >
            <template v-if="field.type === 'input'">
              <el-input v-model="editForm[field.prop]" :placeholder="field.placeholder" />
            </template>
            <template v-if="field.type === 'select'">
              <el-select v-model="editForm[field.prop]" :placeholder="field.placeholder">
                <el-option
                  v-for="option in field.options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </template>
            <template v-if="field.type === 'date'">
              <el-date-picker
                v-model="editForm[field.prop]"
                type="date"
                :placeholder="field.placeholder"
              />
            </template>
            <template v-if="field.type === 'textarea'">
              <el-input v-model="editForm[field.prop]" type="textarea" :placeholder="field.placeholder" />
            </template>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, toRefs } from 'vue';
import {
  Plus,
  Search,
  Refresh,
  Filter,
  Eye,
  Edit,
  Delete,
  Download,
  Check,
  ArrowDown,
  Calendar,
  Image as ImageIcon,
  FileText,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Tag,
  More
} from '@element-plus/icons-vue';

// 定义组件 props
const props = defineProps({
  // 表格数据
  data: {
    type: Array,
    default: () => []
  },
  
  // 表格列配置
  columns: {
    type: Array,
    default: () => []
  },
  
  // 主键字段
  primaryKey: {
    type: String,
    default: 'id'
  },
  
  // 表格标题
  title: {
    type: String,
    default: '数据表格'
  },
  
  // 是否显示序号列
  showIndex: {
    type: Boolean,
    default: true
  },
  
  // 是否显示选择列
  showSelection: {
    type: Boolean,
    default: false
  },
  
  // 是否显示操作列
  showActions: {
    type: Boolean,
    default: true
  },
  
  // 是否显示查看按钮
  showView: {
    type: Boolean,
    default: true
  },
  
  // 是否显示编辑按钮
  showEdit: {
    type: Boolean,
    default: true
  },
  
  // 是否显示删除按钮
  showDelete: {
    type: Boolean,
    default: true
  },
  
  // 是否显示下载按钮
  showDownload: {
    type: Boolean,
    default: false
  },
  
  // 是否显示搜索框
  showSearch: {
    type: Boolean,
    default: true
  },
  
  // 筛选条件配置
  filters: {
    type: Array,
    default: () => []
  },
  
  // 编辑表单字段配置
  editFields: {
    type: Array,
    default: () => []
  },
  
  // 编辑表单验证规则
  editRules: {
    type: Object,
    default: () => ({})
  },
  
  // 是否有边框
  border: {
    type: Boolean,
    default: true
  },
  
  // 是否为斑马纹表格
  stripe: {
    type: Boolean,
    default: true
  },
  
  // 表格高度
  height: {
    type: [String, Number],
    default: null
  },
  
  // 初始页码
  currentPage: {
    type: Number,
    default: 1
  },
  
  // 每页条数
  pageSize: {
    type: Number,
    default: 10
  },
  
  // 数据总数
  total: {
    type: Number,
    default: 0
  },
  
  // 是否加载中
  loading: {
    type: Boolean,
    default: false
  },
  
  // 搜索字段
  searchField: {
    type: String,
    default: ''
  }
});

// 定义组件 emits
const emits = defineEmits([
  'view',
  'edit',
  'delete',
  'download',
  'add',
  'search',
  'filter-change',
  'pagination-change',
  'row-click',
  'selection-change',
  'save'
]);

// 响应式状态
const state = reactive({
  searchQuery: '',
  dialogVisible: false,
  editForm: {},
  selectedRows: [],
  tableData: props.data,
  currentPage: props.currentPage,
  pageSize: props.pageSize,
});

// 计算属性 - 过滤后的数据
const filteredData = computed(() => {
  // 简单的搜索过滤
  if (!state.searchQuery) {
    return state.tableData;
  }
  
  const query = state.searchQuery.toLowerCase();
  return state.tableData.filter(row => {
    if (props.searchField) {
      return row[props.searchField]?.toString().toLowerCase().includes(query);
    }
    
    // 遍历所有列进行搜索
    return Object.values(row).some(value => 
      value?.toString().toLowerCase().includes(query)
    );
  });
});

// 编辑表单引用
const editFormRef = ref(null);

// 方法定义
// 格式化日期
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString();
};

// 获取状态类型
const getStatusType = (status) => {
  const statusMap = {
    0: 'default',
    1: 'success',
    2: 'warning',
    3: 'danger',
    4: 'info',
    'pending': 'warning',
    'success': 'success',
    'error': 'danger',
    'processing': 'primary',
    'disabled': 'default'
  };
  
  return statusMap[status] || 'default';
};

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    0: '禁用',
    1: '启用',
    2: '待审核',
    3: '已拒绝',
    4: '已过期',
    'pending': '待处理',
    'success': '成功',
    'error': '失败',
    'processing': '处理中',
    'disabled': '已禁用'
  };
  
  return statusMap[status] || status;
};

// 索引计算方法
const indexMethod = (index) => {
  return (state.currentPage - 1) * state.pageSize + index + 1;
};

// 处理搜索
const handleSearch = () => {
  emits('search', state.searchQuery);
};

// 清除搜索
const clearSearch = () => {
  state.searchQuery = '';
  emits('search', '');
};

// 处理筛选条件变化
const handleFilterChange = () => {
  const filterValues = props.filters.reduce((acc, filter) => {
    acc[filter.key] = filter.value;
    return acc;
  }, {});
  
  emits('filter-change', filterValues);
};

// 处理行点击
const handleRowClick = (row, column, event) => {
  emits('row-click', row, column, event);
};

// 处理选择变化
const handleSelectionChange = (selection) => {
  state.selectedRows = selection;
  emits('selection-change', selection);
};

// 处理添加
const handleAdd = () => {
  // 清空编辑表单
  state.editForm = {};
  // 重置必填字段为空字符串
  props.editFields.forEach(field => {
    if (field.required) {
      state.editForm[field.prop] = '';
    }
  });
  
  state.dialogVisible = true;
  emits('add');
};

// 处理查看
const handleView = (row) => {
  emits('view', row);
};

// 处理编辑
const handleEdit = (row) => {
  // 深拷贝行数据到编辑表单
  state.editForm = JSON.parse(JSON.stringify(row));
  state.dialogVisible = true;
  emits('edit', row);
};

// 处理删除
const handleDelete = async (row) => {
  try {
    await $messagebox.confirm('确定要删除这条记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    emits('delete', row);
  } catch (error) {
    // 用户取消，不做处理
  }
};

// 处理下载
const handleDownload = (row) => {
  emits('download', row);
};

// 处理保存
const handleSave = async () => {
  if (!editFormRef.value) return;
  
  try {
    await editFormRef.value.validate();
    
    // 检查是否为新增
    const isAdd = !state.editForm[props.primaryKey];
    
    emits('save', state.editForm, isAdd);
    
    // 保存成功后关闭对话框
    state.dialogVisible = false;
    $message.success(isAdd ? '添加成功' : '更新成功');
  } catch (error) {
    // 验证失败，显示错误信息
    $message.error('表单验证失败，请检查输入');
  }
};

// 处理对话框关闭
const handleDialogClose = () => {
  // 重置编辑表单
  state.editForm = {};
  
  // 重置表单验证状态
  if (editFormRef.value) {
    editFormRef.value.resetFields();
  }
};

// 处理分页大小变化
const handleSizeChange = (newSize) => {
  state.pageSize = newSize;
  emits('pagination-change', {
    page: state.currentPage,
    size: newSize
  });
};

// 处理页码变化
const handleCurrentChange = (newPage) => {
  state.currentPage = newPage;
  emits('pagination-change', {
    page: newPage,
    size: state.pageSize
  });
};

// 监听数据变化
watch(() => props.data, (newData) => {
  state.tableData = newData;
});

// 监听分页参数变化
watch(() => [props.currentPage, props.pageSize], ([newPage, newSize]) => {
  state.currentPage = newPage;
  state.pageSize = newSize;
});
</script>

<style scoped>
.generic-table-container {
  padding: 16px;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.search-bar {
  margin-bottom: 16px;
}

.image-thumbnail {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.el-table .cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.el-table .cell.has-tooltip {
  cursor: help;
}

.el-pagination {
  margin-top: 16px;
}
</style>
