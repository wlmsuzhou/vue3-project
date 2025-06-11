import { defineStore } from "pinia";
import { getCategoryAPI } from "@/apis/layout";
export const useCategoryStore = defineStore('category',{
    state: () => ({
        categoryList: [],
        counter: 1
    }),
    getters: {
    },
    actions: {
        async getCategoryList() {
            const res = await getCategoryAPI();
            this.categoryList = res.result;
            // console.log(this.categoryList)
        },
        increment() {
            this.counter++
        }
    }
})