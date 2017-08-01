var express = require('express');
var app = express();
var mysql = require('mysql');
const path = require('path');
var bodyParser = require('body-parser')
var session   = require('express-session');


var client = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'alegator',
    database: 'vapeShop'
});

var MySQLStore = require('express-mysql-session')(session);

app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: new MySQLStore({
        host: 'localhost',
        user: 'root',
        password: 'alegator',
        database: 'vapeShop',
        checkExpirationInterval: 900000,
        expiration: 86400000,
        createDatabaseTable: true,
        connectionLimit: 1,
        schema: {
            tableName: 'sessions',
            columnNames: {
                session_id: 'session_id',
                expires: 'expires',
                data: 'data'
            }
        }})
}));

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: false
}));

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(__dirname));

app.use('/goods/:id', express.static(__dirname));

app.use('/registration', express.static(__dirname));

app.post('/', function(req, res) {
    client.query('SELECT * FROM goods', function(error, result, fields){
        res.send(JSON.stringify(result));
    });
});

app.post('/search', function(req, res) {
    client.query("SELECT * FROM goods WHERE goodName LIKE '%" + req.body.searchParams +"%'", function(error, result, fields){
        res.send(JSON.stringify(result));
    });
});

app.post('/registration', function(req,res) {
    var login = req.body.login;
    var password = req.body.password;
    var email = req.body.regEmail;
    var regInform = {
        isLoginMatch: false,
        isEmailMatch: false
    };
    client.query("SELECT * FROM Users WHERE login = ?", [login], function(error, result, fields) {
        console.log(result.length);
        if (result.length == 0) {
            regInform.isLoginMatch = true;
        }
    });
    client.query("SELECT * FROM Users WHERE email = ?", [email], function(error, result, fields) {
        console.log(result.length);
        if (result.length == 0) {
            regInform.isEmailMatch = true;
        }
    });

    setTimeout(() => {
        console.log(regInform);
        var values = {login: login, pass: password, email: email};
        if (regInform.isEmailMatch == true & regInform.isLoginMatch == true) {
            client.query("insert into Users SET ?", values, function(error, result, fields) {
                console.log(result);
            });
        }
        res.send(JSON.stringify(regInform));
    }, 500)
});

app.post('/login', function(req, res) {
    client.query('SELECT * FROM Users', function(error, result, fields) {
        res.send(JSON.stringify(result));
    });
});

app.post('/Atomizers', function(req, res) {
    client.query('SELECT * FROM goods WHERE category = "Atomizers"', function(error, result, fields){
        res.send(JSON.stringify(result));
    });
});

app.post('/Mods', function(req, res) {
    client.query('SELECT * FROM goods WHERE category = "Mods"', function(error, result, fields){
        res.send(JSON.stringify(result));
    });
});

app.post('/Accumulators', function(req, res) {
    client.query('SELECT * FROM goods WHERE category = "Accumulators"', function(error, result, fields){
        res.send(JSON.stringify(result));
    });
});

app.post('/Coils', function(req, res) {
    client.query('SELECT * FROM goods WHERE category = "Coils"', function(error, result, fields){
        res.send(JSON.stringify(result));
    });
});

app.post('/Chargers', function(req, res) {
    client.query('SELECT * FROM goods WHERE category = "Chargers"', function(error, result, fields){
        res.send(JSON.stringify(result));
    });
});

app.post('/Liquids', function(req, res) {
    client.query('SELECT * FROM goods WHERE category = "Liquids"', function(error, result, fields){
        res.send(JSON.stringify(result));
    });
});

app.post('/buy', function(req, res) {
    client.query('SELECT * FROM goods WHERE id = ?', [req.body.goodId], function(error, result, fields){
        var value = {goodID: result[0].id, userLogin: req.body.userlogin};
        client.query('INSERT INTO History SET ?', value, function(error, result, fields){
            res.send(JSON.stringify(result));
        });
    });
});

app.post('/history', function(req, res) {
    client.query('SELECT * FROM History WHERE userLogin = ?', [req.body.userlogin], function(error, result, fields){
        res.send(JSON.stringify(result));
    });
});

app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});
