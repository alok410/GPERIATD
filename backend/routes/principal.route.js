const express = require('express');
const router = express.Router();
const {
  getPrincipal,
  createPrincipal,
  updatePrincipal,
  deletePrincipal
} = require('../controllers/principal.controller');

router.get('/getPrincipal', getPrincipal);
router.post('/create', createPrincipal);
router.post('/update/:id', updatePrincipal);
router.post('/delete/:id', deletePrincipal);

module.exports = router;