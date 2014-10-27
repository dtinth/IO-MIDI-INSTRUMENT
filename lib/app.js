
var connect = require('connect')
var harp = require('harp')

exports.create = function createApplication() {
  var app = connect()
  app.use(harp.mount(__dirname + '/../public'))
  return app
}
