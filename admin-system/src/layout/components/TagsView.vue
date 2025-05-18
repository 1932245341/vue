<template>
  <div class="tags-view">
    <el-scrollbar>
      <div class="tags-view-wrapper">
        <el-tag
          v-for="tag in visitedViews"
          :key="tag.path"
          :closable="tag.name !== 'dashboard'"
          :effect="$route.path === tag.path ? 'dark' : 'plain'"
          @click="handleTagClick(tag)"
          @close="handleTagClose(tag)"
        >
          {{ tag.meta.title }}
        </el-tag>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/index'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const store = useUserStore()

// 已访问的页面列表
const visitedViews = ref([
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: { title: '控制台' }
  }
])

// 点击标签跳转到对应页面
function handleTagClick(tag) {
  router.push(tag.path)
}

// 关闭标签页
function handleTagClose(tag) {
  const index = visitedViews.value.indexOf(tag)
  if (index >= 0) {
    visitedViews.value.splice(index, 1)
    
    // 如果关闭的是当前页面，则跳转到最后一个打开的页面
    if (tag.path === route.path) {
      const lastView = visitedViews.value.slice(-1)[0]
      router.push(lastView.path)
    }
  }
}
</script>

<style scoped>
.tags-view {
  height: 34px;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  padding: 2px 5px 0 15px;
}

.tags-view-wrapper {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

.el-tag {
  margin-right: 5px;
  cursor: pointer;
}
</style>