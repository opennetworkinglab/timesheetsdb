const db = require("../models");

const Tsweek = db.tsweek;

const Op = db.Sequelize.Op;

// Retrieve all Tsweek from the database.
exports.findAll = (req, res) => {
    const weekno = req.query.weekno;
    var condition  = weekno ? {weekno: {[Op.like]: `%${weekno}%`}} : null;

    Tsweek.findAll({where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error while retrieving Tsweek(s)"
            });
        });
};

// Find a single Tsweek from the database.
exports.findOne = (req, res) => {
    const weekno = req.query.weekno;

    Tsweek.findByPk(weekno)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error while retrieving Tsweek" + weekno
            });
        });

};