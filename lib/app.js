
var connect = require('connect')
  , Mincer = require('mincer')

exports.create = function createApplication() {

  var app = connect()

  var environment = new Mincer.Environment()
  environment.appendPath(__dirname + '/../client_lib')
  app.use('/lib/', Mincer.createServer(environment))

  app.use(connect.static(__dirname + '/../public'))
  app.use(connect.static(__dirname + '/../instruments'))
  app.use('/vendor/', connect.static(__dirname + '/../vendor'))

  return app

}
