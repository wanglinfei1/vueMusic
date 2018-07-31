<template>
  <Scroll class="list-view"
          :data="data"
          ref="listView"
          :listenScroll="listenScroll"
          :probeType="probeType"
          @scroll="scroll"
  >
    <ul>
      <li class="list-group" v-for="item in data" :key="item.key" ref="groupList">
        <h2 class="list-group-title">{{item.title}}</h2>
        <ul>
          <li class="list-group-item"
              v-for="list in item.list"
              :key="list.key"
              @click="selectItem(list)"
          >
            <img alt="" class="avatar" v-lazy="list.imgUrl">
            <span class="name">{{list.name}}</span>
          </li>
        </ul>
      </li>
    </ul>

    <!--右侧快速定位列表-->
    <div class="list-shortcut">
      <ul>
        <li class="item"
            v-for="(item,index) in shortcutList"
            :class="{'current':currentIndex === index}"
            :data-index="index"
            @touchstart="onShortcutTouchStart"
            @touchmove.stop.prevent="onShortcutTouchMove"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title"> {{fixedTitle}} </h1>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </Scroll>
</template>
<script>
  import Scroll from 'base/scroll/scroll'
  import loading from 'base/loading/index'
  import {getData} from 'common/js/dom'
  const ANCHOR_HEIGHT = 18
  const TITLE_HEIGHT = 30
  export default{
    data() {
      return {
        currentIndex: 0,
        scrollY: -1,
        diff: -2
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    components: {
      Scroll,
      loading
    },
    created() {
      this.listHeight = []
      this.touch = {}
      this.listenScroll = true
      this.probeType = 3
    },
    computed: {
      shortcutList() {
        return this.data.map((item) => {
          return item.title.substr(0, 1)
        })
      },
      fixedTitle() {
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this.calcHeight()
        }, 20)
      },
      scrollY(newY) {
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        const listHeight = this.listHeight
        for (var i = 0; i < listHeight.length - 1; i++) {
          var height1 = listHeight[i]
          var height2 = listHeight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }
        if (-newY > listHeight[listHeight.length - 1]) {
          this.currentIndex = listHeight.length - 2
        }
      },
      diff(newVal) {
        var fixTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixTop === fixTop) {
          return
        }
        this.fixTop = fixTop
        this.$refs.fixed.style.transform = `translate3d(0, ${fixTop}px, 0)`
      }
    },
    methods: {
      refresh() {
        this.$refs.listView.refresh()
      },
      onShortcutTouchStart(e) {
        let touchEv = e.touches[0]
        this.touch.y1 = touchEv.pageY
        let anchorIndex = getData(e.target, 'index')
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove(e) {
        let touchEv = e.touches[0]
        this.touch.y2 = touchEv.pageY
        var dataScroll = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        let anchorIndex = parseInt(this.touch.anchorIndex) + dataScroll
        this._scrollTo(anchorIndex)
      },
      _scrollTo(index) {
        if (!index && index !== 0) {
          return
        }
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        this.scrollY = -this.listHeight[index]
        this.$refs.listView.scrollToElement(this.$refs.groupList[index], 0)
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      calcHeight() {
        this.listHeight = []
        const list = this.$refs.groupList
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      selectItem(list) {
        this.$emit('select', list)
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .list-view
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
