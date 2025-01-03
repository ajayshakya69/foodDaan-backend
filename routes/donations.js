const express = require('express');
const Donation = require('../models/Donation');
const router = express.Router();


router.post('/', async (req, res) => {
    const { foodName, quantity, preparedDate, location } = req.body
    const donate = new Donation({ foodName, quantity, preparedDate, location })

    await donate.save()

    res.status(201).json({ success: "request sent successfull" });
});


module.exports = router;
