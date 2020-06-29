module.exports = app => {
    const tsweek = require("../controllers/tsweek.controller");

    var router = require("express").Router();

    // Retrieve all Tsweek(s)
    router.get("/", tsweek.findAll);

    // Retrieve a single Tsweek by weekno
    router.get("/:weekno", tsweek.findOne);

    app.use('/api/tsweek', router);
};