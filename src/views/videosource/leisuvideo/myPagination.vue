<template>
  <div class="demo-pagination-block">
    <el-pagination
      v-model:current-page="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[10, 100, 200, 300, 400]"
      :size="mySize"
      :disabled="disabled"
      :background="myBackground"
      layout="total,  prev, pager, next, sizes, jumper"
      :total="props.totalItem"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { ComponentSize } from "element-plus";

const mySize = ref<ComponentSize>("default");

const disabled = ref(false);
const myBackground = ref(false);
const currentPage4 = ref(4);
const pageSize4 = ref(100);

// 给props集中定义类型
interface Props {
  totalItem: number | undefined; // 如果允许 undefined，添加可选标记
}
// 在当前组件定义若干props
const props = withDefaults(defineProps<Props>(), {
  totalItem: 0, // 提供默认值
});

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
</script>

<style scoped lang="scss">
.demo-pagination-block {
  padding: 2% 0;
}
.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}
.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
</style>
