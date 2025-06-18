<template>
  <div class="tags-view-container">
    <div class="tags-view-wrapper">
      <div
        v-for="tag in visitedViews"
        :key="tag.path"
        :class="{
          'tags-view-item': true,
          'active': isActive(tag)
        }"
        @click="toLastView(tag)"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        <span>{{ tag.title }}</span>
        <el-icon
          v-if="!isAffix(tag)"
          class="close-icon"
          @click.stop="closeSelectedTag(tag)"
        >
          <Close />
        </el-icon>
      </div>
    </div>
    
    <!-- 右键菜单 -->
    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 访问过的视图
const visitedViews = ref([
  {
    path: '/dashboard',
    name: 'Dashboard',
    title: '首页',
    affix: true
  }
])

// 右键菜单相关
const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref({})

// 当前激活的标签
const isActive = (tag) => {
  return tag.path === route.path
}

// 是否是固定标签
const isAffix = (tag) => {
  return tag.affix
}

// 添加标签
const addTag = () => {
  const { name, path } = route
  if (name && path !== '/login') {
    const title = route.meta?.title || name
    const existingTag = visitedViews.value.find(tag => tag.path === path)
    
    if (!existingTag) {
      visitedViews.value.push({
        path,
        name,
        title,
        affix: false
      })
    }
  }
}

// 关闭选中的标签
const closeSelectedTag = (view) => {
  const index = visitedViews.value.findIndex(tag => tag.path === view.path)
  if (index > -1) {
    visitedViews.value.splice(index, 1)
    
    // 如果关闭的是当前标签，跳转到最后一个标签
    if (isActive(view)) {
      toLastView(visitedViews.value[visitedViews.value.length - 1])
    }
  }
}

// 关闭其他标签
const closeOthersTags = () => {
  visitedViews.value = visitedViews.value.filter(tag => {
    return tag.affix || tag.path === route.path
  })
}

// 关闭所有标签
const closeAllTags = (view) => {
  visitedViews.value = visitedViews.value.filter(tag => tag.affix)
  
  if (visitedViews.value.some(tag => tag.path === route.path)) {
    return
  }
  
  toLastView(visitedViews.value[visitedViews.value.length - 1])
}

// 刷新选中的标签
const refreshSelectedTag = (view) => {
  router.replace({ path: '/redirect' + view.path })
}

// 跳转到指定视图
const toLastView = (view) => {
  if (view && view.path) {
    router.push(view.path)
  }
}

// 打开右键菜单
const openMenu = (tag, e) => {
  const menuMinWidth = 105
  const offsetLeft = 250 // sidebar width
  const offsetWidth = menuMinWidth
  const maxLeft = offsetLeft + offsetWidth - 15
  
  left.value = e.clientX - offsetLeft + 15
  
  if (left.value > maxLeft) {
    left.value = maxLeft
  }
  
  top.value = e.clientY
  visible.value = true
  selectedTag.value = tag
}

// 关闭右键菜单
const closeMenu = () => {
  visible.value = false
}

// 监听路由变化
watch(route, () => {
  addTag()
})

// 监听点击事件，关闭右键菜单
watch(visible, (value) => {
  if (value) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})

// 初始化
nextTick(() => {
  addTag()
})
</script>

<style scoped>
.tags-view-container {
  height: 40px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
}

.tags-view-wrapper {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 10px;
  overflow-x: auto;
}

.tags-view-item {
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 8px;
  margin-right: 6px;
  font-size: 12px;
  color: #495057;
  background: #fff;
  border: 1px solid #d8dce5;
  border-radius: 3px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s;
}

.tags-view-item:hover {
  background: #f0f9ff;
  border-color: #409EFF;
}

.tags-view-item.active {
  background-color: #409EFF;
  color: #fff;
  border-color: #409EFF;
}

.close-icon {
  margin-left: 4px;
  font-size: 12px;
  border-radius: 50%;
  transition: all 0.3s;
}

.close-icon:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.tags-view-item.active .close-icon:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
}

.contextmenu li {
  margin: 0;
  padding: 7px 16px;
  cursor: pointer;
}

.contextmenu li:hover {
  background: #eee;
}
</style>