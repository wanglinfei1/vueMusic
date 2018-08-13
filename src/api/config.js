export const commonParams = {
  g_tk: 5381,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
}

export const options = {
  param: 'jsonpCallback'
}

// 基于jsonp方库，设置自定义的cbname
// 解决cbname未定义的问题
export const options1 = {
  param: 'jsonpCallback',
  prefix: 'playlistinfoCallback'
}
export const ERR_OK = 0
export const ERR_ERR = 500
export const hotKeyNum = 16
window.REACTDATA = window.REACTDATA || {}
export const baseUrl = window.REACTDATA.baseUrl || ''
