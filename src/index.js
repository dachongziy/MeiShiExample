import React, {PureComponent} from 'react'

import {

    View,
    // 状态栏
    StatusBar

} from 'react-native';

// 用来导航的组件
import {Navigator} from 'react-native-deprecated-custom-components'

/**
 * 与 Provider 结合使用的部分。用于将store中的部分状态，通过上下文的形式注入给子组件，用法如下：
 inject("store1", "store2")(observer(MyComponent))
 @inject("store1", "store2") @observer MyComponent
 @inject((stores, props, context) => props) @observer MyComponent
 @observer(["store1", "store2"]) MyComponent 是 @inject() @observer 的快捷用法.
 */
import {observer, inject} from 'mobx-react/native'
// 含有各种组件
import Router from './common/Routers'



@inject('app')
// 观察者
@observer
export default class App extends PureComponent {


    // 配置动画转换效果
    /*
    * 官方解释来看，这个函数是optional，这代表着这个属性不是必须赋值的。而这个函数是用来干嘛的？用来处理场景的动画和手势。
    * 它会要求两个参数route和routestack，route如同renderScene中的route一样是将要处理的界面的路由，routestack则是界面跳转关系的集合
    * */
    configureScene = route => {

        if (route.sceneConfig) return route.sceneConfig



        return {
            // 动画效果
            ...Navigator.SceneConfigs.PushFromRight,

            gestures: {}    // 禁用左滑返回手势

        }

    }



    renderScene = (route, navigator) => {

        let Component = Router[route.id].default
        // 传递过来的导航组件
        return <Component navigator={navigator} {...route.passProps}/>

    }



    render() {

        const initialPage = __IOS__ ? 'TabBarView' : 'Splash'

        return (

            <View style={{flex: 1}}>

                {/*注入的属性*/}
                <StatusBar barStyle={this.props.app.barStyle} animated />

                <Navigator

                    initialRoute={{id: initialPage}}

                    configureScene={this.configureScene}
                    {/*按照官方的解释，这个属性是个方法，而这个方式是用来展示你用户所给的路由的，而且它会默认传递一个navigator对象。*/}
                    renderScene={this.renderScene}

                />

            </View>

        )

    }

}
