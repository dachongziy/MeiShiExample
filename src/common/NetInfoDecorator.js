import React, {Component} from 'react'
// 可以获取设备当前联网状态
import {NetInfo} from 'react-native'


// 用来对 isShiWuPai.js 中的类进行装饰，相当于： NetInfoDecorator(Root)
const NetInfoDecorator = WrappedComponent => class extends Component {

    constructor(props) {

        super(props)
        // 记录当前网络状态
        this.state = {

            isConnected: true,

        }

    }



    componentDidMount() {
        // 在所有平台上可用。以异步方式获取一个布尔值，用于判断当前设备是否联网
        // change已过时
        NetInfo.isConnected.addEventListener('connectionChange', this._handleNetworkConnectivityChange);

    }



    _handleNetworkConnectivityChange = isConnected => this.setState({isConnected})


    // 将传入过来的组件进行附带一些属性后进行渲染
    render() {
        // 给Root类传递isConnected属性
        return <WrappedComponent {...this.props} {...this.state}/>

    }

}



export default NetInfoDecorator
