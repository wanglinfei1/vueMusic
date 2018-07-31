/**
 * Created by linfei6 on 2018/4/19.
 */
import axios from 'axios'
import {baseUrl} from './config'

export function CgiGetVkey(songmids, songtypes) {
  const url = baseUrl + '/api/CgiGetVkey'
  if (!songmids.length || !songtypes.length) {
    return new Promise((resolve, reject) => {
      resolve({code: -1})
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
    data: {data: data}
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
