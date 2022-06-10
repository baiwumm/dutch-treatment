<template>
  <el-dialog
    v-model="dialogFormVisible"
    title="添加消费伙伴"
    :close-on-click-modal="false"
    @close="resetForm(ruleFormRef)"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      label-width="80px"
      ref="ruleFormRef"
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="ruleForm.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="唯一Key" prop="onlyKey">
        <el-input v-model="ruleForm.onlyKey" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)"
          >确认</el-button
        >
      </span>
    </template>
    <el-tag type="danger">唯一Key建议使用姓名拼音</el-tag>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, defineEmits } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
const emits = defineEmits(["getPeopleData"]);
const dialogFormVisible = ref(false);
const ruleFormRef = ref<FormInstance>();
// 自定义校验名字
const validateName = (rule: any, value: any, callback: any) => {
  let people = JSON.parse(localStorage.getItem("people")).map((el) => el.name);
  if (!value) {
    callback(new Error("请输入姓名"));
  } else if (value.length > 4) {
    callback(new Error("名字长度不能大于4"));
  } else if (people.includes(value)) {
    callback(new Error("名字已存在，请重新输入"));
  } else {
    callback();
  }
};

const validateKey = (rule: any, value: any, callback: any) => {
  let people = JSON.parse(localStorage.getItem("people")).map((el) => el.value);
  if (!value) {
    callback(new Error("请输入唯一Key"));
  } else if (value.length > 10) {
    callback(new Error("key长度不能大于10"));
  } else if (people.includes(value)) {
    callback(new Error("唯一key已存在，请重新输入"));
  } else {
    callback();
  }
};
const rules = reactive<FormRules>({
  name: [{ required: true, validator: validateName, trigger: "blur" }],
  onlyKey: [{ required: true, validator: validateKey, trigger: "blur" }],
});
const ruleForm = reactive({
  name: "",
  onlyKey: "",
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      let people = JSON.parse(localStorage.getItem("people"));
      people.push({ name: ruleForm.name, value: ruleForm.onlyKey });
      localStorage.setItem("people", JSON.stringify(people));
      emits("getPeopleData", people);
      ElMessage({
        type: "success",
        message: "添加成功",
      });
      resetForm(ruleFormRef);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  dialogFormVisible.value = false;
  formEl.resetFields();
};
defineExpose({ dialogFormVisible });
</script>