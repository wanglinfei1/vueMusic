/**
 * Created by wanglinfei on 2017/8/10.
 */
import * as type from './mutations-type'
import {shuffle} from 'common/js/util'
import {palyMode} from 'common/js/config'
import {saveSearch, deleteOneSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from 'common/js/cache'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(type.SET_PLAY, true)
  commit(type.SET_FULLSCREEN, true)
  if (state.mode === palyMode.random) {
    let randomList = shuffle(list)
    index = findIndex(randomList, list[index])
    commit(type.SET_PLAYLIST, randomList)
  } else {
    commit(type.SET_PLAYLIST, list)
  }
  commit(type.SET_CURRENTINDEX, index)
  commit(type.SET_SEQUENCELIST, list)
}
export const randomPlay = function ({commit}, {list}) {
  commit(type.SET_MODE, palyMode.random)
  commit(type.SET_PLAY, true)
  commit(type.SET_FULLSCREEN, true)
  commit(type.SET_CURRENTINDEX, 0)
  let randomList = shuffle(list)
  commit(type.SET_PLAYLIST, randomList)
  commit(type.SET_SEQUENCELIST, list)
}
export const insertSong = function ({commit, state}, song) {
  var playList = state.playList.slice()
  var sequenceList = state.sequenceList.slice()
  var currentIndex = state.currentIndex
  // 记录当前播放歌曲
  var currentSong = playList[currentIndex]
  // 查看当前列表里是否有这首歌曲
  var fdIndex = findIndex(playList, song)
  // 因为插入所以索引加一
  currentIndex++
  // 插入歌曲
  playList.splice(currentIndex, 0, song)
  // 如果已存走这首歌
  if (fdIndex > -1) {
    if (currentIndex > fdIndex) {
      playList.splice(fdIndex, 1)
      currentIndex--
    } else {
      playList.splice(fdIndex + 1, 1)
    }
  }
  var currentSongIndex = findIndex(sequenceList, currentSong) + 1
  var fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentSongIndex, 0, song)
  if (fsIndex > -1) {
    if (currentSongIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }
  commit(type.SET_CURRENTINDEX, currentIndex)
  commit(type.SET_SEQUENCELIST, sequenceList)
  commit(type.SET_PLAYLIST, playList)
  commit(type.SET_PLAY, true)
  commit(type.SET_FULLSCREEN, true)
}
export const saveSearchesHistory = function ({commit}, query) {
  commit(type.SET_SEARCHES_HISTORY, saveSearch(query))
}
export const deleteSearchesHistory = function ({commit}, query) {
  commit(type.SET_SEARCHES_HISTORY, deleteOneSearch(query))
}
export const clearSearchesHistory = function ({commit}) {
  commit(type.SET_SEARCHES_HISTORY, clearSearch())
}
export const deleteSong = function ({commit, state}, song) {
  var playList = state.playList.slice()
  var sequenceList = state.sequenceList.slice()
  var currentIndex = state.currentIndex
  var fdIndex = playList.findIndex((item) => {
    return item.id === song.id
  })
  playList.splice(fdIndex, 1)
  var sfdIndex = sequenceList.findIndex((item) => {
    return item.id === song.id
  })
  sequenceList.splice(sfdIndex, 1)

  if (currentIndex > fdIndex || fdIndex === playList.length) {
    currentIndex--
  }

  commit(type.SET_CURRENTINDEX, currentIndex)
  commit(type.SET_SEQUENCELIST, sequenceList)
  commit(type.SET_PLAYLIST, playList)

  if (playList.length === 0) {
    commit(type.SET_PLAY, false)
  } else {
    commit(type.SET_PLAY, true)
  }
}

export const deleteSongList = function ({commit}) {
  commit(type.SET_CURRENTINDEX, -1)
  commit(type.SET_SEQUENCELIST, [])
  commit(type.SET_PLAYLIST, [])
  commit(type.SET_PLAY, false)
}

export const savePlayHistory = function ({commit}, song) {
  commit(type.SET_PLAY_HISTORY, savePlay(song))
}

export const saveFavoriteList = function ({commit}, song) {
  commit(type.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function ({commit}, song) {
  commit(type.SET_FAVORITE_LIST, deleteFavorite(song))
}
