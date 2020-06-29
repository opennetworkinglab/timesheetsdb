const db = require("../models");

const Tsweekly = db.tsweekly;

const Op = db.Sequelize.Op;

// Retrieve all Tsweekly from the database.
exports.findAll = (req, res) => {
    const weekid = req.query.weekid;
    var condition  = weekid ? {weekid: {[Op.like]: `%${weekid}%`}} : null;

    Tsweekly.findAll({where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error while retrieving Tsweekly(s)"
            });
        });
};

// Find a single Tsweekly from the database.
exports.findOne = (req, res) => {
    const weekid = req.query.weekid;

    Tsweekly.findByPk(weekid)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error while retrieving Tsweekly" + weekid
            });
        });

};