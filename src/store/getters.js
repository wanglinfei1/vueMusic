/**
 * Created by wanglinfei on 2017/8/10.
 */
export const singer = state => state.singer

export const play = state => state.play

export const fullScreen = state => state.fullScreen

export const playList = state => state.playList

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {
  return state.playList[state.currentIndex]
}

export const disc = state => state.disc

export const topList = state => state.topList

export const searchesHistory = state => state.searchesHistory

export const playHistory = state => state.playHistory

export const favoriteList = state => state.favoriteList
