/**
 * Created by wanglinfei on 2017/8/10.
 */
import { getLyric } from 'api/song'
import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64'

export default class Song {
  constructor({ id, mid, name, singer, album, duration, image, url, vkey, filename }) {
    this.id = id
    this.mid = mid
    this.name = name
    this.singer = singer
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
    this.vkey = vkey
    this.filename = filename
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.code === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }
}
export function creatSong(songs) {
  return new Song({
    id: songs.songid,
    mid: songs.songmid,
    name: songs.songname,
    singer: filtername(songs.singer),
    album: songs.albumname,
    duration: songs.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${songs.albummid}.jpg?max_age=2592000`,
    vkey: songs.vkey,
    filename: songs.filename,
    url: songs.purl ? songs.purl : ('') // `http://dl.stream.qqmusic.qq.com/${songs.purl || ''}`
  })
}
function filtername(name) {
  var ret = []
  if (!name) {
    return ''
  }
  name.forEach((item) => {
    ret.push(item.name)
  })
  return ret.join('|')
}
