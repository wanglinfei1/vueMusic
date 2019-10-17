import axios from 'axios'
import {commonParams, baseUrl} from './config'
import {jsonp} from './jsonp'
axios.defaults.withCredentials = true

export function getRecommend() {
  var url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  var params = {
    toplist: {
      module: 'music.web_toplist_svr',
      method: 'get_toplist_index',
      param: {}
    },
    focus: {
      module: 'QQMusic.MusichallServer',
      method: 'GetFocus',
      param: {}
    }
  }
  var data = Object.assign({}, {
    callback: 'recom4014678690649598',
    g_tk: 1714213237,
    hostUin: 0,
    format: 'jsonp',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    data: JSON.stringify(params)
  })
  return jsonp(url, data, {
    param: 'callback',
    prefix: 'recom4014678690649598'
  })
}
export function getRecommend1() {
  const url = baseUrl + '/api/getList'

  const data = Object.assign({}, {
    g_tk: 5381,
    uin: 0,
    notice: 0,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    needNewCode: 1,
    platform: 'h5',
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
export function getPlayList() {
  const url = baseUrl + '/api/getPlaylist'

  const data = Object.assign({}, {
    rnd: Math.random(),
    g_tk: 1117229495,
    jsonpCallback: 'getPlaylist',
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    categoryId: 136,
    sortId: 5,
    sin: 0,
    ein: 29
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
export function getDiscList(disstid) {
  var url = baseUrl + '/api/getDiscList'
  var data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid: disstid,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    platform: 'yqq',
    needNewCode: 0
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
