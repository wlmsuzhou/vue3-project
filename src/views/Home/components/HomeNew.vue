<template>
    <HomePanel title="新鲜好物" sub-title="新鲜好物，更多商品">
        <ul class="goods-list">
            <li v-for="item in newList" :key="item.id">
            <RouterLink to="/">
                <img v-img-lazy="item.picture" alt="" />
                <p class="name">{{ item.name }}</p>
                <p class="price">&yen;{{ item.price }}</p>
            </RouterLink>
            </li>
        </ul>
    </HomePanel>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import HomePanel from './HomePanel.vue';
import { getNewAPI } from '@/apis/home';
const newList = ref([]);
onMounted(async () => {
  const res = await getNewAPI()
  newList.value = res.result
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