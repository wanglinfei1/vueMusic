/**
 * Created by wanglinfei on 2017/8/7.
 */

export function hasClass(el, className) {
  var reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function getData(el, name, val) {
  name = 'data-' + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}

var ElementStyle = document.createElement('div').style

var vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  for (var key in transformNames) {
    if (ElementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()

export function prefixStyle(style) {
  if (!vendor) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
