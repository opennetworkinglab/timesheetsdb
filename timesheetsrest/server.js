const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

const db = require("./app/models");
const weekms = 168 * 60 * 60 * 1000;
db.sequelize.sync({force: true}).then(() => {
    console.log("Drop and re-sync db'");
}).then(() => {
    var startdate = 1588550400000; // Mon 4th may 2020
    var initweek = 18;
    for (var w=1; w <= 34; w++) {
        var d = new Date(startdate + w * weekms);
        db.tsweek.create({
            id: w,
            year: d.getFullYear(),
            weekno: initweek + w,
            monthno: d.getMonth(),
            begin: d.getTime(),
            end: d.getTime() + weekms - 1000
        })
    }

});

// // simple route
// app.get("/", (req, res) => {
//     res.json({message: "Welcome to timesheets application\n"});
// });

require("./app/routes/tsuser.routes")(app);
require("./app/routes/tsweek.routes")(app);
require("./app/routes/tsday.routes")(app);
require("./app/routes/tsweekly.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8085;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});