module.exports = app => {
    const tsweekly = require("../controllers/tsweekly.controller");

    var router = require("express").Router();

    // Retrieve all Tsweekly(s)
    router.get("/", tsweekly.findAll);

    // Retrieve a single Tsweekly by email (pk)
    router.get("/:email", tsweekly.findOne);

    app.use('/api/tsweekly', router);
};