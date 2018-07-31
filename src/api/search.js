/**
 * Created by wanglinfei on 2017/9/11.
 */
import {options, commonParams, options1} from './config'
import {jsonp} from './jsonp'

export function getHotKey() {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  var data = Object.assign({}, commonParams, {
    g_tk: 1714213237,
    platform: 'yqq',
    needNewCode: 1,
    hostUin: 0
  })
  return jsonp(url, data, options)
}
export function getSearch(query, page, perpage, zhida, searchType) {
  var qqUrl = 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp'
  var data = {
    ct: 24,
    qqmusic_ver: 1298,
    new_json: 1,
    remoteplace: 'txt.yqq.song',
    t: 0,
    aggr: 1,
    cr: 1,
    catZhida: 1,
    lossless: 0,
    flag_qc: 0,
    p: page,
    n: perpage,
    w: query,
    g_tk: 1714213237,
    hostUin: 0,
    format: 'jsonp',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  }
  function async(url) {
    return new Promise((resolve, reject) => {
      jsonp(url, data, {
        param: 'jsonpCallback',
        prefix: 'MusicJsonCallback6008426686282988'
      }).then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  }
  return Promise.race([async(qqUrl)])
}

export function getSearch1(query, page, perpage, zhida, searchType) {
  var url2 = 'https://shc.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  var url1 = 'https://szc.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  var url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  var data = Object.assign({}, commonParams, {
    g_tk: 1714213237,
    uin: 977696449,
    platform: 'h5',
    timeout: 1000,
    needNewCode: 1,
    w: query,
    zhidaqu: zhida ? 1 : 0,
    catZhida: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: perpage,
    n: perpage,
    p: page,
    remoteplace: 'txt.mqq.all'
  })

  function async(url) {
    return new Promise((resolve, reject) => {
      jsonp(url, data, options1).then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  }

  return Promise.race([async(url), async(url1), async(url2)])
}
