const express = require('express');
const controller = require('./controller');
const response = require('../../network/response');

const routes = express.Router();

// Ruta para insertar ciudad
routes.post('/', function(req, res) {
    controller.insertar_ciudad(req.body)
        .then((data) => response.success(req, res, data, 201))
        .catch((error) => response.error(req, res, error, 400));
});

// Ruta para obtener ciudades
routes.get('/', function(req, res) {
    controller.obtener_ciudad(req.body)
        .then((data) => response.success(req, res, data, 200))
        .catch((error) => response.error(req, res, error, 400));
});

// Ruta para actualizar ciudad
routes.put('/:id', function(req, res) {
    controller.actualizar_ciudad(req.params.id, req.body)
        .then((data) => response.success(req, res, data, 200))
        .catch((error) => response.error(req, res, error, 400));
});

// Ruta para eliminar ciudad
routes.delete('/:id', function(req, res) {
    controller.eliminar_ciudad(req.params.id)
        .then((data) => response.success(req, res, data, 200))
        .catch((error) => response.error(req, res, error, 400));
});

module.exports = routes;
