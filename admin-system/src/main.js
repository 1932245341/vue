import './assets/main.css'

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import router from './router';

// 创建Pinia实例
const pinia = createPinia();
const app = createApp(App);

// 正确挂载Pinia和Router到Vue应用
app.use(ElementPlus);
app.use(pinia);
app.use(router);
app.mount('#app')
