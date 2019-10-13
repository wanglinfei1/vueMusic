/**
 * Created by wanglinfei on 2017/8/10.
 */
import { getLyric } from 'api/song'
import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64'
import { getPuppeteerList, getkugosearch, getkuogosearchpc } from 'api/songurl'
var defaultM4aUrl = ''

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
  // 缺少qq云音乐 应急请求酷狗音乐h5搜索接口
  getkugodata() {
    return new Promise((resolve, reject) => {
      getkugosearch(this.name + ' ' + this.singer).then((res) => {
        var abslist1 = res && res[0] && res[0].abslist && res[0].abslist[0] ? res[0].abslist[0] : {}
        var abslist2 = res && res[1] && res[1].abslist && res[1].abslist[0] ? res[1].abslist[0] : {}

        var tagType
        var kugourl
        var id
        var abslist = {}
        if (abslist1.TAG) {
          abslist = abslist1
          tagType = 'mp3'
          id = (abslist1.MUSICRID || '').replace('MUSIC_', '')
          kugourl = `http://antiserver.kuwo.cn/anti.s?rid=MUSIC_${id}&response=res&format=mp3&type=convert_url`
        } else if (abslist2.TAG) {
          abslist = abslist2
          tagType = 'mp4'
          id = (abslist2.MUSICRID || '').replace('MUSIC_', '')
          kugourl = `http://antiserver.kuwo.cn/anti.s?rid=MUSIC_${id}&response=res&format=mp4&type=convert_url`
        }
        var _url2 = kugourl || abslist.TAG || ''
        if (_url2) {
          this.url2 = _url2
          resolve({
            url: this.url2,
            from: tagType
          })
        } else {
          if (defaultM4aUrl) {
            this.puppeteer = '1'
            this.url2 = defaultM4aUrl
            resolve({
              url: this.url2
            })
            return
          } else {
            reject('no m4aUrl')
            return
          }
        }
        return
      }).catch(() => {
        reject('no m4aUrl')
        return
      })
    })
  }
  // 缺少qq云音乐 应急请求酷狗音乐pc搜索接口
  getkuogourlpc() {
    return new Promise((resolve, reject) => {
      getkuogosearchpc(this.name + ' ' + this.singer).then((res) => {
        if (res.code === 200) {
          var datalist = res.data && res.data.list && res.data.list[0] ? res.data.list[0] : {}
          if (datalist.musicrid) {
            var tagType
            var kugourl
            var id
            if (datalist.hasmv === 1) {
              tagType = 'mp4'
              id = (datalist.musicrid || '').replace('MUSIC_', '')
              kugourl = `http://antiserver.kuwo.cn/anti.s?rid=MUSIC_${id}&response=res&format=mp4&type=convert_url`
            } else if (datalist.hasmv === 0) {
              tagType = 'mp3'
              id = (datalist.musicrid || '').replace('MUSIC_', '')
              kugourl = `http://antiserver.kuwo.cn/anti.s?rid=MUSIC_${id}&response=res&format=mp3&type=convert_url`
            }
            this.url2 = kugourl
            this.duration = datalist.duration || this.duration
            resolve({
              url: this.url2,
              from: tagType
            })
            return
          }
          return
        }
        if (defaultM4aUrl) {
          this.puppeteer = '1'
          this.url2 = defaultM4aUrl
          resolve({
            url: this.url2
          })
          return
        } else {
          reject('no m4aUrl')
          return
        }
      }).catch(() => {
        reject('no m4aUrl')
        return
      })
    })
  }
  // qq音乐接口请求vkey失败 node无头浏览器抓取页面数据 失败再应急请求酷狗资源搜索接口
  getPurl() {
    if (this.url || this.url2) {
      return Promise.resolve({
        url: this.url || this.url2
      })
    }
    return new Promise((resolve, reject) => {
      if (window.REACTDATA && window.REACTDATA.fristreqkugo) {
        this.getkuogourlpc().then((res) => {
          resolve(res)
          return
        }).catch(() => {
          reject('no m4aUrl')
          return
        })
        return
      }
      getPuppeteerList([this.mid]).then((res) => {
        if (res.code === ERR_OK) {
          var songlists = res.data.pagedata.songlist || []
          if (songlists && songlists[0] && songlists[0].m4aUrl) {
            this.url2 = songlists[0].m4aUrl || ''
            resolve({
              url: this.url2
            })
            return
          }
        } else {
          this.getkugodata().then((res) => {
            resolve(res)
            return
          }).catch(() => {
            reject('no m4aUrl')
            return
          })
        }
      }).catch((err) => {
        console.log(err)
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
