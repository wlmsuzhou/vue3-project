<template>
   <header class='app-header' :class="{'show': y>80}">
    <div class="container">
      <h1 class="logo">
        <RouterLink to="/">小兔鲜</RouterLink>
      </h1>
      <ul class="app-header-nav">
        <li class="home">
          <RouterLink to="/">首页</RouterLink>
        </li>
        <li v-for="(item, index) in categoryStore.categoryList" :key="index">
          <RouterLink to="/">{{item.name}}</RouterLink>
        </li>
      </ul>
      <div class="search">
        <i class="iconfont icon-search"></i>
        <input type="text" placeholder="搜一搜">
      </div>
      <!-- 头部购物车 -->
      
    </div>
  </header>
</template>

<script setup>
import { getCategoryAPI } from '@/apis/layout'; 
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useScroll } from '@vueuse/core';
import { useCategoryStore } from '@/stores/category';
const categoryStore = useCategoryStore();
// const categoryList = ref([]);
const { y } = useScroll(window, {behavior: 'smooth'});
onMounted(() => {
  
});
</script>

<style lang="scss" scoped>
.app-header {
  background-color: white;
  transition: all 0.3s linear;
  z-index: 100;
  &.show {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transform: translateY(0);
    opacity: 1;
  }
  // position: sticky;
  // top: 0;
  // z-index: 999;
  // background-color: #fff;
  // transform: translateY(-100%);
    // 透明度 0 => 全透明
  // opacity: 0;
  // &.show {
  //   transition: all 0.3s linear;
  //   transform: none;
  //   opacity: 1;
  // }
  .container {
    display: flex;
    align-items: center;
  }

  .logo {
    width: 200px;

    a {
      display: block;
      height: 132px;
      width: 100%;
      text-indent: -9999px;
      background: url('@/assets/images/logo.png') no-repeat center 18px / contain;
    }
  }

  .app-header-nav {
    width: 820px;
    display: flex;
    padding-left: 40px;
    position: relative;
    z-index: 998;
  
    li {
      margin-right: 40px;
      width: 38px;
      text-align: center;
  
      a {
        font-size: 16px;
        line-height: 32px;
        height: 32px;
        display: inline-block;
  
        &:hover {
          color: $xtxColor;
          border-bottom: 1px solid $xtxColor;
        }
      }
  
      .active {
        color: $xtxColor;
        border-bottom: 1px solid $xtxColor;
      }
    }
  }
}
</style>