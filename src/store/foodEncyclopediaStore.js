import {observable, runInAction, computed, action} from 'mobx'
import {get} from '../common/HttpTool'

class FoodEncyclopediaStore {
    @observable foodCategoryList = []
    @observable errorMsg = ''

    @action
    fetchCategoryList = async() => {
        try {
            // 食物分类列表
            const url = 'http://food.boohee.com/fb/v1/categories/list'
            const responseData = await get({url, timeout: 30}).then(res => res.json())

            // runInAction 是个简单的工具函数，它接收代码块并在(异步的)动作中执行。这对于即时创建和执行动作非常有用，例如在异步过程中。
            // 如果你使用async function来处理业务，需要使用runInAction。

            runInAction(() => {
                this.foodCategoryList.replace(responseData.group)
                this.errorMsg = ''
            })
        } catch (error) {
            if (error.msg) {
                this.errorMsg = error.msg
            } else {
                this.errorMsg = error
            }
        }
    }

    @computed
    get isFetching() {
        return this.foodCategoryList.length === 0 && this.errorMsg === ''
    }

    @computed
    get isNoResult() {
        return this.foodCategoryList.length === 0
    }
}

export default FoodEncyclopediaStore
