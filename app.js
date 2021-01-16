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

const sequelize = new Sequelize('postgres://abdulrahman:d1dkUYmnI1dqkSmY@free-tier.gcp-us-central1.cockroachlabs.cloud:26257/pastel-vole-236.defaultdb?sslmode=verify-full&sslrootcert=' + cert_dir);

app.get("/start", function (req,res){
    res.render("start");
})














app.listen(process.env.PORT, function (){
    console.log("Server started");
})