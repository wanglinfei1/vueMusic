<template>
  <Scroll class="suggest"
          ref="suggest"
          v-show="query"
          @scrollToEnd="searchMore"
          @scrollDownEnd="scrollDownEnd"
          :pullUp="pullUp"
          :pullDown="pullDown"
          :beforeScroll="beforeScroll"
          @beforeScroll="listScroll"
          :data="result">
    <ul class="suggest-list">
      <li class="suggest-item"
          v-for="item in result"
          @click="selectItem(item)"
          :key="item.key">
        <div class="icon">
          <i :class="getIconCla(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <Loading v-show="hasMore" title=""></Loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </Scroll>
</template>
<script>
  import {getSearch} from 'api/search'
  import {singerDetailsMixin} from 'common/js/mixin'
  import {ERR_OK} from 'api/config'
  import {creatSong} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading'
  import Singer from 'common/js/singer'
  import {mapMutations, mapActions} from 'vuex'
  import NoResult from 'base/noResult/noResult'

  const TYPE_SINGER = 'singer'

  export default {
    data() {
      return {
        page: 1,
        perpage: 40,
        result: [],
        pullUp: true,
        pullDown: true,
        hasMore: true,
        beforeScroll: true
      }
    },
    mixins: [singerDetailsMixin],
    props: {
      query: {
        type: String,
        default: ''
      },
      showSing: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      listScroll() {
        this.$emit('listScroll')
      },
      scrollDownEnd(pos) {
        console.log(pos)
      },
      refresh() {
        this.$refs.suggest.refresh()
      },
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          var singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
        this.$emit('select', item)
      },
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page++
        getSearch(this.query, this.page, this.perpage, this.showSing).then((res) => {
          if (ERR_OK === res.code) {
            this.result = this.result.concat(this._getResult(res.data, this.result))
            console.log(this.result)
            this._checkMore(res.data)
          }
        })
      },
      search() {
        if (!this.query) {
          return
        }
        this.page = 1
        this.hasMore = true
        this.result = []
        this.$refs.suggest.scrollTo(0, 0)
        getSearch(this.query, this.page, this.perpage, this.showSing).then((res) => {
          if (ERR_OK === res.code) {
            this.result = this._getResult(res.data, [])
            this._checkMore(res.data)
          }
        })
      },
      _checkMore(data) {
        var song = data.song
        if (!song.list.length || (song.curnum + song.curpage * this.perpage) >= song.totalnum) {
          this.hasMore = false
        }
      },
      _getResult(data, _result) {
        let ret = []
        if (data.song) {
          ret = ret.concat(this._normaliszeSongs(data.song.list, _result, data))
        }
        if (this.showSing && data.zhida && data.zhida.type) {
          var typeKey = data.zhida.type === 2 ? 'zhida_album' : data.zhida.type === 1 ? 'zhida_singer' : data.zhida.type === 4 ? 'zhida_tv' : ''
          if (typeKey) {
            var zhida = {
              singermid: data.zhida[typeKey].singerMID,
              singername: data.zhida[typeKey].singerName,
              id: data.zhida[typeKey].singerID
            }
            ret.push({...zhida, ...{type: TYPE_SINGER}})
          }
        }
        return ret
      },
      _normaliszeSongs(list, _result, data) {
        var ret = []
        var ids = []
        var types = []
        list.forEach((listData) => {
          if (listData.album && listData.album.mid) {
            var musicData = {
              songid: listData.id || listData.ksong.id,
              songmid: listData.mid || listData.ksong.mid,
              songname: listData.name,
              singer: listData.singer,
              albumname: listData.album.name,
              interval: listData.interval,
              albummid: listData.album.mid,
              type: listData.type,
              purl: ''
            }
            ids.push(musicData.songmid)
            types.push(musicData.type)
            ret.push(creatSong(musicData))
          }
        })
        this._CgiGetVkey(ids, types, list, 'suggest').then((midurlJson) => {
          this._normalizeSongUrl(list, midurlJson, _result, data)
        }).catch(() => {
          this.result = _result.concat(ret)
        })
        return ret
      },
      _normalizeSongUrl(list, midurlJson, _result, data) {
        var songs = []
        if (this.showSing && data.zhida && data.zhida.type) {
          var typeKey = data.zhida.type === 2 ? 'zhida_album' : data.zhida.type === 1 ? 'zhida_singer' : data.zhida.type === 4 ? 'zhida_tv' : ''
          if (typeKey) {
            var zhida = {
              singermid: data.zhida[typeKey].singerMID,
              singername: data.zhida[typeKey].singerName,
              id: data.zhida[typeKey].singerID
            }
            songs.push({...zhida, ...{type: TYPE_SINGER}})
          }
        }
        list.forEach((listData, i) => {
          var mid = listData.mid || listData.ksong.mid
          var musicData = {
            songid: listData.id || listData.ksong.id,
            songmid: mid,
            songname: listData.name,
            singer: listData.singer,
            albumname: listData.album ? listData.album.name : '',
            interval: listData.interval,
            albummid: listData.album ? listData.album.mid : '',
            purl: midurlJson[mid] ? midurlJson[mid].purl || '' : '',
            vkey: midurlJson[mid] ? midurlJson[mid].vkey || '' : '',
            filename: midurlJson[mid] ? midurlJson[mid].filename || '' : ''
          }
          if (mid && listData.album && listData.album.mid) {
            songs.push(creatSong(musicData))
          }
        })
        this.result = _result.concat(songs)
      },
      getIconCla(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      ...mapMutations({
        'setSinger': 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query() {
        this.search()
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
