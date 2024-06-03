<script setup>
import { computed, ref, onMounted } from "vue";

const props = defineProps({
  listData: Array,
  itemHeight: Number,
  // 缓冲区节点数量
  bufferCount: Number,
});

const containerRef = ref(null);
const viewHeight = ref(0);
// 列表滚动距离
const scrollTop = ref(0);
// 列表总高度
const listHeight = computed(() => props.listData.length * props.itemHeight);
// 渲染节点的数量（可视区节点 + 缓冲区节点）
const renderCount = computed(() => Math.ceil(viewHeight.value / props.itemHeight) + 1 + props.bufferCount);
const startIndex = computed(() => Math.floor(scrollTop.value / props.itemHeight));
const endIndex = computed(() => startIndex.value + renderCount.value);
// 可视区域元素
const visibleData = computed(() => props.listData.slice(startIndex.value, endIndex.value));
// 偏移量，为了保证显示的区域处于正确的位置
const startOffset = computed(() => {
  return scrollTop.value - (scrollTop.value % props.itemHeight);
});

const handleScroll = (e) => {
  scrollTop.value = e.target.scrollTop;
};

onMounted(() => {
  viewHeight.value = containerRef.value?.offsetHeight;
});
</script>

<template>
  <div ref="containerRef" class="fs-virtuallist-container" @scroll="handleScroll($event)">
    <div
      class="fs-virtuallist-list"
      :style="{
        height: `${listHeight - startOffset}px`,
        transform: `translate3d(0, ${startOffset}px, 0)`,
      }"
    >
      <div
        v-for="item in visibleData"
        :key="item.id"
        class="fs-virtuallist-item"
        :style="{
          height: `${itemHeight}px`,
        }"
      >
        {{ item.value }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fs-virtuallist {
  &-container {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  &-item {
    padding: 10px;
    color: #555;
    box-sizing: border-box;
    border-bottom: 1px solid #999;

    &:first-child {
      border-top: 1px solid #999;
    }
  }
}
</style>
