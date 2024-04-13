"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});
exports.default = router;
