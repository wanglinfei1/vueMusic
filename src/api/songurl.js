/**
 * Created by linfei6 on 2018/4/19.
 */
import axios from 'axios'
import { baseUrl } from './config'
import { jsonp } from './jsonp'
axios.defaults.withCredentials = true

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
    // params: { data: data }
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getPuppeteerList(songs) {
  var url = `${baseUrl}/api/puppeteer`

  const data = Object.assign({}, {
    url: `https://i.y.qq.com/v8/playsong.html?songmid=${songs.join(',')}`,
    type: 0,
    key: 'songlist,adtagMaps',
    select: '.js_song_name',
    attr: 'html',
    fn: `function(window,reqQuery){return'函数回调结果测试'}`
  })
  return axios({
    method: 'get',
    url: url,
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getkugosearch(key) {
  var url1 = `//search.kuwo.cn/r.s?all=${key}&ft=music&client=kt&cluster=0&pn=0&rn=50&rformat=json&encoding=utf8`
  var url2 = `//search.kuwo.cn/r.s?all=${key}&ft=music&newsearch=1&itemset=web_2012&client=kt&cluster=0&pn=0&rn=30&rformat=json&hasmkv=1&encoding=utf8`

  function async(url) {
    return new Promise((resolve, reject) => {
      jsonp(url, {}, {
        param: 'callback',
        prefix: 'searchMusicResult'
      }).then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  }
  return Promise.all([async(url1), async(url2)])
}

export function getkuogosearchpc(key) {
  var url = `${baseUrl}/api/getOtherHost`
  return axios({
    method: 'get',
    url: url,
    params: {
      url: 'http://kuwo.cn/api/www/search/searchMusicBykeyWord',
      params: {
        key: key,
        pn: 1,
        rn: 2
      },
      headers: {
        'origin': 'http://kuwo.cn',
        'referer': 'http://kuwo.cn'
      }
    }
  }).then(res => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })
}
