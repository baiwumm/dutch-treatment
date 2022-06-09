import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import XmwPer from "./components/XmwPer.vue";

createApp(App).use(router).use(ElementPlus).component('XmwPer', XmwPer).mount('#app')
