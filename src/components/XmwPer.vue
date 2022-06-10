<template>
  <!-- 添加 people -->
  <el-space wrap>
    <span class="all-people">本次活动参与消费伙伴：</span>
    <el-tag
      v-for="tag in dynamicTags"
      :key="tag"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
      size="large"
    >
      {{ tag }}
    </el-tag>
    <el-button @click="showDialog"> + 添加 </el-button>
    <el-button type="primary" @click="openConsumerDialog"
      >添加消费数据</el-button
    >
    <formDialog ref="formDialogRef" @get-people-data="getPeopleData" />
    <consumerDialog ref="consumerDialogRef" @splitAmount="splitAmount" />
  </el-space>

  <!-- 数据表格 -->
  <Xmwtable
    stripe
    border
    show-summary
    :summary-method="getSummaries"
    :tableData="state.tableData"
    :loading="state.loading"
    :columns="state.firstLoad ? firstColumns : state.tableColumns"
    :tableConfig="tableConfig"
    :showPagination="false"
    :default-sort="{ prop: 'date', order: 'ascending' }"
    style="margin-top: 20px"
  >
    <template v-slot:handler="{ scope }">
      <el-button
        size="small"
        type="primary"
        @click="handlerEdit(scope)"
        :disabled="scope.$index == state.tableData.length - 1"
        >编辑</el-button
      >
      <el-button
        type="danger"
        size="small"
        @click="handlerDelect(scope)"
        :disabled="scope.$index == state.tableData.length - 1"
        >删除</el-button
      >
    </template>
  </Xmwtable>
</template>
<script setup lang="ts">
import { nextTick, ref, reactive, onMounted } from "vue";
import { ElInput, ElMessage, ElMessageBox } from "element-plus";
import moment from "moment";
import Xmwtable from "./XmwTable.vue";
import formDialog from "./formDialog.vue";
import consumerDialog from "./consumerDialog.vue";
import {
  people,
  tableConfig,
  defaultColumns,
  firstColumns,
  peopleModel,
  consumptionAmountModel,
  SummaryMethodProps,
  SpanMethodProps,
  formatRowspanAndColspan,
  uuid,
} from "../data";

const formDialogRef = ref<HTMLElement | null>(null);
const consumerDialogRef = ref<HTMLElement | null>(null);
const inputValue = ref(""); // 输入框绑定值
const dynamicTags = ref([]); // 获取loacalstorage的值
const state = reactive<any>({
  tableData: [],
  firstLoad: true,
  tableColumns: [],
  loading: false,
});

// 初始化数据
function initData() {
  let people: Array<peopleModel> = JSON.parse(localStorage.getItem("people"));
  let tableData: Array<Object> = JSON.parse(localStorage.getItem("tableData"));
  dynamicTags.value = people.map((v: peopleModel) => v.name);
  // 初始化默认插入一条支出数据，不支持修改
  if (tableData) {
    state.tableData = tableData;
  } else {
    // 生成 table 数据
    const tableObj = {
      id: uuid(),
      date: moment().format("YYYY-MM-DD"),
      consumerShow: "支出",
      consumptionAmount: 0,
    };
    // 生成人均消费
    people.map((c) => {
      tableObj[c.value] = 0;
    });
    // 插入表格
    state.tableData.push(tableObj);
    // 保存在localstorage
    localStorage.setItem("tableData", JSON.stringify(state.tableData));
  }
}

// 添加伙伴时更新操作
const getPeopleData = (people: Array<peopleModel>) => {
  dynamicTags.value = people.map((v: peopleModel) => v.name);
  updateColumns(people);
};

