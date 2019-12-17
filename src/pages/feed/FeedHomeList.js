/**

 * Created by ljunb on 2016/11/19.

 * 逛吃-首页

 */

import React, {Component} from 'react';

import {observer} from 'mobx-react/native'

import {

    StyleSheet,

    View,

    ScrollView,

    Text,

    Image,

    TouchableOpacity,
    /*
    * 这一组件可以用在ScrollView或FlatList内部，为其添加下拉刷新的功能。
    * 当ScrollView处于竖直方向的起点位置（scrollY: 0），此时下拉会触发一个onRefresh事件
    * */
    RefreshControl,
    // ActivityIndicator的效果就是在安卓中或iOS中经常看到的加载中，ios为菊花按钮
    ActivityIndicator

} from 'react-native'

import {reaction} from 'mobx'
// 加载时的样式组件
import Loading from '../../components/Loading'
//请求数据的组件
import FeedBaseStore from '../../store/feedBaseStore'
// Auto responsive grid layout library for ReactNative.
//react自动网格布局
import AutoResponisve from 'autoresponsive-react-native'


// 柔软，体贴
const DELICACY_ID = 1

const itemWidth = (gScreen.width - 15 * 2 - 10) / 2



let canLoadMore = false;



@observer

export default class FeedDelicacyList extends Component {



    // 构造

    constructor(props) {

        super(props);

        // 初始状态
        // 传给该类的categoryId
        this.homeFeedStore = new FeedBaseStore(DELICACY_ID)

    }



    componentDidMount() {
        // mobx里的组件
        // autorun 的变种，对于如何追踪 observable 赋予了更细粒度的控制。 它接收两个函数参数，第一个(数据 函数)是用来追踪并返回数据作为第二个函数(效果 函数)的输入。
        // 不同于 autorun的是当创建时效果 函数不会直接运行，只有在数据表达式首次返回一个新值后才会运行。 在执行 效果 函数时访问的任何 observable 都不会被追踪。
        this.dispose = reaction(

            () => this.homeFeedStore.page,
            // 执行获取数据、修改数据的操作
            () => this.homeFeedStore.fetchFeedList()

        );

    }



    componentWillUnmount() {

        this.dispose()

    }


    /*
    * redux改变值的方式是通过拷贝原来的对象生成新的对象，从而触发组件的componentWillReceiveProps，
    * 而MobX改变值只是在原始值的基础上改变，所以值的引用是没有改变的，这也就导致使MobX不会触发componentWillReceiveProps。
    *
    * 基于这种原因所以mobx-react提供了componentWillReact来触发MobX值的改变，但是它不只是监听MobX值的改变，
    * 同时包含componentReceiveProps的功能，所以在使用MobX之后，并不需要componentWillReceiveProps方法了。
    * */
    componentWillReact() {

        const {errorMsg} = this.homeFeedStore

        errorMsg && this.toast.show(errorMsg)

    }
    /*
    * react native scrollview触摸滚动事件
    * onMomentumScrollEnd：当一帧滚动完毕时调用.
    * onScrollAnimationEnd ：ios上的当滚动动画结束时调用.
    * */

    onMomentumScrollEnd = event => {
        // contentOffset:内容滑动的长 layoutMeasurement: 布局长度 contentSize: 内容尺寸（总长度）
        const {contentOffset, layoutMeasurement, contentSize} = event.nativeEvent;

        let contentSizeH = contentSize.height;
        // viewBottomY 浏览的内容总长度
        let viewBottomY = contentOffset.y + layoutMeasurement.height;



        canLoadMore = viewBottomY >= contentSizeH;

        // 判断分页
        if (Math.abs(viewBottomY - contentSizeH) <= 40 && canLoadMore) {

            this.homeFeedStore.page++

            canLoadMore = false

        }

    }



    onRefresh = () => {

        this.homeFeedStore.page = 1

        canLoadMore = false

    }

    getAutoResponsiveProps = () => ({itemMargin: 10})



    renderChildren = (feed, key) => {

        // 默认高度

        let height = itemWidth + 50;

        // 标题高度
        let titleHeight = 30;

        if (feed.description) {

            if (feed.description.length !== 0 && feed.description.length < 13) {

                titleHeight += 25;

            } else if (feed.description.length >= 13) {

                titleHeight += 40

            }

        }

        height += titleHeight;



        if (feed.content_type !== 5) height = itemWidth + 50;



        const style = {

            width: itemWidth,

            height,

            marginLeft: 15

        }



        return (

            <HomeItem

                titleHeight={titleHeight}

                style={style}

                key={`${feed.item_id}-${key}`}

                feed={feed}

                onPress={this.onPressCell}

            />

        )

    }



