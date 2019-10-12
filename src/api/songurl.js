/**
 * Created by linfei6 on 2018/4/19.
 */
import axios from 'axios'
import { baseUrl } from './config'

// var qs = require('qs')

// axios.defaults.headers = {
//   'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
// }

// axios.interceptors.request.use((config) => {
//   if (config.method === 'post') {
//     config.data = qs.stringify(config.data)
//   }
//   return config
// }, (error) => {
//   return Promise.reject(error)
// })

export function CgiGetVkey(songmids, songtypes) {
  const url = baseUrl + '/api/CgiGetVkey'
  if (!songmids.length || !songtypes.length) {
    return new Promise((resolve, reject) => {
      resolve({ code: -1 })
    })
  }
  const data = Object.assign({
    comm: {
      g_tk: 5381,
      uin: 0,
      format: 'json',
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1
    },
    url_mid: {
      module: 'vkey.GetVkeyServer',
      method: 'CgiGetVkey',
      param: {
        guid: '5850926120',
        songmid: songmids,
        songtype: songtypes,
        uin: '0',
        loginflag: 0,
        platform: '23'
      }
    }
  })
  return axios({
    method: 'post',
    url: url,
    data: { data: data }
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getPuppeteerList(songs) {
  const url = baseUrl + '/api/puppeteer'
  const data = Object.assign({}, {
    url: `https://i.y.qq.com/v8/playsong.html?songmid=${songs.join(',')}`,
    type: 0,
    key: 'songlist,adtagMaps,channelIds',
    select: '.js_song_name',
    attr: 'html,src,width,url'
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
