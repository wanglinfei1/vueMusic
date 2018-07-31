<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click.stop="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :switches="switches" :currentIndex="currentIndex" @select="selectSwitches"></switches>
      </div>
      <div ref="playBtn" class="play-btn" @click="randomPlayHistory">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <Scroll ref="favoriteList" class="list-scroll" v-if="currentIndex === 0" :data="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectFavoriteSong"></song-list>
          </div>
        </Scroll>
        <Scroll ref="playList" class="list-scroll" v-if="currentIndex === 1" :data="playHistory">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </Scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResultShow">
        <no-result :title="noResultTitle"></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
  import Switches from 'base/switches/switches'
  import SongList from 'base/songList/songList'
  import Scroll from 'base/scroll/scroll'
  import NoResult from 'base/noResult/noResult'
  import {addSongMixin, playListMixin} from 'common/js/mixin'
  import {mapGetters, mapActions} from 'vuex'
  import Song from 'common/js/song'

  export default {
    mixins: [addSongMixin, playListMixin],
    data() {
      return {
        switches: ['我喜欢的', '我最近听的'],
        currentIndex: 0
      }
    },
    computed: {
      ...mapGetters([
        'favoriteList'
      ]),
      noResultTitle() {
        if (this.currentIndex === 0) {
          return '暂无收藏'
        } else {
          return '你没听过歌曲'
        }
      },
      noResultShow() {
        if (this.currentIndex === 0) {
          return !this.favoriteList.length
        } else {
          return !this.playHistory.length
        }
      }
    },
    components: {
      Switches,
      SongList,
      Scroll,
      NoResult
    },
    methods: {
      back() {
        this.$router.back()
      },
      handlePlayList(playList) {
        var bottom = playList.length ? '60px' : ''
        this.$refs.listWrapper.style.bottom = bottom
        if (this.currentIndex === 1) {
          this.$refs.playList.refresh()
        } else {
          this.$refs.favoriteList.refresh()
        }
      },
      selectFavoriteSong(item) {
        this.insertSong(new Song(item))
      },
      randomPlayHistory() {
        var list = this.currentIndex === 1 ? this.playHistory : this.favoriteList
        if (!list.length) {
          return
        }
        this.randomPlay({
          list: this.initSongList(list)
        })
      },
      initSongList(songList) {
        let ret = []
        songList.forEach((item) => {
          ret.push(new Song(item))
        })
        return ret
      },
      ...mapActions([
        'randomPlay'
      ])
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
