
module.exports = (sequelize, Sequelize, Tsuser, Tsweek) => {
    const Tsday = sequelize.define("tsday", {
        email: {
            type: Sequelize.STRING(50),
            references: {
                model: Tsuser,
                key: 'email'
            },
            primaryKey: true,
        },
        day: {
            type: Sequelize.DataTypes.DATEONLY,
            primaryKey: true,
        },
        weekid: {
            type: Sequelize.DataTypes.INTEGER,
            references: {
                model: Tsweek,
                key: 'id'
            },
            allowNull: false,
        },
        worked_mins: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
        },
        ngpa_min: {
            type: Sequelize.DataTypes.INTEGER,
        },
        admin_min: {
            type: Sequelize.DataTypes.INTEGER,
        },
        fundr_min: {
            type: Sequelize.DataTypes.INTEGER,
        },
        salesm_min: {
            type: Sequelize.DataTypes.INTEGER,
        },
        other_min: {
            type: Sequelize.DataTypes.INTEGER,
        },
        leavesick_min: {
            type: Sequelize.DataTypes.INTEGER,
        },
        leavepto_min: {
            type: Sequelize.DataTypes.INTEGER,
        },
        holiday_min: {
            type: Sequelize.DataTypes.INTEGER,
        },
        timein1: {
            type: Sequelize.DataTypes.DATE,
        },
        timeout1: {
            type: Sequelize.DataTypes.DATE,
        },
        timein2: {
            type: Sequelize.DataTypes.DATE,
        },
        timeout2: {
            type: Sequelize.DataTypes.DATE,
        },
        reg_min: {
            type: Sequelize.DataTypes.INTEGER,
        },
        ot_min: {
            type: Sequelize.DataTypes.INTEGER,
        },
    });

    return Tsday;
};