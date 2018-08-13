<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs" :rank="rank"></music-list>
  </transition>
</template>
<script>
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getTopList} from 'api/topList'
  import {CgiGetVkey} from 'api/songurl'
  import {ERR_OK} from 'api/config'
  import {creatSong} from 'common/js/song'

  export default {
    data() {
      return {
        songs: [],
        rank: true
      }
    },
    computed: {
      ...mapGetters([
        'topList'
      ]),
      title() {
        return this.topList.topTitle
      },
      bgImage() {
        if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
      }
    },
    created() {
      this._getTopListSong()
    },
    methods: {
      _getTopListSong() {
        if (!this.topList.id) {
          this.$router.push({
            path: '/rank'
          })
          return
        }
        getTopList(this.topList.id).then((res) => {
          if (ERR_OK === res.code) {
            this.songs = this.normalSong(res.songlist)
          }
        })
      },
      normalSong(list) {
        let songList = []
        var ids = []
        var types = []
        for (var i = 0; i < list.length; i++) {
          var listData = list[i].data
          if (listData.songid && listData.albumid) {
            ids.push(listData.songmid)
            types.push(listData.type)
            songList.push(creatSong(listData))
          }
        }
        CgiGetVkey(ids, types).then((res) => {
          if (res.code === ERR_OK) {
            var midurlinfo = res.url_mid.data.midurlinfo
            var midurlJson = {}
            midurlinfo.forEach((midurlitem) => {
              midurlJson[midurlitem.songmid] = midurlitem
            })
            this._normalizeSongUrl(list, midurlJson)
          }
        })
        return songList
      },
      _normalizeSongUrl(list, midurlJson) {
        let songList = []
        for (var i = 0; i < list.length; i++) {
          var listData = list[i].data
          if (listData.songid && listData.albumid && midurlJson[listData.songmid]) {
            listData.purl = midurlJson[listData.songmid].purl
            songList.push(creatSong(listData))
          }
        }
        this.songs = songList
      }
    },
    components: {
      MusicList
    }
  }

</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
