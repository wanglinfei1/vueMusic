<template>
  <div class="singer" ref="singer">
    <singer-list :data="singer" @select="selectSinger" ref="singerList"></singer-list>
    <router-view></router-view>
  </div>
</template>
<script>
import SingerList from 'base/singerList/singerList'
import { getSigerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import { mapMutations } from 'vuex'
import { playListMixin } from 'common/js/mixin'
const HOT_TITLE = '热门'
const NUM = 20
export default {
  mixins: [playListMixin],
  data() {
    return {
      singer: []
    }
  },
  mounted() {
    this._getSigerList()
  },
  methods: {
    handlePlayList(playList) {
      var bottom = playList.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.singerList.refresh()
    },
    _getSigerList() {
      getSigerList().then(res => {
        if (res.code === ERR_OK) {
          this.singer = this.initData(res.data.list)
        }
      })
    },
    initData(listData) {
      var map = {
        hot: {
          title: HOT_TITLE,
          list: []
        }
      }
      for (let i = 0; i < listData.length; i++) {
        if (i < NUM) {
          map.hot.list.push(
            new Singer({
              name: listData[i].Fsinger_name,
              id: listData[i].Fsinger_mid
            })
          )
        }
        var key = listData[i].Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            list: []
          }
        }
        map[key].list.push(
          new Singer({
            name: listData[i].Fsinger_name,
            id: listData[i].Fsinger_mid
          })
        )
      }
      var hot = []
      var item = []
      for (var i in map) {
        if (map[i].title === HOT_TITLE) {
          hot.push(map[i])
        } else if (map[i].title.match(/[a-z|A-Z]/)) {
          item.push(map[i])
        }
      }
      item.sort(function(a, b) {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(item)
    },
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    SingerList
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>