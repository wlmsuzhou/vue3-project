import '@/styles/common.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import ElementPlus from 'element-plus'
import { useIntersectionObserver } from '@vueuse/core'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
// app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.directive('img-lazy', {
    mounted(el, binding) {
        // console.log(binding.value)
        useIntersectionObserver(el, ([{ isIntersecting }]) => {
            if (isIntersecting) {
                console.log('图片进入可视区')
                el.src = binding.value
            }
        })
    }
})
app.mount('#app')
