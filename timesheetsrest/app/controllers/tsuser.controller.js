const db = require("../models");

const Tsuser = db.tsuser;

const Op = db.Sequelize.Op;

// Retrieve all Tsuser from the database.
exports.findAll = (req, res) => {
    const email = req.query.email;
    var condition  = email ? {email: {[Op.like]: `%${email}%`}} : null;

    Tsuser.findAll({where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error while retrieving Tsuser(s)"
            });
        });
};

// Find a single Tsuser from the database.
exports.findOne = (req, res) => {
    const email = req.query.email;

    Tsuser.findByPk(email)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error while retrieving Tsuser" + email
            });
        });

};