import {observable} from 'mobx'

// 使用mobx来管理账户名称
class Account {
    @observable name = ''
}

export default new Account()
