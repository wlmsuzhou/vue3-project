import '@/styles/common.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import ElementPlus from 'element-plus'
import { lazyPlugin } from '@/directives'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
// app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.use(lazyPlugin)
app.mount('#app')
