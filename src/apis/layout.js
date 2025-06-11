import httpInstance from "@/utils/https";

export const getCategoryAPI = (params) => {
    return httpInstance({
        url: '/home/category/head',
        method: 'get',
        params
    });
}
