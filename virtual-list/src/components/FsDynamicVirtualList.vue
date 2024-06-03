<script setup>
import { computed, ref, onMounted, reactive, nextTick, watch, watchEffect, onUpdated } from "vue";

const props = defineProps({
  listData: Array,
  // 缓冲区比例
  bufferScale: {
    type: Number,
    default: 0.2,
  },
  // 预估高度
  estimatedHeight: {
    type: Number,
    default: 100,
  },
});

const containerRef = ref(null);
const listRef = ref(null);
// 存储每个元素的 position info
const positions = ref([]);
// 全局状态
const state = reactive({
  viewHeight: 0, // 容器高度
  listHeight: 0, // 列表高度
  startIndex: 0, // 起始索引
  maxCount: 0, // 最大容量
});

// 末尾索引
const endIndex = computed(() => {
  // 为了防止末尾索引溢出
  return Math.min(props.listData.length, state.startIndex + state.maxCount);
});

/** 计算缓冲区 */
// 缓冲数量
const bufferCount = computed(() => Math.floor(props.bufferScale * state.maxCount));
// 可视区上方缓冲数量
const aboveCount = computed(() => Math.min(state.startIndex, bufferCount.value));
// 可视区下方缓冲数量
const belowCount = computed(() => Math.min(props.listData.length - endIndex.value, bufferCount.value));
/** 计算缓冲区 */

// 需要渲染的元素列表
const renderList = computed(
  // () => props.listData.slice(state.startIndex - aboveCount.value, endIndex.value + belowCount.value)
  () => props.listData.slice(state.startIndex, endIndex.value)
);
// 偏移量
const startOffset = computed(() => (state.startIndex > 0 ? positions.value[state.startIndex - 1].bottom : 0));

function initPosition() {
  const pos = [];
  for (let i = 0; i < props.listData.length; i++) {
    const item = props.listData[i];
    pos.push({
      index: item.id, // 元素索引
      height: props.estimatedHeight, // 元素高度
      top: item.id * props.estimatedHeight, // 元素顶部所在位置
      bottom: (item.id + 1) * props.estimatedHeight, // 元素底部所在位置
      dHeight: 0, // 前后高度对比，判断是否需要更新
    });
  }

  positions.value = pos;
}

function setPosition() {
  nextTick(() => {
    const nodes = listRef.value?.children;
    if (!nodes || !nodes.length) return;
    [...nodes].forEach((node) => {
      // 获取元素大小以及相对于视口的位置
      const rect = node.getBoundingClientRect();
      const item = positions.value[+node.id];
      const dHeight = item.height - rect.height;

      if (dHeight) {
        item.height = rect.height;
        item.bottom = item.bottom - dHeight;
        item.dHeight = dHeight;
      }
    });

    const startId = +nodes[0].id;
    const len = positions.value.length;
    // dSumHeight 作为 dHeight 的累计值
    let dSumHeight = positions.value[startId].dHeight;
    // 上面已经处理过了，所以不存在差值了
    positions.value[startId].dHeight = 0;

    // 设置 positions 剩下的元素
    for (let i = startId + 1; i < len; i++) {
      const item = positions.value[i];
      item.top = positions.value[i - 1].bottom;
      item.bottom = item.bottom - dSumHeight;

      if (item.dHeight !== 0) {
        dSumHeight += item.dHeight;
        item.dHeight = 0;
      }
    }

    state.listHeight = positions.value[len - 1].bottom;
  });
}

// 二分法优化查询过程
const binarySearch = (list, value) => {
  let left = 0;
  let right = list.length - 1;
  let templateIndex = -1;

  while (left < right) {
    const midIndex = left + Math.floor((right - left) / 2);
    const midValue = list[midIndex].bottom;
    if (midValue === value) return midIndex + 1;
    else if (midValue < value) left = midIndex + 1;
    else if (midValue > value) {
      if (templateIndex === -1 || templateIndex > midIndex) templateIndex = midIndex;
      right = midIndex;
    }
  }
  return templateIndex;
};

function handleScroll(e) {
  const { scrollTop } = e.target;
  // 找到处于可视区域最上面的元素索引
  state.startIndex = binarySearch(positions.value, scrollTop);
}

watchEffect(() => {
  if (props.listData.length) {
    initPosition();
    setPosition();
  }
});

watch(
  () => state.startIndex,
  () => {
    setPosition();
  }
);

onMounted(() => {
  state.viewHeight = containerRef.value ? containerRef.value.offsetHeight : 0;
  state.maxCount = Math.ceil(state.viewHeight / props.estimatedHeight) + 1;
});
</script>

<template>
  <div ref="containerRef" class="fs-dynamic-virtuallist-container" @scroll="handleScroll($event)">
    <div
      ref="listRef"
      class="fs-dynamic-virtuallist-list"
      :style="{ height: `${state.listHeight - startOffset}px`, transform: `translate3d(0, ${startOffset}px, 0)` }"
    >
      <div v-for="item in renderList" :key="item.id" :id="item.id" class="fs-dynamic-virtuallist-item">
        <strong>{{ item.id }}</strong> {{ item.value }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fs-dynamic-virtuallist {
  &-container {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  &-item {
    padding: 8px 16px;
    color: #555;
    box-sizing: border-box;
    border-bottom: 1px solid #999;

    &:first-child {
      border-top: 1px solid #999;
    }
  }
}
</style>
