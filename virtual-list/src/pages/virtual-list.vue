<script setup>
import { ref, watchEffect } from "vue";
import { faker } from "@faker-js/faker";
import FsVirtualList from "../components/FsVirtualList.vue";
import FsDynamicVirtualList from "../components/FsDynamicVirtualList.vue";

const listData = ref([]);
const isDynamic = ref(false);

watchEffect(() => {
  listData.value = [];

  for (let i = 0; i < 1000; i++) {
    listData.value.push({
      id: i,
      value: isDynamic.value ? faker.lorem.sentences() : i,
    });
  }
});
</script>

<template>
  <header>
    <button @click="isDynamic = false">定高虚拟列表</button>
    <button @click="isDynamic = true">不定高虚拟列表</button>
  </header>
  <main>
    <FsVirtualList v-if="!isDynamic" :list-data="listData" :item-height="50" :buffer-count="4" />
    <FsDynamicVirtualList v-else :list-data="listData" :buffer-count="6" />
  </main>
</template>

<style lang="scss" scoped>
header {
  height: 100px;
  text-align: center;
  box-sizing: border-box;
  padding: 16px;
}

main {
  height: calc(100% - 100px);
}

button {
  margin-right: 8px;
  font-size: 14px;
  padding: 8px 16px;
  margin-top: 8px;
}
</style>
