<template>
   <div class="container ">
    <!-- 面包屑 -->
    <div class="bread-container">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: `/category/${categoryData.parentId}`}">{{ categoryData.parentName }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ categoryData.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="sub-container">
      <el-tabs v-model="requestData.sortField" @tab-change="tabChange">
        <el-tab-pane label="最新商品" name="publishTime"></el-tab-pane>
        <el-tab-pane label="最高人气" name="orderNum"></el-tab-pane>
        <el-tab-pane label="评论最多" name="evaluateNum"></el-tab-pane>
      </el-tabs>
      <div class="body" v-infinite-scroll="loadMore" :infinite-scroll-disabled="goodsList.length >= total">
        <GoodsItem v-for="(item, index) in goodsList" :key="index" :good="item" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCategoryFilterAPI,getSubCategoryAPI } from '@/apis/category';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import GoodsItem from '../Home/components/common/GoodsItem.vue';
const route = useRoute()
//获取分类数据
const categoryData = ref({});
const getCategoryData = async () => {
  const res = await getCategoryFilterAPI(route.params.id);
  categoryData.value = res.result;
}
// 获取商品数据
const goodsList = ref([]);
const total = ref(0);
const requestData = ref({
  categoryId: route.params.id,
  page: 1,
  pageSize: 20,
  sortField: 'publishTime',
  sortOrder: 'desc'
})
const getGoods = async () => {
  const res = await getSubCategoryAPI(requestData.value)
  goodsList.value = res.result.items
  total.value = res.result.counts;
}
const tabChange = () => {
  // requestData.value.sortField = val;
  requestData.value.page = 1;
  getGoods();
}
const loadMore = async () => {
  requestData.value.page++;
  const moreDate = await getSubCategoryAPI(requestData.value);
  if (moreDate.result.items.length === 0) {
    alert(total.value)
    ElMessage({
      message: '没有更多数据了',
      type: 'warning'
    })
  } else {
    goodsList.value = [...goodsList.value, ...moreDate.result.items];
  }
}
onMounted(() => {
  getCategoryData();
  getGoods()
})
</script>

<style lang="scss" scoped>
.bread-container {
  padding: 25px 0;
  color: #666;
}

.sub-container {
  padding: 20px 10px;
  background-color: #fff;

  .body {
    display: flex;
    flex-wrap: wrap;
    padding: 0 10px;
  }

  .goods-item {
    display: block;
    width: 220px;
    margin-right: 20px;
    padding: 20px 30px;
    text-align: center;

    img {
      width: 160px;
      height: 160px;
    }

    p {
      padding-top: 10px;
    }

    .name {
      font-size: 16px;
    }

    .desc {
      color: #999;
      height: 29px;
    }

    .price {
      color: $priceColor;
      font-size: 20px;
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }


}
</style>