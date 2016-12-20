'use strict';

var express = require('express');
var controller = require('./product.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

var validationMiddleware = require('../../components/validationMiddleware');
var productRequestValidator = require('./validation/product.request.validator');
var commentRequestValidator = require('./validation/comment.request.validator');

router.get('/', controller.index);
router.get('/:id', auth.attachAuthUser(), controller.show);
router.post('/', [auth.hasRole('admin'), validationMiddleware.validateWith(productRequestValidator)], controller.create);
router.put('/:id', [auth.hasRole('admin'), validationMiddleware.validateWith(productRequestValidator)], controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

router.get('/:productId/comments', controller.indexComment);
router.post('/:productId/comments', validationMiddleware.validateWith(commentRequestValidator), controller.createComment);
router.delete('/:productId/comments/:id', auth.hasRole('admin'), controller.destroyComment);

module.exports = router;