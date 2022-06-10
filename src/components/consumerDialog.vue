<template>
  <el-dialog
    v-model="dialogFormVisible"
    title="添加消费数据"
    :close-on-click-modal="false"
    @close="resetForm(ruleFormRef)"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      label-width="80px"
      ref="ruleFormRef"
    >
      <el-form-item label="日期" prop="date">
        <el-date-picker
          v-model="ruleForm.date"
          type="date"
          placeholder="请选择日期"
          value-format="YYYY-MM-DD"
          :editable="false"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="消费说明" prop="consumerShow">
        <el-input v-model="ruleForm.consumerShow" autocomplete="off" />
      </el-form-item>
      <el-form-item label="消费金额" prop="consumptionAmount">
        <el-input-number
          v-model="ruleForm.consumptionAmount"
          :min="1"
          :max="99999"
          style="width: 100%"
          :precision="2"
        />
      </el-form-item>
      <el-form-item label="消费伙伴" prop="consumptionPartners">
        <el-select
          v-model="ruleForm.consumptionPartners"
          multiple
          collapse-tags
          collapse-tags-tooltip
          placeholder="请选择消费伙伴"
          style="width: 100%"
          clearable
        >
          <el-option
            v-for="item in consumptionPartnersOpts"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, defineEmits, nextTick } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
const emits = defineEmits(["splitAmount"]);
const dialogFormVisible = ref(false);
const ruleFormRef = ref<FormInstance>();
const consumptionPartnersOpts = ref([]);
const rules = reactive<FormRules>({
  date: [
    {
      type: "date",
      required: true,
      message: "请选择日期",
      trigger: "change",
    },
  ],
  consumerShow: [
    { required: true, message: "请输入消费说明", trigger: "blur" },
    { min: 1, max: 20, message: "字节长度不能大于20", trigger: "blur" },
  ],
  consumptionAmount: [
    { required: true, message: "请输入消费金额" },
    { type: "number", message: "消费金额必须是数字" },
  ],
  consumptionPartners: [
    {
      type: "array",
      required: true,
      message: "请选择至少一位消费伙伴",
      trigger: "change",
    },
  ],
});
let ruleForm = ref({
  date: "",
  consumerShow: "",
  consumptionAmount: 0,
  consumptionPartners: [],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const deepFormData = JSON.parse(JSON.stringify(ruleForm.value));
      emits("splitAmount", deepFormData);
      ElMessage({
        type: "success",
        message: deepFormData.id ? "修改成功" : "添加成功",
      });
      resetForm(ruleFormRef);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  dialogFormVisible.value = false;
  //   不知道
  formEl.resetFields();
  ruleForm.value = {
    date: "",
    consumerShow: "",
    consumptionAmount: 0,
    consumptionPartners: [],
  };
};

const initDialog = (row) => {
  dialogFormVisible.value = true;
  let people = JSON.parse(localStorage.getItem("people"));
  //   数据回显
  if (row) {
    let deepRow = JSON.parse(JSON.stringify(row));
    deepRow.consumptionPartners = [];
    people.map((p) => {
      if (deepRow[p.value]) {
        deepRow.consumptionPartners.push(p.value);
      }
    });
    nextTick(() => {
      ruleForm.value = deepRow;
    });
  }
  consumptionPartnersOpts.value = [];
  people.map((p) => {
    consumptionPartnersOpts.value.push({
      label: p.name,
      value: p.value,
    });
  });
};
defineExpose({ initDialog });
</script>