
var connect = require('connect')
var harp = require('harp')

function multiharp(fn) {
  return function(req, res, next) {
    fn(req, res, function(err) {
      if (err) return next(err)
      delete req.setup
      delete req.poly
      next()
    })
  }
}

exports.create = function createApplication() {
  var app = connect()
  app.use(multiharp(harp.mount(__dirname + '/../public')))
  app.use(multiharp(harp.mount(__dirname + '/../instruments')))
  return app
}
