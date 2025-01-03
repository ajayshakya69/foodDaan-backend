const express = require("express");
const authRouter = require("./auth")
const foodRoute = require("./food")
const userRoute = require("./user")
const requestRoute = require("./requests")

const router = express.Router();

router.use("/api/auth",authRouter)

router.use("/api/food",foodRoute)

router.use("/api",userRoute)

router.use("/api",requestRoute)

module.exports = router;