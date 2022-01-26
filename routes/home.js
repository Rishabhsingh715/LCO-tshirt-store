const express = require('express');
const router = express.Router();

const {home, homeDummy} = require('../controllers/homeController');
router.route('/').get(home);
router.route('/dummy').get(homeDummy);
// router.use('/user', require('./user'));

module.exports = router;