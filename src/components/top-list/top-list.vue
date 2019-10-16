<template>
  <transition name="slide">
    <music-list
      :title="title"
      :bgImage="bgImage"
      :songs="songs"
      :rank="rank"
    ></music-list>
  </transition>
</template>
<script>
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getTopList } from 'api/topList'
import { ERR_OK } from 'api/config'
import { creatSong } from 'common/js/song'
import { singerDetailsMixin } from 'common/js/mixin'

export default {
  data() {
    return {
      songs: [],
      rank: true
    }
  },
  mixins: [singerDetailsMixin],
  computed: {
    ...mapGetters([
      'topList'
    ]),
    title() {
      return this.topList.topTitle
    },
    bgImage() {
      if (this.songs.length) {
        // console.log(this.songs[0])
        return this.songs[0].image2 || this.songs[0].image
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
      this._CgiGetVkey(ids, types, list)
      return songList
    }
  },
  components: {
    MusicList
  }
}

</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
