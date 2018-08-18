const router = require('express').Router();

const defaultss = require('../controllers/default-controller.js');

// route
router.get('/',defaultss.dosomething)

module.exports = router
