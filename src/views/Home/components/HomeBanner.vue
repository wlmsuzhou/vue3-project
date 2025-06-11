<template>
    <div class="home-banner">
        <el-carousel height="500px">
            <el-carousel-item v-for="item in bannerList" :key="item.id">
                <img :src="item.imgUrl" alt="">
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script setup>
    import { getBanneAPI } from '@/apis/home';
    import { onMounted, ref } from 'vue';
    const bannerList = ref([]);
    onMounted(async () => {
        const res = await getBanneAPI();
        bannerList.value = res.result;
        console.log(bannerList.value)
    })
</script>

<style lang="scss" scoped>
.home-banner {
    height: 500px;
    z-index: 98;
    img {
        width: 100%;
        height: 500px;
    }
}
</style>