import httpInstance from '@/utils/https'
/**
 * @description: 获取轮播图
 * @param {*}
 * @return {*}
 */
export const getBanneAPI = ( params = {})=> {
    const distributionSite = params.distributionSite || 1
    return httpInstance({
        url: '/home/banner',
        method: 'get',
        params: {
            distributionSite
        }
    })
}
/**
 * @description: 获取新鲜好物
 * @param {*}
 * @return {*}
 */
export const getNewAPI = ()=> {
    return httpInstance({
        url: '/home/new',
        method: 'get'
    })
}
/**
 * @description: 获取热门推荐
 * @param {*}
 * @return {*}
 */
export const getHotAPI = ()=> {
    return httpInstance({
        url: '/home/hot',
        method: 'get'
    })
}
/**
 * @description: 获取所有商品模块
 * @param {*}
 * @return {*}
 */
export const getGoodsAPI = () => {
  return httpInstance({
    url: '/home/goods'
  })
}