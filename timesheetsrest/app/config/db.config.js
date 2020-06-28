module.exports = {
    HOST: "localhost",
    USER: "scondon",
    PASSWORD: "Lmmjct02",
    DB: "timesheets",
    dialect: "mariadb",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};