import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import XmwPer from '@/components/XmwPer.vue'

const routes:Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: XmwPer
    }
]
//创建
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router