// 添加消费数据,渲染表格
const splitAmount = (data: consumptionAmountModel) => {
  if (!data) return;
  const { consumerShow, consumptionAmount, consumptionPartners, date } = data;
  let tableData = JSON.parse(localStorage.getItem("tableData"));
  // 取当前时间戳为id
  const id = uuid();
  // 计算人均金额
  const averageAmount =
    Math.floor((consumptionAmount / consumptionPartners.length) * 100) / 100;
  // 生成 table 数据
  const tableObj = {
    id: data.id || id,
    date,
    consumerShow,
    consumptionAmount,
  };
  // 生成人均消费
  consumptionPartners.map((c) => {
    tableObj[c] = averageAmount;
  });
  // 如果没有数据，则是第一条数据，直接插入
  if (tableData && data.id) {
    // 如果有 id ,就是编辑，没有则是新增
    tableData.forEach((t: any, index: number) => {
      if (t.id == data.id) {
        tableData.splice(index, 1);
        tableData.splice(index, 0, tableObj);
      }
    });
    state.tableData = tableData;
    localStorage.setItem("tableData", JSON.stringify(tableData));
  } else {
    // 插入表格
    state.tableData.splice(state.tableData.length - 1, 0, tableObj);
    // 保存在localstorage
    localStorage.setItem("tableData", JSON.stringify(state.tableData));
  }
};

// 动态更新列
const updateColumns = (people: Array<peopleModel>) => {
  let pColumns: Array<Object> = reactive([]);
  people.map((p) => {
    pColumns.push({
      label: p.name,
      prop: p.value,
      width: 80,
      align: "center",
    });
  });
  state.firstLoad = false;
  state.tableColumns = [...defaultColumns, ...pColumns];
};

// 关闭标签
const handleClose = (tag: string) => {
  ElMessageBox.confirm(
    "你确认删除这个伙伴吗，此操作数据会保留，但是会把表格中关联的列也删除?",
    "提醒",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    }
  ).then(() => {
    dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
    let people: Array<peopleModel> = JSON.parse(localStorage.getItem("people"));
    people.map((v: Object, index: number) => {
      if (v.name == tag) {
        people.splice(index, 1);
      }
    });
    localStorage.setItem("people", JSON.stringify(people));
    updateColumns(people);
    ElMessage({
      type: "success",
      message: "删除成功",
    });
  });
};

// 显示输入框
const showDialog = () => {
  formDialogRef.value.dialogFormVisible = true;
};

// 添加消费数据模态框
function openConsumerDialog() {
  consumerDialogRef.value.initDialog();
}

// 编辑当前表格
const handlerEdit = (scope: Object) => {
  consumerDialogRef.value.initDialog(scope.row);
};

// 删除当前表格
const handlerDelect = (scope: Object) => {
  ElMessageBox.confirm("你确认要删除此条数据吗，删除后无法恢复?", "提醒", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    let tableData = JSON.parse(localStorage.getItem("tableData"));
    tableData.forEach((t: any, index: number) => {
      if (t.id == scope.row.id) {
        tableData.splice(index, 1);
      }
    });
    state.tableData = tableData;
    localStorage.setItem("tableData", JSON.stringify(tableData));
  });
};

// 合计行配置
const getSummaries = (param: SummaryMethodProps) => {
  const { columns, data } = param;
  const sums: string[] = [];
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = "合计";
      return;
    }
    const values = data.map((item) => Number(item[column.property]));
    if (!values.every((value) => Number.isNaN(value))) {
      sums[index] = `${values.reduce((prev, curr, $index) => {
        const value = Number(curr);
        if (!Number.isNaN(value) && !(data.length - 1 == $index)) {
          return Math.floor((prev + curr) * 100) / 100;
          // 默认最后一项为支出，合计等于支出-总消费
        } else if (data.length - 1 == $index) {
          if (Number.isNaN(curr)) curr = 0;
          return (
            Math.floor((index === 3 ? prev - curr : curr - prev) * 100) / 100
          );
        } else {
          return Math.floor(prev * 100) / 100;
        }
      }, 0)}`;
    } else {
      sums[index] = "N/A";
    }
  });

  return sums;
};

const objectSpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex,
}: SpanMethodProps) => {
  // columnIndex代表列，合并表格
  const newArr = formatRowspanAndColspan(state.tableData, "dataType");
  // 合并第二列 日期（星期）
  if (columnIndex === 1) {
    const num = newArr[rowIndex].num;
    if (num > 1) {
      return {
        rowspan: num,
        colspan: 1,
      };
    } else if (num < 1) {
      return {
        rowspan: 1,
        colspan: num,
      };
    } else {
      return {
        rowspan: 1,
        colspan: 1,
      };
    }
  }
};

onMounted(() => {
  // 初始化数据
  localStorage.setItem("people", JSON.stringify(people));
  initData();
});
</script>