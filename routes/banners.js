'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');

exports.register = function(server, options, next) {
    const db = server.app.db;

    server.route({
        method: 'GET',
        path: '/banners',
        handler: function(request, reply) {
            db.banners.find((err, docs) => {
                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                reply(docs);
            });

        }
    });

    server.route({
        method: 'GET',
        path: '/banners/{id}',
        handler: function(request, reply) {
            db.banners.findOne({
                _id: request.params.id
            }, (err, doc) => {
                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                if (!doc) {
                    return reply(Boom.notFound());
                }

                reply(doc);
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/banners',
        handler: function(request, reply) {

            const banner = request.payload;

            //Create an id
            banner._id = uuid.v1();

            db.banners.save(banner, (err, result) => {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                reply(banner);
            });
        },
        config: {
            validate: {
                payload: {
                    title: Joi.string().min(10).max(50).required()
                }
            }
        }
    });

    server.route({
        method: 'PATCH',
        path: '/banners/{id}',
        handler: function(request, reply) {

            db.banners.update({
                _id: request.params.id
            }, {
                $set: request.payload
            }, function(err, result) {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                if (result.n === 0) {
                    return reply(Boom.notFound());
                }

                reply().code(204);
            });
        },
        config: {
            validate: {
                payload: Joi.object({
                    title: Joi.string().min(10).max(50).optional()
                }).required().min(1)
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/banners/{id}',
        handler: function(request, reply) {

            db.banners.remove({
                _id: request.params.id
            }, function(err, result) {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                if (result.n === 0) {
                    return reply(Boom.notFound());
                }

                reply().code(204);
            });
        }
    });

    return next();
}

exports.register.attributes = {
    name: 'routes-banners'
};