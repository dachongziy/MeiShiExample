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

import Router from './common/Routers'



@inject('app')
// 观察者
@observer
export default class App extends PureComponent {



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

                    renderScene={this.renderScene}

                />

            </View>

        )

    }

}