    onPressCell = feed => {

        this.props.navigator.push({

            id: 'FeedDetail',

            passProps: {feed}

        })

    }



    render() {

        const {feedList, isFetching} = this.homeFeedStore

        const feedArray = feedList.slice()

        let scrollViewH = gScreen.height - gScreen.navBarHeight - 44 - 49;



        return (

            <View style={{backgroundColor: '#f5f5f5', flex: 1}}>

                <ScrollView

                    contentContainerStyle={{paddingTop: 10}}

                    ref={scrollView => this.scrollView = scrollView}

                    style={{width: gScreen.width, height: scrollViewH}}

                    automaticallyAdjustContentInsets={false}

                    removeClippedSubviews

                    bounces

                    scrollEventThrottle={16}

                    onMomentumScrollEnd={this.onMomentumScrollEnd}

                    refreshControl={

                        <RefreshControl

                            refreshing={isFetching}

                            onRefresh={this.onRefresh}

                            colors={['rgb(217, 51, 58)']}

                        />

                    }

                >

                    {!isFetching &&

                    <AutoResponisve {...this.getAutoResponsiveProps()}>

                        {feedArray.map(this.renderChildren)}

                    </AutoResponisve>

                    }

                    {!isFetching &&

                    <View style={[styles.loadingContainer]}>

                        <ActivityIndicator />

                        <Text style={{fontSize: 14, marginLeft: 5}}>正在加载更多的数据...</Text>

                    </View>}

                </ScrollView>

                <Loading isShow={isFetching}/>

            </View>

        );

    }

}



@observer

class HomeItem extends Component {



    onPress = () => {

        const {onPress, feed} = this.props

        onPress && onPress(feed)

    }



    render() {

        const {feed, onPress, style, titleHeight} = this.props

        let imageH = feed.content_type != 5 ? style.width + 50 : style.width;



        // 返回的数据中，头像出现null的情况，所以source仍然做个判断

        let publisherAvatar = feed.publisher_avatar ? {uri: feed.publisher_avatar} : require('../../resource/img_default_avatar.png');



        return (

            <TouchableOpacity

                activeOpacity={0.75}

                style={[{backgroundColor: '#fff'}, style]}

                onPress={this.onPress}

            >

                <Image

                    style={{width: style.width, height: imageH}}

                    source={{uri: feed.card_image.split('?')[0]}}

                    defaultSource={require('../../resource/img_horizontal_default.png')}

                />

                {feed.content_type == 5 &&

                <View style={{

                    height: titleHeight,

                    width: style.width,

                    paddingHorizontal: 4,

                    paddingTop: 8,

                }}>

                    <View style={{

                        height: titleHeight - 8,

                        width: style.width - 8,

                        justifyContent: 'space-around',

                        borderBottomWidth: gScreen.onePix,

                        borderColor: '#ccc'

                    }}>

                        <Text style={{fontSize: 14, color: 'black'}} numberOfLines={1}>{feed.title}</Text>

                        {feed.description != '' &&

                        <Text style={{color: 'gray', fontSize: 13}} numberOfLines={2}>{feed.description}</Text>

                        }

                    </View>

                </View>

                }

                {feed.content_type == 5 &&

                <View style={{

                    flexDirection: 'row',

                    alignItems: 'center',

                    justifyContent: 'space-between',

                    height: 50,

                    paddingHorizontal: 4

                }}>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>

                        <Image

                            style={{height: 30, width: 30, borderRadius: 15}}

                            source={publisherAvatar}

                            defaultSource={require('../../resource/img_default_avatar.png')}

                        />

                        <Text

                            style={{fontSize: 11, color: 'gray', marginLeft: 8, width: style.width * 0.4}}

                            numberOfLines={1}

                        >

                            {feed.publisher}

                        </Text>

                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>

                        <Image style={{height: 12, width: 12}} source={require('../../resource/ic_feed_like.png')}/>

                        <Text style={{fontSize: 11, color: 'gray', marginLeft: 2}}>{feed.like_ct}</Text>

                    </View>

                </View>

                }

            </TouchableOpacity>

        )

    }

}





const styles = StyleSheet.create({

    contentContainer: {

        flexDirection: 'row',

        flexWrap: 'wrap',

        overflow: 'hidden'

    },

    loadingContainer: {

        height: 40,

        justifyContent: 'center',

        alignItems: 'center',

        flexDirection: 'row'

    }

})
