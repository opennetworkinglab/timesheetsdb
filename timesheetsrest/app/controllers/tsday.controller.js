const db = require("../models");

const Tsday = db.tsday;

const Op = db.Sequelize.Op;

// Retrieve all Tsday from the database.
exports.findAll = (req, res) => {
    const email = req.query.email;
    const day = req.query.day;
    var condition = email || day ? {} : null;
    email ? condition.email = {[Op.like]: `%${email}%`} : '';
    day ? condition.day = {[Op.like]: `%${day}%`} : '';

    Tsday.findAll({where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error while retrieving Tsday(s)"
            });
        });
};

// Find a single Tsday from the database.
exports.findOne = (req, res) => {
    const email = req.query.email;

    Tsday.findByPk(email)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error while retrieving Tsday" + email
            });
        });

};