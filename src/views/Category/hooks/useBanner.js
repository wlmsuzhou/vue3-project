import { onMounted, ref } from 'vue'
import { getBanneAPI } from '@/apis/home'
export function useBanner() {
  const bannerList = ref([])

  const getBanner = async () => {
    const res = await getBanneAPI({
      distributionSite: 2
    })
    bannerList.value = res.result
  }
  onMounted(() => {
    getBanner()
  })
  return {
    bannerList
  }
}
