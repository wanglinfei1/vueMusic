/**
 * Created by wanglinfei on 2017/8/8.
 */
import {options, commonParams, options1} from './config'
import {jsonp} from './jsonp'

export function getSigerList() {
  var url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  var data = Object.assign({}, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: '00',
    pagenum: '1',
    g_tk: '5381',
    loginUin: 0,
    hostUin: 0,
    format: 'jsonp',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return jsonp(url, data, options)
}

export function getSingerDetails(singerId) {
  var url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  var data = Object.assign({}, {
    'g_tk': 5381,
    'loginUin': 0,
    'hostUin': 0,
    'format': 'jsonp',
    'inCharset': 'utf8',
    'outCharset': 'utf-8',
    singermid: singerId,
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    order: 'listen',
    begin: 0,
    num: 60,
    songstatus: 1
  })
  return jsonp(url, data, options)
}

export function getDiscList(disstid) {
  var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  var data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid: disstid,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return jsonp(url, data, options1)
}
