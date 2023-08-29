// server.js

const express = require('express');
const { MongoClient } = require('mongodb');
const mysql = require('mysql');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URL);



//Create an app
const app = express();

app.use('/', (req,res,next) => {
    if(req.query){
        console.log(req.query);
    }
    next();
})

app.get('/', (req, res) => {
    res.send('Hello world\n');
});


app.post('/', (req, res) => {
    res.send(req.query);
});



//Listen port
const PORT = process.env.SERVER_PORT || 3001;
app.listen(PORT);
console.log(`Running on port ${PORT}`);
load_mongo();
setTimeout(() => {
    load_sql();
}, 4000);

async function load_mongo(){
    try {
        await client.connect(); //initialize databse here
        console.log("Connected to Mongodb");
      }
      catch(er){
        console.log(er);
      }
      finally {
        // Ensures that the client will close when you finish/error
        await client.close(); // 
    }
}

function load_sql(){
    //console.log(`Creating connection with string: ${process.env.SQL_URL}`);
    console.log(`mysql://${process.env.SQL_USER}:${process.env.SQL_PASS}@${process.env.SQL_HOST}:${process.env.SQL_PORT}/db`);
    const sql_con = mysql.createConnection({
        host: process.env.SQL_HOST,
        port: process.env.SQL_PORT,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASS,
        flags:'-CONNECT_WITH_DB'});
    sql_con.connect((err) => {
        if(err){
            console.log(err);
            return;
        }

        console.log(`Connected to  sql: con thread ${sql_con.threadId}`);
        
    })
}