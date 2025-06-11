<template>
    <el-row :span="24">
        <el-col :span="4">
            <Homecategory></Homecategory>
        </el-col>
        <el-col :span="19">
            <HomeBanner></HomeBanner>
        </el-col>
    </el-row>
    <HomeNew></HomeNew>
    <HomeHot></HomeHot>
</template>

<script setup>
import HomeBanner from './components/HomeBanner.vue';
import Homecategory from './components/Homecategory.vue';
import HomeProduct from './components/HomeProduct.vue';
import HomeView from './components/HomeView.vue';
// import HomePanel from './components/HomePanel.vue';
import HomeNew from './components/HomeNew.vue';
import HomeHot from './components/HomeHot.vue';
// import { useHomeStore } from '@/stores/home';

</script>

<style lang="scss" scoped>
</style>