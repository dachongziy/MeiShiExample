import {observable, computed, action, runInAction} from 'mobx'
import {get} from '../common/HttpTool'

export default class FeedStore {
    @observable feedList = [];
    @observable errorMsg = '';
    @observable page = 1;
    @observable isRefreshing = false;
    @observable isNoMore = true;

    constructor(categoryId) {
        this.categoryId = categoryId;
        this.fetchFeedList()
    }
    // mobx修改state
    @action
    fetchFeedList = async () => {
        try {
            if (this.isRefreshing) this.page = 1
            const url = 'http://food.boohee.com/fb/v1/feeds/category_feed'
            const params = {
                page: this.page,
                category: this.categoryId,
                per: 10
            }
            const responseData = await get({url, params, timeout: 30}).then(res => res.json())
            // 观察量进行赋值操作
            const {feeds, page, total_pages} = responseData

            runInAction(() => {
                this.isRefreshing = false
                this.errorMsg = ''
                this.isNoMore = page >= total_pages

                if (this.page === 1) {
                    this.feedList.replace(feeds)
                } else {
                    this.feedList.splice(this.feedList.length, 0, ...feeds);
                }
            })
        } catch (error) {
            if (error.msg) {
                this.errorMsg = error.msg
            } else {
                this.errorMsg = error
            }
        }
    }

    // 有时我们需要处理观察对象处理后的数据，当观察对象值变化后，产生新的值
    // 响应规则与 autorun 类似， 只对函数内的值作响应
    @computed
    get isFetching() {
        return this.feedList.length === 0 && this.errorMsg === ''
    }


    @computed
    get isLoadMore() {
        return this.page !== 1
    }
}
