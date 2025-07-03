const express = require('express');
const router = express.Router();
const {getAllSem} = require('../controllers/sem.controller');

router.get('/getAllSem', getAllSem);


module.exports = router;