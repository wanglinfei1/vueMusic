/**
 * Created by wanglinfei on 2017/9/8.
 */
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { palyMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import Song from 'common/js/song'
import { CgiGetVkey, getPuppeteerList } from 'api/songurl'
import { ERR_OK } from 'api/config'
import { creatSong } from './song'

export const singerDetailsMixin = {
  methods: {
    _CgiGetVkey(ids, types, songer, other, index) {
      index = index || 0
      index++
      return new Promise((resolve, reject) => {
        CgiGetVkey(ids, types).then((res) => {
          if (res.code === ERR_OK) {
            var midurlinfo = res.url_mid.data.midurlinfo
            var midurlJson = {}
            midurlinfo.forEach((midurlitem) => {
              if (midurlitem.songmid) {
                midurlJson[midurlitem.songmid] = midurlitem
              }
            })
            if (JSON.stringify(midurlJson) === '{}' && index < 2) {
              this._CgiGetVkey(ids, types, songer, other, index)
              return false
            }
            console.log(midurlJson, index)
            if (!other) {
              this._normalizeSongUrl(songer, midurlJson)
            }
            resolve(midurlJson)
          } else {
            reject()
          }
        }).catch(() => {
          reject()
        })
      })
    },
    _normalizeSongUrl(songer, midurlJson) {
      var ret = []
      var noPulSongs = []
      songer.forEach((item, i) => {
        let musicData = item.musicData || item.data || item || {}
        if (musicData.songmid && musicData.albummid && midurlJson[musicData.songmid]) {
          musicData.purl = midurlJson[musicData.songmid].purl
          musicData.vkey = midurlJson[musicData.songmid].vkey
          musicData.filename = midurlJson[musicData.songmid].filename
        }
        if (!musicData.purl && musicData.songmid) {
          noPulSongs.push(musicData.songmid)
        }
        ret.push(creatSong(musicData))
      })
      this.songs = [].concat(ret)
      this._getPuppeteerList(noPulSongs, this.songs)
      return this.songs
    },
    _getPuppeteerList(noPulSongs, songs) {
      if (noPulSongs && noPulSongs.length) {
        this.__getPuppeteerList(noPulSongs, songs).then((ret) => {
          this.songs = [].concat(ret)
        })
      }
    },
    __getPuppeteerList(noPulSongs, songs) {
      return new Promise((resolve, reject) => {
        getPuppeteerList(noPulSongs).then((res) => {
          console.log(res, noPulSongs.length)
          if (res.code === ERR_OK) {
            var songlists = res.data.pagedata.songlist || []
            var midurlJson = {}
            songlists.forEach((item) => {
              midurlJson[item.songmid] = item
            })
            var ret = []
            songs.forEach((item, i) => {
              if (item.mid && !item.url && midurlJson[item.mid]) {
                if (midurlJson[item.mid].m4aUrl) {
                  item.url = midurlJson[item.mid].m4aUrl
                } else {
                  // item.puppeteer = '1'
                }
              }
              ret.push(item)
            })
            resolve(ret)
          }
        }).catch((err) => {
          reject(err)
        })
      })
    }
  }
}

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
