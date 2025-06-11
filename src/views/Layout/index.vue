<template>
    <LayoutNav />
    <LayoutHeader />
    <router-view />
    <LayoutFooter />
</template>

<script setup>
import LayoutNav from './components/LayoutNav.vue'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutFooter from './components/LayoutFooter.vue'

import { useCategoryStore } from '@/stores/category'
import { onMounted } from 'vue'
import { get } from '@vueuse/core'
const categoryStore = useCategoryStore()
onMounted(() => {
   categoryStore.getCategoryList()
})
categoryStore.$onAction(({name, after}) => {
   if(name === 'getCategoryList') {
      after(() => {
        console.log(categoryStore.categoryList)
      })
   }
})
</script>

<style lang="scss" scoped></style>