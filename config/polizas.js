var dbconfig = require('./config')
var connstring = dbconfig.localDB;
var Drive = dbconfig.DriveN;

var connectionString = dbconfig.SQL_CONN;
const friendly = require('tedious-friendly');
const TYPES = friendly.tedious.TYPES;
const connectionConfig = { options: { useUTC: true } };
const poolConfig = { min: 2, max: 4, log: false };

// create connection pool
const db = friendly.create({ connectionString, connectionConfig, poolConfig });

module.exports = function (app, passport){

    app.get('/detalleequipo', function(req, res){
        db.query("select * from equipos where id = 2 ", (err, datos)=>{
            if (err)
                console.log(err)
            res.render('detalleEquipo', {equipo:datos[0]})  
        })
    })
};
