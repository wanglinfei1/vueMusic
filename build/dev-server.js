require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
  process.traceDeprecation = true
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')
var axios = require('axios');

var bodyParser = require('body-parser');

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
app.use(bodyParser.urlencoded({extended: false,"limit":"30000kb"}));
app.use(bodyParser.json({ "limit":"30000kb"}));
var apiRouter = express.Router()
apiRouter.get('/getList', function (req, res) {
  var url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  axios.get(url, {
    headers: {
      "origin": "https://m.y.qq.com",
      "referer": "https://m.y.qq.com/"
    },
    params: req.query
  }).then(response => {
    res.json(response.data)
  }).catch(error => {
    console.log(error)
  })
});
apiRouter.get('/getPlaylist', function (req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      "origin": "http://y.qq.com",
      "referer": "https://y.qq.com/portal/playlist.html"
    },
    params: req.query
  }).then(response => {
    res.json(response.data)
  }).catch(error => {
    console.log(error)
  })
});
apiRouter.get('/getDiscList', function (req, res) {
  var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  var query=req.query
  var refererUrl = "https://y.qq.com/n/yqq/playlist/"+query.disstid+".html"
  axios.get(url, {
    headers: {
      "origin": "http://y.qq.com",
      "referer": refererUrl
    },
    params: query
  }).then(response => {
    res.json(response.data)
  }).catch(error => {
    console.log(error)
  })
});
apiRouter.get('/getRankList', function (req, res) {
  var url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  axios.get(url, {
    headers: {
      "origin": "https://y.qq.com",
      "referer": "https://m.y.qq.com/"
    },
    params: req.query
  }).then(response => {
    res.json(response.data)
  }).catch(error => {
    console.log(error)
  })
});
apiRouter.get('/getLyric', function (req, res) {
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url, {
    headers: {
      "origin": "https://m.y.qq.com",
      "referer": "https://m.y.qq.com/"
    },
    params: req.query
  }).then(response => {
    var ret = response.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
        res.json(ret)
      }
    } else {
      res.json(response.data)
    }
  }).catch(error => {
    console.log(error)
  })
});
apiRouter.post('/CgiGetVkey', function (req, res) {
  var url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  axios({
    method:"post",
    url:url,
    headers: {
      "authority":" u.y.qq.com",
      "origin": "http://y.qq.com",
      "referer": "http://y.qq.com"
    },
    data:req.body.data
  }).then(response => {
    res.json(response.data)
  }).catch(error => {
    console.log(error)
  })
});
apiRouter.get('/CgiGetVkey', function (req, res) {
  var url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  console.log(req.body.data)
  axios({
    method:"post",
    url:url,
    headers: {
      "authority":" u.y.qq.com",
      "origin": "http://y.qq.com",
      "referer": "http://y.qq.com"
    },
    data:req.query.data
  }).then(response => {
    res.json(response.data)
  }).catch(error => {
    console.log(error)
  })
});
apiRouter.get('/getCommonApi', function (req, res) {
  var url = req.query.url;
  var header = req.query.header;
  var urlData = req.query.urlData;
  if(urlData){
    url += ('?'+urlData.replace(/\$/g,'&'))
  }
  axios.get(url, {
    headers: {
      "origin": header&&header.origin?header.origin:"https://m.qq.com",
      "referer": header&&header.referer?header.referer:"https://m.qq.com/"
    },
    params: req.query.data
  }).then(response => {
    var ret = response.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch(error => {
    console.log('error=============================================================='+error)
  })
});
app.use('/api', apiRouter);


var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({action: 'reload'})
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = {target: options}
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static common
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
