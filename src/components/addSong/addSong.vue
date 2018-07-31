<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box placeholder="搜索歌曲" @query="onQqueryChange" ref="searchBox"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" @select="selectSwitches" :currentIndex="currentIndex"></switches>
        <div class="list-wrapper">
          <Scroll class="list-scroll" ref="songList" :data="playHistory" v-if="currentIndex===0">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </Scroll>
          <Scroll ref="searchList" class="list-scroll" :refreshDelay="refreshDelay" v-if="currentIndex===1" :data="searchesHistory">
            <div class="list-inner">
              <search-list :searches="searchesHistory"
                           @deleteOne="deleteSearchesHistory"
                            @select="addQuery">
              </search-list>
            </div>
          </Scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" :showSing="showSing" @select="selectSuggest" @listScroll="inputBlur"></suggest>
      </div>
      <topTips ref="topTips">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放队列</span>
        </div>
      </topTips>
    </div>
  </transition>
</template>
<script>
  import SearchBox from 'base/searchBox/searchBox'
  import Suggest from 'components/suggest/suggest'
  import {searchMixin, addSongMixin} from 'common/js/mixin'
  import Switches from 'base/switches/switches'
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/songList/songList'
  import SearchList from 'base/searchList/searchList'
  import topTips from 'base/topTips/topTips'

  export default{
    mixins: [searchMixin, addSongMixin],
    data() {
      return {
        showFlag: false,
        showSing: false,
        switches: ['最近播放', '搜索历史'],
        currentIndex: 0
      }
    },
    computed: {
    },
    components: {
      SearchBox,
      Suggest,
      Switches,
      Scroll,
      SongList,
      SearchList,
      topTips
    },
    methods: {
      show() {
        this.showFlag = true
        setTimeout(() => {
          if (this.currentIndex === 0) {
            this.$refs.songList.refresh()
          } else {
            this.$refs.searchList.refresh()
          }
        }, 20)
      },
      hide() {
        this.showFlag = false
      },
      selectSuggest() {
        this.saveSearch()
        this.$refs.topTips.show()
      }
    },
    watch: {
      query(newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.searchList.refresh()
          }, 20)
        }
      }
    }
  }
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
