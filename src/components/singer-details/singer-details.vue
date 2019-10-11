<template>
  <transition name="slide">
    <music-list
      :title="title2"
      :songs="songs"
      :bgImage="bgImage2"
    ></music-list>
  </transition>
</template>
<script>
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getSingerDetails} from 'api/singer'
  import {creatSong} from 'common/js/song'
  import Singer from 'common/js/singer'
  import {singerDetailsMixin} from 'common/js/mixin'
  import {ERR_OK} from 'api/config'
  export default {
    data() {
      return {
        songs: [],
        singer2: {},
        title2: '',
        bgImage2: ''
      }
    },
    mixins: [singerDetailsMixin],
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.imgUrl
      },
      ...mapGetters([
        'singer'
      ])
    },
    created() {
      let id = this.$route.params.id
      this._getSingerDetails(id)
    },
    methods: {
      _getSingerDetails(id) {
        let singerId = this.singer.id || id
        if (!singerId) {
          this.$router.push({
            path: '/singer'
          })
          return
        }
        let _this = this
        getSingerDetails(singerId).then(function (res) {
          if (res.code === ERR_OK) {
            _this.songs = _this._normalizeSong(res.data.list)
            _this.singer2 = new Singer({
              name: res.data.singer_name,
              id: id
            })
            _this.titles = _this.singer2.name
            _this.bgImage2 = _this.singer2.imgUrl
          }
        })
      },
      _normalizeSong(songer) {
        var ret = []
        var ids = []
        var types = []
        songer.forEach((item) => {
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            ids.push(musicData.songmid)
            types.push(musicData.type)
            ret.push(creatSong(musicData))
          }
        })
        this._CgiGetVkey(ids, types, songer)
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .singer-details
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
