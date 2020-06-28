module.exports = (sequelize, Sequelize) => {
    const Tsuser = sequelize.define("tsuser", {
        email: {
            type: Sequelize.STRING(50),
            primaryKey: true,
        },
        fullname: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: 'tsuser_fullname_uk'
        },
    });

    return Tsuser;
};