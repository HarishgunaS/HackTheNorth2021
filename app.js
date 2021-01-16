let express = require("express");
app = express();
let Sequelize = require('sequelize-cockroachdb');
let fs = require('fs');

app.use("/css/",express.static("css"));
app.use("/front-end/assets",express.static("front-end/assets"));
app.use("/front-end", express.static("front-end"));
app.use("/ssl", express.static("ssl"));

app.set("view engine", "ejs");

app.get("/", function (req,res) {
    console.log(__dirname +"/index.html");
    res.sendFile(__dirname +"/front-end/landing.html");

});

//Passing the URI string

let URI = "postgres://abdulrahman:d1dkUYmnI1dqkSmY@free-tier.gcp-us-central1.cockroachlabs.cloud:26257/pastel-vole-236.defaultdb?sslmode=verify-full&sslrootcert=cc-ca.crt/cc-ca.crt"
let cert_dir = __dirname + "/ssl/cc-ca.crt";
console.log(cert_dir);

// const sequelize = new Sequelize('postgres://abdulrahman:d1dkUYmnI1dqkSmY@free-tier.gcp-us-central1.cockroachlabs.cloud:26257/pastel-vole-236.defaultdb?sslmode=verify-full&sslrootcert=' + cert_dir);
//
// const User = sequelize.define('User', {
//     // Model attributes are defined here
//     firstName: {
//         type: String,
//         allowNull: false
//     },
//     lastName: {
//         type: String
//         // allowNull defaults to true
//     }
// }, {
//     // Other model options go here
// });
// sequelize.query('show tables').then(function(rows) {
//     console.log(JSON.stringify(rows));
// });
//
// // `sequelize.define` also returns the model
// console.log(User === sequelize.models.User); // true
// try {
//     sequelize.authenticate();
//     console.log('Connection has been established successfully.');
// } catch (error) {
//     console.error('Unable to connect to the database:', error);
// }
app.get("/start", function (req,res){
    res.render("start");
})

//trying it oout the oop way
// Connect to CockroachDB through Sequelize.
let sequelize = new Sequelize('defaultdb/', 'abdulrahman', 'Iloveabdul123', {
    host: 'free-tier.gcp-us-central1.cockroachlabs.cloud',
    dialect: 'postgres',
    port: 26257,
    logging: false,
    dialectOptions: {
        ssl: {
            ca: fs.readFileSync('ssl/cc-ca.crt')
                .toString()
        }
    }
});




// let dialectOptions = {
//     ssl: {
//         ca: fs.readFileSync("ssl/cc-ca.crt")
//             .toString()
//     }
// }


try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}





app.listen(process.env.PORT, function (){
    console.log("Server started");
})