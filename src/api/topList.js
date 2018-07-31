/**
 * Created by wanglinfei on 2017/9/11.
 */
import {options, commonParams} from './config'
import {jsonp} from './jsonp'

export function getTopList(topID) {
  var url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  var data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid: topID
  })
  return jsonp(url, data, options)
}
