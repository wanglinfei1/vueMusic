<template>
  <div class="player" v-show="playList.length > 0" v-if="currentSong">
    <!--播放页面全屏-->
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <!--背景 模糊-->
        <div class="background">
          <img alt="" width="100%" height="100%" :src="currentSong.image">
        </div>
        <!--顶部-->
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <!--中间cd部分-->
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdClass">
                <img alt="" class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">
                {{playLyric}}
              </div>
            </div>
          </div>
          <Scroll class="middle-r" ref="lyricList" :data="currentLyric&&currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   :class="{'current': currentLineNum === index}"
                   v-for="(line,index) in currentLyric.lines" :key="index">{{line.txt}}</p>
              </div>
            </div>
          </Scroll>
        </div>
        <!--底部按钮控制部分-->
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">
              {{format(currentTime)}}
            </span>
            <!--播放进度条-->
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onpercentChange"></progress-bar>
            </div>
            <span class="time time-r">
              {{format(currentSong.duration)}}
            </span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" @click="toggerPlaying" :class="disableCls">
              <i :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon" :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!--播放页面小屏 底部-->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="openPlayer">
        <div class="icon">
          <img alt="" width="40" height="40" :src="currentSong.image" :class="cdClass">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="32" :percent="percent">
            <i :class="miniPlayIcon" class="icon-mini" @click.stop="toggerPlaying"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlayList">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <playList ref="playList"></playList>
    <audio
      :src="currentSong.url||currentSong.url2"
      ref="audio"
      @timeupdate="updatatime"
      @play="ready"
      @error="error"
      @ended="end"></audio>
  </div>
