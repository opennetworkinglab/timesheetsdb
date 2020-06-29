module.exports = app => {
    const tsuser = require("../controllers/tsuser.controller");

    var router = require("express").Router();

    // Retrieve all Tsuser(s)
    router.get("/", tsuser.findAll);

    // Retrieve a single Tsuser by email (pk)
    router.get("/:email", tsuser.findOne);

    app.use('/api/tsuser', router);
};