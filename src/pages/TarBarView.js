import React, {PureComponent} from 'react'

import {observer, inject} from 'mobx-react/native'
// 主要
import Feed from './feed/Feed'

// 首页视图（食物百科）
import FoodEncyclopedia from './home/FoodEncyclopedia'

import Profile from './profile/Profile'

import TabBar from '../components/TabBar'

import ScrollableTabView from 'react-native-scrollable-tab-view'



const tabTitles = ['食物百科', '逛吃', '我的']

const tabIcons = [

    require('../resource/ic_tab_search.png'),

    require('../resource/ic_tab_homepage.png'),

    require('../resource/ic_tab_my.png')

]

// 选中后的样式
const tabSelectedIcon = [

    require('../resource/ic_tab_search_select.png'),

    require('../resource/ic_tab_homepage_select.png'),

    require('../resource/ic_tab_my_select.png')

]



@inject('app')

@observer

export default class TabBarView extends PureComponent {



    onChangeTab = ({i}) => {

        const {app} = this.props

        if (i === 1) {

            app.updateBarStyle('default')

        } else {

            app.updateBarStyle('light-content')

        }

    }



    renderTabBar = () => {

        return (

            <TabBar

                tabNames={tabTitles}

                tabIconNames={tabIcons}

                selectedTabIconNames={tabSelectedIcon}

            />

        )

    }



    render() {

        return (

            <ScrollableTabView

                locked

                scrollWithoutAnimation

                renderTabBar={this.renderTabBar}

                tabBarPosition='bottom'

                onChangeTab={this.onChangeTab}

            >

                <FoodEncyclopedia tabLabel="Food" navigator={this.props.navigator}/>

                <Feed tabLabel="Home" navigator={this.props.navigator}/>

                <Profile tabLabel="Profile" navigator={this.props.navigator}/>

            </ScrollableTabView>

        )

    }

}
