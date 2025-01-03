
const express = require("express")

const { asynchandler } = require('../middleware/errorHandler');
const UserController = require("../controllers/userController")

const router = express.Router();

router.get("/users/count",asynchandler(UserController.getUserCount))
router.get("/user/:id",asynchandler(UserController.getUserById))

module.exports = router
