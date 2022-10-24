<template>
  <div>{{ name }},{{ id }}</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
defineProps<{ id: number }>();
const name = ref("我是 alert");
</script>
<style lang="less" scoped></style>
