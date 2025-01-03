
const express = require("express")

const { asynchandler } = require('../middleware/errorHandler');
const AuthController = require('../controllers/authControllers')

const router = express.Router();

// Register route
router.post('/register', asynchandler(AuthController.register))


// Login route

router.post('/login', asynchandler(AuthController.login));

router.get('/refreshtoken', asynchandler(AuthController.refreshToken));

router.get('/me', asynchandler(AuthController.verifyUser));

module.exports = router
