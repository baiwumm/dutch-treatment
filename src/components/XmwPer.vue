<template>
  <!-- 添加 people -->
  <el-space wrap>
    <span class="all-people">本次活动参与消费：</span>
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
    <formDialog ref="formDialogRef" @get-people-data="getPeopleData" />
  </el-space>

  <!-- 数据表格 -->
  <!-- <Xmwtable
  stripe
        border
  ></Xmwtable> -->
</template>
<script setup lang="ts">
import { nextTick, ref, reactive, onMounted } from "vue";
import { ElInput, ElMessage, ElMessageBox } from "element-plus";
import Xmwtable from "./XmwTable.vue";
import formDialog from "./formDialog.vue";
import { people } from "../data";

// 表格配置项
const tableConfig = reactive({
  showSeletion: true,
  showHandler: true,
  showIndexColumn: true,
  isCheckMemory: true,
  showExpand: true,
  showAppend: true,
  handlerConfig: {
    align: "center",
  },
});

// 初始化数据
localStorage.setItem("people", JSON.stringify(people));

const formDialogRef = ref<HTMLElement | null>(null); // 表格ref
const inputValue = ref(""); // 输入框绑定值
const dynamicTags = ref([]); // 获取loacalstorage的值

function initData(data: any) {
  if (data) {
    console.log(data);
  }
  dynamicTags.value = JSON.parse(localStorage.getItem("people")).map(
    (v: { name: string }) => v.name
  );
}

const getPeopleData = (data: Array<Object>) => {
  dynamicTags.value = data.map((v: { name: string }) => v.name);
};

// 关闭标签
const handleClose = (tag: string) => {
  ElMessageBox.confirm(
    "你确认删除这个伙伴吗，此操作不会影响已添加的数据?",
    "提醒",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    }
  ).then(() => {
    dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
    let people = JSON.parse(localStorage.getItem("people"));
    people.map((v, index) => {
      if (v.name == tag) {
        people.splice(index, 1);
      }
    });
    localStorage.setItem("people", JSON.stringify(people));
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

// 确认添加
const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value);
    localStorage.setItem("people", JSON.stringify(dynamicTags.value));
  }
  if (inputValue.value.length > 4) {
    ElMessage({
      showClose: true,
      message: "名字长度不得大于4",
      type: "error",
    });
  }
};

onMounted(() => {
  initData();
});
</script>