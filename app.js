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

let pool = new pg.Pool(config);




app.get("/", function (req,res) {
    console.log(__dirname +"/index.html");
    res.sendFile(__dirname +"/front-end/landing.html");

});

app.get("/start", function (req,res){
    res.render("start");
})

var rows;
var numOfRows;
var i = 0;

app.get("/result", function(req,res){

    let query_statement2 = `SELECT * FROM qna ORDER by id ASC`;

    pool.query(query_statement2, (err, result)=> {
        if(err){
            console.log(err);
        }
        rows = result.rows;
        numOfRows = result.rowCount;
        console.log(rows)
        console.log(numOfRows);
    });


    }
)


// Connecting to CockroachDB using pg


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

    Object.keys(jsonObject).forEach(function (key){
        let answer_entry = jsonObject[key].answer;
        let question_entry = jsonObject[key].question;

        let query_statement = `INSERT INTO qna VALUES ('${question_entry}', '${answer_entry}');`;

            pool.query(query_statement);
            console.log(query_statement)
            console.log("FILLED UP!");







    });

    res.redirect("/result");





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
    conversation
} = require('@assistant/conversation');
const { CANCELLED } = require("dns");

// Create an app instance
const appGoogle = conversation();

// Register handlers for Actions SDK


appGoogle.handle('question', conv => {
    conv.add("Here is the question!");
    conv.add(rows[i].question);
})

appGoogle.handle('answer', conv => {
    conv.add("Here is the answer!");
    conv.add(rows[i].answer);
    i = i + 1;
    if (i >= numOfRows)
    {
        i = 0;
    }

})

app.post('/fulfillment', appGoogle);


/////////////////////////////////


const HEROKU_PORT = process.env.PORT;

app.listen(HEROKU_PORT||3000, function (req,res) {
    console.log("Server started.")

});