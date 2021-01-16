let express = require("express");
app = express();
let Sequelize = require('sequelize-cockroachdb');
let async = require('async');
let fs = require('fs');
let pg = require('pg');
let bodyParser =    require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use("/css/",express.static("css"));
app.use("/front-end/assets",express.static("front-end/assets"));
app.use("/front-end", express.static("front-end"));
app.use("/ssl", express.static("ssl"));

app.set("view engine", "ejs");




//creating data directory for input.txt and questions.json
// let dir = 'data/';
//
// if (!fs.existsSync(dir)){
//     fs.mkdirSync(dir);
// }

// Connect to the bank database.

let config = {
    user: 'arjuns',
    password: 'arjunhackthenorth',
    host: 'free-tier.gcp-us-central1.cockroachlabs.cloud',
    database: 'pastel-vole-236.bank',
    port: 26257,
    ssl: {
        ca: fs.readFileSync('ssl/certs/cc-ca.crt')
            .toString(),
        key: fs.readFileSync('ssl/certs/client.arjuns.key')
            .toString(),
        cert: fs.readFileSync('ssl/certs/client.arjuns.crt')
            .toString()
    }
};





app.get("/", function (req,res) {
    console.log(__dirname +"/index.html");
    res.sendFile(__dirname +"/front-end/landing.html");

});

app.get("/start", function (req,res){
    res.render("start");
})


// Connecting to CockroachDB using pg

let pool = new pg.Pool(config);


//form sends the string here when submit is pressed
app.post("/makeq", function (req,res) {
    //console.log(req.body.notes);
    //writing file (sync, sorry)
    fs.writeFileSync('data/' + "input.txt", req.body.notes, 'ascii', function (err) {
        if (err) return console.log(err);
        console.log("Text written to "+  "input.txt");
    });
    //running python (sync again, sorry)
    console.log("Python running now");
    const exec = require("child_process").execSync;
    exec("python3 question_generation/generate_json.py input.txt");

    let jsonFile = fs.readFileSync('data/questions.json');
    let jsonObject = JSON.parse(jsonFile);
    console.log(jsonObject);

    // pool.connect(function (err, client, done) {
    //
    //     // Close communication with the database and exit.
    //     let finish = function () {
    //         done();
    //         process.exit();
    //     };
    //
    //     if (err) {
    //         console.error('could not connect to cockroachdb', err);
    //         finish();
    //     }
    //
    //     client.query("INSERT INTO qna VALUES ('What does the fox say\?', 'eueue');", next);
    //     finish();
    //
    // });

    
    
})


//ACTION ON SDK PART ///////////////////////////////

const {
    dialogflow,
    actionssdk,
    Image,
    Table,
    Carousel,
} = require('actions-on-google');


const {
    conversation
} = require('@assistant/conversation');
const { CANCELLED } = require("dns");

// Create an app instance
const appGoogle = conversation();

// Register handlers for Actions SDK

appGoogle.handle('handler', conv => {
    conv.add('Hi, how is it going?')
    conv.add(new Image({
        url: 'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
        alt: 'A cat',
    }))
})

app.post('/fulfillment', appGoogle);


/////////////////////////////////


const HEROKU_PORT = process.env.PORT;

app.listen(HEROKU_PORT||3000, function (req,res) {
    console.log("Server started.")

});