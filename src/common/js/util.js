/**
 * Created by wanglinfei on 2017/9/7.
 */
function getRandom(n, m) {
  return Math.floor(Math.random() * (m - n + 1) + n)
}
export function shuffle(arr) {
  let _arr = arr.slice()
  for (var i = 0; i < _arr.length; i++) {
    let j = getRandom(0, i)
    let Newarr = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = Newarr
  }
  return _arr
}
// 函数节流
export function debounce(func, delay) {
  let timer
  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
