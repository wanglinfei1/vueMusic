<template>
  <div class="search">
    <div class="search-box-wrapper">
      <!--searchBox query变化时派发query事件 search component监听该事件获取query值-->
      <!--search component将该值传递给suggest component-->
      <!--suggest component 监听到query值的变化调用search函数-->
      <!--<search-box ref="searchBox" @query="onQueryChange"></search-box>-->
      <search-box ref="searchBox" @query="onQqueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
      <Scroll class="shortcut" ref="shortcut" :refreshDelay="refreshDelay" :data="shortCut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item"
                  v-for="item in hotKey"
                  @click="addQuery(item.k)"
                  :key="item.key">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <!--搜索历史部分-->
          <div class="search-history" v-show="searchesHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
            </h1>
            <!--搜索历史列表-->
            <search-list :searches="searchesHistory" @select="addQuery"
                         @deleteOne="deleteSearchesHistory"></search-list>
          </div>
        </div>
      </Scroll>
    </div>
    <div class="search-result" ref="searchResult" v-show="query">
      <!--搜索结果component-->
      <suggest @select="saveSearch" ref="suggest" :query="query" @listScroll="inputBlur"></suggest>
    </div>
    <confirm ref="confirm" @confirm="clearSearchesHistory" :text="confirmText" confirmBtnText="清空"></confirm>
    <router-view></router-view>
  </div>
</template>
<script>
  import SearchBox from 'base/searchBox/searchBox'
  import SearchList from 'base/searchList/searchList'
  import Suggest from 'components/suggest/suggest'
  import Scroll from 'base/scroll/scroll'
  import confirm from 'base/confirm/confirm'
  import {getHotKey} from 'api/search'
  import {ERR_OK, hotKeyNum} from 'api/config'
  import {playListMixin, searchMixin} from 'common/js/mixin'
  import {mapActions} from 'vuex'

  export default {
    data() {
      return {
        hotKey: [],
        confirmText: '是否清空搜索记录？'
      }
    },
    computed: {
      shortCut() {
        return this.hotKey.concat(this.searchesHistory)
      }
    },
    mixins: [playListMixin, searchMixin],
    components: {
      SearchBox,
      SearchList,
      Suggest,
      Scroll,
      confirm
    },
    created() {
      this._getHotKey()
    },
    methods: {
      showConfirm() {
        this.$refs.confirm.show()
      },
      handlePlayList(playList) {
        const bottom = playList.length > 0 ? '60px' : ''
        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()
        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()
      },
      _getHotKey() {
        getHotKey().then((res) => {
          if (ERR_OK === res.code) {
            var resData = res.data.hotkey
            this.hotKey = resData.slice(1, hotKeyNum)
          }
        })
      },
      ...mapActions([
        'clearSearchesHistory'
      ])
    },
    watch: {
      query(newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
