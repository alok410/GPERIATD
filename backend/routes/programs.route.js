const express = require('express');
const router = express.Router();
const {getAllPrograms} = require('../controllers/program.controller');

router.get('/getAllPrograms', getAllPrograms);


module.exports = router;