</template>
<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from 'common/js/dom'
  import ProgressBar from 'base/progressBar/progressBar'
  import ProgressCircle from 'base/progressCircle/progressCircle'
  import playList from 'base/playList/playList'
  import {palyMode} from 'common/js/config'
  import Scroll from 'base/scroll/scroll'
  import Lyric from 'lyric-parser'
  import {playMixin} from 'common/js/mixin'

  const transform = prefixStyle('transform')
  const transition = prefixStyle('transition')

  export default{
    mixins: [playMixin],
    data() {
      return {
        readyState: false,
        currentTime: 0,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playLyric: ''
      }
    },
    created() {
      this.touch = {}
    },
    computed: {
      cdClass() {
        return this.play ? 'play' : 'play pause'
      },
      playIcon() {
        return this.play ? 'icon-pause' : 'icon-play'
      },
      miniPlayIcon() {
        return this.play ? 'icon-pause-mini' : 'icon-play-mini'
      },
      disableCls() {
        return this.readyState ? '' : 'disable'
      },
      percent() {
        return this.currentTime / this.currentSong.duration
      },
      ...mapGetters([
        'fullScreen',
        'play',
        'currentIndex'
      ])
    },
    methods: {
      showPlayList() {
        this.$refs.playList.show()
      },
      back() {
        this.setFullScreen(false)
      },
      toggerPlaying() {
        if (!this.readyState) {
          return
        }
        this.setPlay(!this.play)
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      end() {
        if (this.mode === palyMode.loop) {
          this.loop(1)
        } else {
          this.next(1)
        }
      },
      loop(type) {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
      next(type) {
        if (!this.readyState) {
          return
        }
        if (this.playList.length === 1) {
          this.loop(type)
          return
        } else {
          var index = this.currentIndex + 1
          if (index === this.playList.length) {
            index = 0
          }
          this.setCurrentIndex(index)
          if (!this.play) {
            this.toggerPlaying()
          }
        }
        this.readyState = false
      },
      prev() {
        if (!this.readyState) {
          return
        }
        if (this.playList.length === 1) {
          this.loop()
          return
        } else {
          var index = this.currentIndex - 1
          if (index === -1) {
            index = this.playList.length
          }
          this.setCurrentIndex(index)
          if (!this.play) {
            this.toggerPlaying()
          }
        }
        this.readyState = false
      },
      ready() {
        this.readyState = true
        this.savePlayHistory(this.currentSong)
      },
      error() {
        this.readyState = true
      },
      openPlayer() {
        this.setFullScreen(true)
      },
      updatatime(e) {
        this.currentTime = e.target.currentTime
      },
      onpercentChange(percent) {
        var currentTime = this.currentSong.duration * percent
        this.$refs.audio.currentTime = currentTime
        if (!this.play) {
          this.toggerPlaying()
        }
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      format(interval) {
        interval = interval | 0
        var minute = interval / 60 | 0
        var second = this._pad(interval % 60)
        return `${minute}:${second}`
      },
      _pad(num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      enter(el, done) {
        var {x, y, scale} = this._getPosAndScale()
        var animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }
        animations.registerAnimation({
          name: 'move',
          animation: animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter() {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done) {
        this.$refs.cdWrapper.style.transition = '0.4s all'
        var {x, y, scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave() {
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      _getPosAndScale() {
        var targetWidth = 40
        var paddingLeft = 40
        var paddingBottom = 30
        var paddingTop = 80
        var width = window.innerWidth * 0.8
        var scale = targetWidth / width
        var x = -(window.innerWidth / 2 - paddingLeft)
        var y = window.innerHeight - paddingTop - width / 2 - paddingBottom
        return {
          x,
          y,
          scale
        }
      },
      ...mapMutations({
        setFullScreen: 'SET_FULLSCREEN'
      }),
      ...mapActions([
        'savePlayHistory'
      ]),
      nopurlpause: function (audio, song) {
        console.log('======缺少音频资源======', song)
        audio.pause()
        audio.currentTime = 0
        if (this.currentLyric) {
          this.currentLyric.stop()
          this.currentLineNum = 0
          this.currentTime = 0
        }
      },
      getPurl: function (song) {
        var audio = this.$refs.audio
        if (song.puppeteer) {
          this.nopurlpause(audio, song)
          return
        }
        this.currentSong.getPurl().then((data) => {
          var url = data.url || ''
          var from = data.from || ''
          console.log(url, from)
          try {
            clearTimeout(this.timer3)
            this.timer3 = setTimeout(() => {
              audio.play()
              if (this.currentLyric) {
                this.currentLyric.play()
              }
            }, 300)
          } catch (err) {
            console.log(err)
          }
        }).catch((res) => {
          this.nopurlpause(audio, song)
        })
      },
      getLyric: function () {
        this.currentSong.getLyric().then((lyric) => {
          if (this.currentSong.lyric !== lyric) {
            return
          }
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          if (this.play && (this.currentSong.url || this.currentSong.url2)) {
            this.currentLyric.play()
          }
        }).catch((res) => {
          this.currentLyric = null
          this.playLyric = ''
          this.currentLineNum = 0
        })
      },
      handleLyric: function ({lineNum, txt}) {
        if (!this.$refs.lyricList) {
          return
        }
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playLyric = txt
      },
      middleTouchStart: function (e) {
        let Touch = e.touches[0]
        this.touch.initiated = false
        this.touch.pageX = Touch.pageX
        this.touch.pageY = Touch.pageY
      },
      middleTouchMove: function (e) {
        if (this.touch.initiated) {
          return
        }
        let Touch = e.touches[0]
        const distX = Touch.pageX - this.touch.pageX
        const distY = Touch.pageY - this.touch.pageY
        if (Math.abs(distX) < Math.abs(distY)) {
          return
        }
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + distX))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transition] = `all linear 0`
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style[transition] = `all linear 0`
      },
      middleTouchEnd: function () {
        this.touch.initiated = true
        let offsetWidth, opacity
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.2) {
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.8) {
            offsetWidth = 0
            opacity = 1
            this.currentShow = 'cd'
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transition] = `all linear 300ms`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style[transition] = `all linear 300ms`
      }
    },
    watch: {
      currentSong(newSong, oldSong) {
        if (!newSong || !newSong.id || newSong === oldSong) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric.stop()
          this.currentLineNum = 0
          this.playLyric = ''
          this.currentTime = 0
        }
        var _this = this
        clearTimeout(this.timer)
        this.timer = setTimeout(function () {
          var audio = _this.$refs.audio
          var audioSrc = audio.getAttribute('src')
          if (audioSrc) {
            audio.play()
          } else {
            _this.getPurl(newSong)
          }
          _this.getLyric()
        }, 1000)
      },
      play(newplay) {
        clearTimeout(this.timer2)
        this.timer2 = setTimeout(() => {
          var audio = this.$refs.audio
          var audioSrc = audio.getAttribute('src')
          if (!audio || !audioSrc) {
            return
          }
          newplay ? audio.play() : audio.pause()
        }, 500)
      }
    },
    components: {
      animations,
      ProgressBar,
      ProgressCircle,
      Scroll,
      playList
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
