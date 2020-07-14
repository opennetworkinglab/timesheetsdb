const db = require("../models");

const Tsweekly = db.tsweekly;

const Op = db.Sequelize.Op;

// Retrieve all Tsweekly from the database.
exports.findAll = (req, res) => {
    const email = req.query.email;
    const weekid = req.query.weekid;
    var condition = email || weekid ? {} : null;
    email ? condition.email = {[Op.like]: `%${email}%`} : '';
    weekid ? condition.weekid = {[Op.eq]: weekid} : '';

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