/**
 * Created by wanglinfei on 2017/8/10.
 */
import * as type from './mutations-type'

const moutations = {
  [type.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [type.SET_PLAY](state, flag) {
    state.play = flag
  },
  [type.SET_FULLSCREEN](state, flag) {
    state.fullScreen = flag
  },
  [type.SET_PLAYLIST](state, list) {
    state.playList = list
  },
  [type.SET_SEQUENCELIST](state, list) {
    state.sequenceList = list
  },
  [type.SET_MODE](state, mode) {
    state.mode = mode
  },
  [type.SET_CURRENTINDEX](state, mode) {
    state.currentIndex = mode
  },
  [type.SET_DISC](state, disc) {
    state.disc = disc
  },
  [type.SET_TOPLIST](state, topList) {
    state.topList = topList
  },
  [type.SET_SEARCHES_HISTORY](state, history) {
    state.searchesHistory = history
  },
  [type.SET_PLAY_HISTORY](state, playHistory) {
    state.playHistory = playHistory
  },
  [type.SET_FAVORITE_LIST](state, list) {
    state.favoriteList = list
  }
}

export default moutations
