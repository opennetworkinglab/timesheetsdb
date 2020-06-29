module.exports = app => {
    const tsday = require("../controllers/tsday.controller");

    var router = require("express").Router();

    // Retrieve all Tsday(s)
    router.get("/", tsday.findAll);

    // Retrieve a single Tsday by email (pk)
    router.get("/:email", tsday.findOne);

    app.use('/api/tsday', router);
};