<template>
  <div class="recommend" ref="recommend">
    <Scroll class="recommend-content" ref="scroll" :data="discList">
      <div>
        <div class="slider-wrapper" v-if="recommendList.length">
          <slider>
            <!--slot-->
            <div v-for="item in recommendList" :key="item.key">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" @load="loadImage" class="needsclick">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList"
                class="item needsclick"
                @click="selectItem(item)"
                :key="item.key">
              <div class="icon">
                <img :src="item.imgurl" width="60" height="60" alt="">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <Loading></Loading>
      </div>
    </Scroll>
    <router-view></router-view>
  </div>
</template>

<script>
  import Slider from 'base/slider/index'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/index'
  import {getRecommend, getPlayList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import {playListMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'

  export default {
    mixins: [playListMixin],
    data() {
      return {
        recommendList: [],
        discList: []
      }
    },
    created() {
      this._getRecommend()
      this._getPlayList()
    },
    methods: {
      ...mapMutations({
        setDisc: 'SET_DISC'
      }),
      selectItem(item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        this.setDisc(item)
      },
      handlePlayList(playList) {
        var bottom = playList.length > 0 ? '60px' : ''
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      _getRecommend () {
        getRecommend().then(res => {
          if (res.code === ERR_OK) {
            this.recommendList = res.data.slider
          }
        })
      },
      _getPlayList () {
        getPlayList().then(res => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          }
        })
      },
      loadImage () {
        if (!this.checkLoaded) {
          this.$refs.scroll.refresh()
          this.checkLoaded = true
        }
      }
    },
    components: {
      Slider,
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
