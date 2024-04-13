"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const usersController_1 = require("../controllers/usersController");
const router = express.Router();
/* GET users listing. */
// router.post('/signin', signIn);
router.post('/signup', usersController_1.signUp);
// router.delete('/:id', deleteAccount);
exports.default = router;
