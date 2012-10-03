function App( args ) {
  'use strict';
  var PORT      = 1985,
      https     = require('https'),
      express   = require('express'),
      hostname  = require('os').hostname(),
      colors    = require('colors'),
      app       = express(),
      homeFolder,
      port;

  initEnvironment();
  initRoutes();
  start();

  /**
   * Set up application environment
   */
  function initEnvironment() {
    homeFolder = __dirname;
    console.log('   info  -'.cyan, 'Application root'.yellow, homeFolder);

    // express config
    app.set('view engine', 'ejs');
    app.set('views', homeFolder + '/views');
    app.set('views');
    app.set('view options', { layout: null });
    app.use(express.bodyParser());

    // static resources
    app.use('/js', express.static(homeFolder + '/js'));
    app.use('/css', express.static(homeFolder + '/css'));
    app.use('/img', express.static(homeFolder + '/img'));

    // port
    port = parseInt(process.argv[2], 10) || PORT;

  }

  /**
   * Set up routes
   */
  function initRoutes() {

    /** Index - Render a template **/
    app.get('/', function(request, response) {
      response.render('index', { hostname: hostname, port: port });
    });

    /** Persona login route **/
    app.post('/auth/login', function(request, response) {
      var options,
          personaRequest,
          assertion = request.param('assertion'),
          data = 'assertion='+encodeURIComponent(assertion)+'&audience=localhost:1985';

      options = {
        host: 'verifier.login.persona.org',
        path: '/verify',
        method: 'POST',
        headers: {
          'Content-Length': data.length,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      personaRequest = https.request(options, function (personaResponse) {
        var str = '';
        personaResponse.on('data', function (chunk) {
          str += chunk;
        });

        personaResponse.on('end', function () {
          if(JSON.parse(str).status === 'okay') {
            response.send(str);
          } else {
            response.status(403);
          }
        });
      });

      personaRequest.write(data);
      personaRequest.end();
    });

    /** Persona logout route **/
    app.post('/auth/logout', function(request, response) {
      // handle logout
      response.send('');
    });

  }

  /**
   * Start server
   */
  function start() {
    app.listen(port);
    console.log('Application started on'.yellow, (hostname + ':' + port).cyan);
  }
}

module.exports = App;
