import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import XmwPer from "./components/XmwPer.vue";
import Xmwtable from 'vue3-xmw-table'

createApp(App).use(router).use(ElementPlus).use(Xmwtable).component('XmwPer', XmwPer).mount('#app')
