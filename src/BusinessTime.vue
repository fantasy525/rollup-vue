<template>
  <div>
    <div>{{ count }}</div>
    <!-- <BaseAlert :id="count" /> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
// 33
// import BaseAlert from "./BaseAlert.vue";

const count = ref(0);
count.value = 99;
</script>

<style lang="less" scoped>
.count {
  color: red;
}
</style>
