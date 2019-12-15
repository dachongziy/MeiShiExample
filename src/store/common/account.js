import {observable} from 'mobx'

// 使用mobx来管理账户名称
class Account {
    @observable name = ''
}
// 注意导出的属性了new import 时用aacount 就可以导入该组件
export default new Account()
