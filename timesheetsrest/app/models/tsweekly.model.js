module.exports = (sequelize, Sequelize, Tsuser, Tsweek) => {
    const Tsweekly = sequelize.define("tsweekly", {
        email: {
            type: Sequelize.STRING(50),
            references: {
                model: Tsuser,
                key: 'email'
            },
            primaryKey: true,
        },
        weekid: {
            type: Sequelize.DataTypes.INTEGER,
            references: {
                model: Tsweek,
                key: 'id'
            },
            primaryKey: true,
        },
        document: {
            type: Sequelize.DataTypes.BLOB,
        },
        signed: {
            type: Sequelize.DataTypes.DATE,
        }
    });

    return Tsweekly;
};