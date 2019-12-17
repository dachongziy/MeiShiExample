import React, {PureComponent} from 'react';

import {

    View,

    Image,

    TouchableOpacity,

    StyleSheet,

} from 'react-native'

import {Navigator} from 'react-native-deprecated-custom-components'

import {observer, inject} from 'mobx-react/native'

/*放于界面之上可以实现一个界面中子界面的切换效果，置于界面之下可实现功能模块间的切换，
*通常用于封装自定义的tabBar
* */
import ScrollableTabView from 'react-native-scrollable-tab-view'
// 食物分类tabbar栏
import FeedsCategoryBar from '../../components/FeedsCategoryBar'

//逛吃首页中间部分，详细设计看app运行效果
import FeedHomeList from './FeedHomeList';
// 逛吃评价部分，详细设计看app 运行效果
import FeedEvaluatingList from '../../pages/feed/FeedEvaluatingList'
// 逛吃知识部分，详细设计看app 运行效果
import FeedKnowledgeList from '../../pages/feed/FeedKnowledgeList';
// 逛吃美食部分，详细设计看app 运行效果
import FeedDelicacyList from '../../pages/feed/FeedDelicacyList';



const titles = ['首页', '评测', '知识', '美食'];

const controllers = [

    {categoryId: 1, controller: FeedHomeList},

    {categoryId: 2, controller: FeedEvaluatingList},

    {categoryId: 3, controller: FeedKnowledgeList},

    {categoryId: 4, controller: FeedDelicacyList}

]


// 注入 账户名称
@inject('account')

@observer

export default class Home extends PureComponent {



    _pictureAction = () => {

        const {account: {name}} = this.props

        if (name) {

            alert(name)

        } else {

            this.props.navigator.push({

                id: 'Login',

                sceneConfig: Navigator.SceneConfigs.FloatFromBottom

            })

        }

    }



    render() {

        const {navigator} = this.props;



        return (

            <View style={{flex: 1}}>

                {/*头部的食物派图片*/}
                <HeaderView pictureAction={this._pictureAction}/>

                <ScrollableTabView
                    // titles: ['首页', '评测', '知识', '美食']
                    renderTabBar={() => <FeedsCategoryBar tabNames={titles}/>}

                    tabBarPosition='top'

                    scrollWithoutAnimation={false}

                >

                    {controllers.map((data, index) => {
                        // 顶部 tabBar 的组件名称
                        let Component = data.controller;

                        return (

                            <Component

                                key={titles[index]}

                                tabLabel={titles[index]}

                                categoryId={data.categoryId}

                                navigator={navigator}

                            />

                        )

                    })}

                </ScrollableTabView>

            </View>

        )

    }

}



const HeaderView = ({pictureAction}) => {

    return (

        <View style={[styles.header, {borderBottomWidth: gScreen.onePix}]}>

            <Image

                style={{width: 60, height: 30}}

                source={require('../../resource/ic_feed_nav.png')}

                resizeMode="contain"

            />

            <TouchableOpacity

                activeOpacity={0.75}

                style={styles.photo}

                onPress={pictureAction}

            >

                <Image

                    style={{width: 20, height: 20}}

                    source={require('../../resource/ic_feed_camera.png')}

                    resizeMode="contain"

                />

            </TouchableOpacity>

        </View>

    )

}



const styles = StyleSheet.create({

    header: {

        flexDirection: 'row',

        height: gScreen.navBarHeight,

        paddingTop: gScreen.navBarPaddingTop,

        alignItems: 'center',

        borderBottomColor: '#d9d9d9',

        backgroundColor: 'white',

        justifyContent: 'center'

    },

    photo: {

        width: __IOS__ ? 44 : 50,

        height: __IOS__ ? 44 : 50,

        justifyContent: 'center',

        alignItems: 'center',

        position: 'absolute',

        right: 0,

        top: gScreen.navBarPaddingTop

    }

})
