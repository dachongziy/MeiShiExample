import {observable, action} from 'mobx'

class App {
    @observable barStyle = 'light-content'

    // 使用mobx来管理 bar的样式
    @action
    updateBarStyle = style => {
        this.barStyle = style
    }
}

export default new App()
