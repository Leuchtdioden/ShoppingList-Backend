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
            reply(lists).code(200);
        });
    }
});

server.route({
    method: 'GET',
    path: '/list/{id}',
    handler: function (request, reply) {
        var id = encodeURIComponent(request.params.id);

        models.List.findById(id).then((list) => {
            if(list) reply(list).code(200);
            else {
                reply({error:'No result'}).code(400);
            }
        }).catch((err) => {
           server.log('error', err);
        });
    }
});

server.route({
    method: 'POST',
    path: '/list',
    handler: function (request, reply) {
        models.List.create({
           title:  request.payload.title
        }).then((list) => {
           reply(list);
        });
    }
})

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
    models.sequelize.sync().then(() => {
        server.start(() => {
            server.log('info', 'Server running at: ' + server.info.uri)
        });
    })
});

