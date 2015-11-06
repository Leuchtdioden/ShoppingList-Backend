var Hapi = require('hapi');
var Good = require('good');

var server = new Hapi.Server();

server.connection({ port: 3000 });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

server.register({
    register: Good,
    options: {
        reporters: [{
            reporter: require('good-console'),
            events: {
                response: '*',
                log: '*'
            }
        }]
    }
}, function (err) {
    if (err) {
       throw err;
    }

    server.start(() => {
        server.log('info', 'Server running at: ' + server.info.uri)
    });
});

