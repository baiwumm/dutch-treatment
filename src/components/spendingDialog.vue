<template>
  <el-dialog
    v-model="dialogFormVisible"
    title="添加支出数据"
    :close-on-click-modal="false"
    @close="resetForm(ruleFormRef)"
  >
    <el-form :model="ruleForm" label-width="80px" ref="ruleFormRef">
      <el-row>
        <el-col :span="12" v-for="item in state.people" :key="item.value">
          <el-form-item :label="item.name">
            <el-input-number
              v-model="ruleForm[item.value]"
              :min="0"
              :max="99999"
              style="width: 100%"
              :precision="2"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, defineEmits } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
const emits = defineEmits(["spendingAmount"]);
const dialogFormVisible = ref(false);
const ruleFormRef = ref<FormInstance>();

const state = reactive<any>({
  people: [],
  tableData: [],
});

const ruleForm = ref({});

// 表单提交
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const deepFormData = JSON.parse(JSON.stringify(ruleForm.value));
      emits("spendingAmount", deepFormData);
      ElMessage({
        type: "success",
        message: "添加成功",
      });
      dialogFormVisible.value = false;
    }
  });
};
// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  dialogFormVisible.value = false;
  formEl.resetFields();
};

// 初始化数据
const initDialog = () => {
  dialogFormVisible.value = true;
  state.people = JSON.parse(localStorage.getItem("people"));
  state.tableData = JSON.parse(localStorage.getItem("tableData"));
  state.people.map((p) => {
    ruleForm.value[p.value] =
      state.tableData[state.tableData.length - 1][p.value];
  });
};
defineExpose({ initDialog });
</script>