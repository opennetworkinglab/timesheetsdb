module.exports = (sequelize, DataTypes) => {
    const Tsweek = sequelize.define("tsweek", {
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: 'tsweek_year_week_uk'
        },
        weekno: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: 'tsweek_year_week_uk'
        },
        begin: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            unique: 'tsweek_begin_uk'
        },
        end: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            unique: 'tsweek_end_uk'
        }
    });

    return Tsweek;
};
