//定义懒加载插件
import { useIntersectionObserver } from '@vueuse/core'
export const lazyPlugin = {
    install(app) {
        app.directive('img-lazy', {
            mounted(el, binding) {
                // console.log(binding.value)
                const { stop } = useIntersectionObserver(el, ([{ isIntersecting }]) => {
                    if (isIntersecting) {
                        console.log('图片进入可视区')
                        el.src = binding.value
                        stop()
                    }
                })
            }
        })
    }
}