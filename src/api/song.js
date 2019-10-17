import axios from 'axios'
import {commonParams, baseUrl} from './config'
axios.defaults.withCredentials = true

export function getLyric(songmid) {
  const url = baseUrl + '/api/getLyric'

  const data = Object.assign(commonParams, {
    pcachetime: new Date().getTime(),
    songmid: songmid,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
