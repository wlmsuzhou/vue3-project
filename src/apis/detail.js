import request from '@/utils/https'
/**
 * 
 * @param {*} id 
 * @returns 
 */
export const getDetailAPI = (id) => {
  return request({
    url: '/goods',
    params: {
      id
    }
  })
}
export const getHotGoodsAPI = ({ id, type, limit = 3 }) => {
  return request({
    url:'/goods/hot',
    params:{
      id, 
      type, 
      limit
    }
  })
}