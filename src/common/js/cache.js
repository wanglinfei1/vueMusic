/**
 * Created by wanglinfei on 2017/9/12.
 */
import storage from 'good-storage'

const SEARCH_KEY = '_search__'
const SEARCH_MAX_LENGTH = 15
const PLAY_KEY = '_play__'
const PLAY_MAX_LENGTH = 100
const FAVORITE_KEY = '_favorite__'
const FAVORITE_MAX_LENGTH = 100

function insetSearch(arr, val, methods, maxLen) {
  const index = arr.findIndex(methods)

  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

export function saveSearch(query) {
  let search = storage.get(SEARCH_KEY, [])
  insetSearch(search, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, search)
  return search
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

function deleteSearch(arr, methods) {
  const index = arr.findIndex(methods)
  arr.splice(index, 1)
}

export function deleteOneSearch(query) {
  let search = storage.get(SEARCH_KEY, [])
  deleteSearch(search, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, search)
  return search
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

export function savePlay(item) {
  var songs = storage.get(PLAY_KEY, [])
  insetSearch(songs, item, (song) => {
    return song.id === item.id
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

export function saveFavorite(song) {
  var songs = storage.get(FAVORITE_KEY, [])
  insetSearch(songs, song, (item) => {
    return item.id === song.id
  }, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function deleteFavorite(song) {
  var songs = storage.get(FAVORITE_KEY, [])
  deleteSearch(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite () {
  return storage.get(FAVORITE_KEY, [])
}
