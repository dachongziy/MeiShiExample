import React from 'react'
import {Animated, StyleSheet, View, Text, AppRegistry} from 'react-native'
// 类似于redux，前端数据流方案
import {Provider} from 'mobx-react/native'

//store是一个目录，里面封装了一些请求操作
import stores from './src/store'
// 网络信息装饰器，
import NetInfoDecorator from './src/common/NetInfoDecorator'
// 包含了页面的主体
import App from './src'

if (!__DEV__) {
    global.console = {
        log: () => {}
    }
}

/*
* Decorator 是 ES7 的一个新语法，目前仍处于第2阶段提案中，正如其“装饰器”的叫法所表达的，
* 他通过添加@方法名可以对一些对象进行装饰包装然后返回一个被包装过的对象，可以装饰的对象包括：类，属性，方法等。
*当装饰的对象是类时，我们操作的就是这个类本身，即装饰器函数的第一个参数，就是所要装饰的目标类。
*
*下面这句等同于:
* class Root {}
* Root = NetInfoDecorator(Root) || A
* */
@NetInfoDecorator
export  default  class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 透明度初始设为0，用于单个值
            promptPosition: new Animated.Value(0)
        }
    }
    // componentWillReceiveProps在初始化render的时候不会执行，它会在Component接受新的状态时(Props)时被触发
    // 一般用于父组件状态更新时子组件的重新渲染
    componentWillReceiveProps(nextProps) {
        const {isConnected} = nextProps
        // 无网络
        if (!isConnected) {
            /*
            * static timing(value: AnimatedValue | AnimatedValueXY, config: TimingAnimationConfig) #
            * 推动一个值按照一个过渡曲线而随时间变化。Easing模块定义了一大堆曲线，你也可以使用你自己的函数。
            * */
            Animated.timing(this.state.promptPosition, {
                toValue: 1,
                duration: 200
            }).start(() => {
                // Animated的start方法是支持回调函数的，在动画或某个流程结束的时候执行，这样子就可以很简单地实现循环动画了。
                setTimeout(() => {
                    Animated.timing(this.state.promptPosition, {
                        toValue: 0,
                        duration: 200
                    }).start()
                }, 2000);
            })
        }
    }

    render() {
        // interpolate方法可以用来在动画执行的过程中，根据给定的起始、最终值，计算动画的每一步需要的值。比如：
        let positionY = this.state.promptPosition.interpolate({
            inputRange: [0, 1],
            outputRange: [-30, __IOS__ ? 20 : 0]
        });
        return (
            <View style={{flex: 1}}>
                {/*注入的值 stores 包含app和account 组件*/}
                <Provider {...stores}>
                    <App />
                </Provider>
                {/*网络异常显示的视图部分*/}
                <Animated.View style={[styles.netInfoView, {top: positionY}]}>
                    <Text style={styles.netInfoPrompt}>网络异常，请检查网络稍后重试~</Text>
                </Animated.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    netInfoView: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        position: 'absolute',
        right: 0,
        left: 0,
        backgroundColor: gColors.theme
    },
    netInfoPrompt: {
        color: 'white',
        fontWeight: 'bold'
    }
})

AppRegistry.registerComponent('ShopExample', () => Root)
