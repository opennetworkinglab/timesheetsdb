module.exports = app => {
    const tsweekly = require("../controllers/tsweekly.controller");

    var router = require("express").Router();

    // Retrieve all Tsweekly(s)
    router.get("/", tsweekly.findAll);

    app.use('/api/tsweekly', router);
};