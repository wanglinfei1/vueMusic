<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import musicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getDiscList} from 'api/recommend'
  import {singerDetailsMixin} from 'common/js/mixin'
  import {creatSong} from 'common/js/song'
  import {ERR_OK} from 'api/config'

  export default {
    data() {
      return {
        songs: []
      }
    },
    mixins: [singerDetailsMixin],
    computed: {
      ...mapGetters([
        'disc'
      ]),
      title() {
        return this.disc.dissname
      },
      bgImage() {
        return this.disc.imgurl
      }
    },
    created() {
      this._getDiscSongList()
    },
    methods: {
      _getDiscSongList() {
        if (!this.disc.dissid) {
          this.$router.push({
            path: '/recommend'
          })
          return
        }
        getDiscList(this.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            let songDiscList = res.cdlist[0].songlist
            this.songs = this.normalSong(songDiscList)
          }
        })
      },
      normalSong(songDiscList) {
        let songList = []
        var ids = []
        var types = []
        for (var i = 0; i < songDiscList.length; i++) {
          var songDisc = songDiscList[i]
          ids.push(songDisc.songmid)
          types.push(songDisc.type)
          songList.push(creatSong(songDisc))
        }
        this._CgiGetVkey(ids, types, songDiscList)
        return songList
      }
    },
    components: {
      musicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
