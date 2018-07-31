/**
 * Created by wanglinfei on 2017/9/8.
 */
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {palyMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import Song from 'common/js/song'

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlePlayList(this.playList)
  },
  activated() {
    this.handlePlayList(this.playList)
  },
  watch: {
    playList(newVal) {
      this.handlePlayList(newVal)
    }
  },
  methods: {
    handlePlayList() {
      throw new Error('component must implement handlePlayList method')
    }
  }
}

export const playMixin = {
  computed: {
    iconMode() {
      return this.mode === palyMode.sequence ? 'icon-sequence' : this.mode === palyMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'mode',
      'playList',
      'favoriteList'
    ])
  },
  methods: {
    changeMode() {
      var mode = (this.mode + 1) % 3
      this.setMode(mode)
      let list = null
      if (mode === palyMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    isFavorite(song) {
      var index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapMutations({
      setPlay: 'SET_PLAY',
      setCurrentIndex: 'SET_CURRENTINDEX',
      setMode: 'SET_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}

export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters([
      'searchesHistory'
    ])
  },
  methods: {
    onQqueryChange(newQuery) {
      this.query = newQuery
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    saveSearch(item) {
      this.saveSearchesHistory(this.query)
    },
    inputBlur() {
      this.$refs.searchBox.blur()
    },
    ...mapActions([
      'saveSearchesHistory',
      'deleteSearchesHistory'
    ])
  }
}

export const addSongMixin = {
  computed: {
    ...mapGetters([
      'playHistory'
    ])
  },
  methods: {
    selectSwitches(item, index) {
      this.currentIndex = index
    },
    selectSong(item, index) {
      if (index !== 0) {
        this.insertSong(new Song(item))
        if (this.$refs.topTips) {
          this.$refs.topTips.show()
        }
      }
    },
    ...mapActions([
      'insertSong'
    ])
  }
}
