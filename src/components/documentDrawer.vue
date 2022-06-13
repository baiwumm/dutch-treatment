<template>
  <el-drawer v-model="drawer" title="使用文档">
    <p>1. 该功能适用于多人消费，并计算人均消费。</p>
    <p>
      2. 点击
      <el-tag>添加</el-tag> 即可添加消费伙伴，点击标签上的
      <el-tag>×</el-tag>
      按钮即可删除，添加或删除不会影响表格上的数据，之前删除的伙伴的数据还保留。
    </p>
    <p>3. 表格默认有一行 <el-tag>支出数据</el-tag> ，只能编辑，不可删除</p>
    <p>
      4. 点击
      <el-tag>添加消费数据</el-tag> 即可在表格上添加相应的数据，每个人的消费等于
      <el-tag>消费金额（元）/ 选中的消费伙伴 = 人均消费</el-tag>
    </p>
    <p>
      5. 点击表格中的 <el-button size="small" type="primary">编辑</el-button>
      <el-button type="danger" size="small">删除</el-button>
      就能操作对应的行数据。
    </p>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const drawer = ref(false);
defineExpose({ drawer });
</script>