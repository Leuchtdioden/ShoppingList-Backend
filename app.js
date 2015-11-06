var Hapi = require('hapi');
var Good = require('good');
var models = require('./models');

var server = new Hapi.Server();

server.connection({ port: 3000 });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        models.List.findAll().then((lists) => {
            reply(lists).code(200)
        });
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

    /*server.start(() => {
        server.log('info', 'Server running at: ' + server.info.uri)
    });*/

    models.sequelize.sync().then(() => {
        models.List.create({
            title: '123'
        }).then(() => {
            server.start(() => {
                server.log('info', 'Server running at: ' + server.info.uri)
            });
        })

    })
});

