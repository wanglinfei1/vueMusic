/**
 * Created by wanglinfei on 2017/9/8.
 */
import axios from 'axios'
import {commonParams, baseUrl} from './config'

export function getRankList() {
  const url = baseUrl + '/api/getRankList'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
