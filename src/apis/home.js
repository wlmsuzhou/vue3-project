import httpInstance from '@/utils/https'

export const getBanneAPI = ()=> {
    return httpInstance({
        url: '/home/banner',
        method: 'get'
    })
}

export const getNewAPI = ()=> {
    return httpInstance({
        url: '/home/new',
        method: 'get'
    })
}
export const getHotAPI = ()=> {
    return httpInstance({
        url: '/home/hot',
        method: 'get'
    })
}