<template>
    <HomePanel title="人气好物" sub-title="人气好物，更多商品">
        <ul class="goods-list">
            <li v-for="item in hotList" :key="item.id">
            <RouterLink to="/">
                <img v-img-lazy="item.picture" alt="" />
                <p class="name">{{ item.title }}</p>
                <p class="price">{{ item.alt }}</p>
            </RouterLink>
            </li>
        </ul>
    </HomePanel>
</template>

<script setup>
import HomePanel from './HomePanel.vue';
import { onMounted, ref } from 'vue';
import { getHotAPI } from '@/apis/home';
const hotList = ref([])
onMounted(async () => {
    const res = await getHotAPI();
    hotList.value = res.result;
})
</script>

<style lang="scss" scoped>
    .goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;

  li {
    width: 21vw;
    aspect-ratio: 9/13;

    background: #f0f9f4;
    transition: all .5s;

    &:hover {
      transform: translate3d(0, -3px, 0);
      box-shadow: 0 3px 8px rgb(0 0 0 / 20%);
    }

    img {
      width: 100%;
      aspect-ratio: 1/1;
    }

    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .price {
      color: $priceColor;
    }
  }
}
</style>