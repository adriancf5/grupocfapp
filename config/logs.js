//var mysql = require('msnodesql');
var dbconfig = require('./config');
var connstring = dbconfig.SQL_CONN;

 

module.exports.accessLogin = function (req) {
    var fecha1 = new Date();
    var fecha = this.newDate(fecha1)
    var hora = (fecha1.getHours()) + ":" + (fecha1.getMinutes())
    var client = 0
    if (req.user[0].Cliente === 1) {
        client = 1
    }
        var consulta = "INSERT into bitLogin (Usuario, Nombre, Fecha, Hora, remoteAddres, host, userAgent, client) values(@usuario, @nombre, @fecha, @hora, @dir, @host, @agent, @cliente)"
       
        var valores = {
            usuario:[TYPES.Char, req.user[0].usuario],
            nombre:[TYPES.Char, req.user[0].Nombre],
            fecha: [TYPES.DATETIME, fecha],
            hora: [TYPES.Char, hora],
            dir: [TYPES.NVarChar, req._remoteAddress],
            host:[TYPES.NVarChar, req.headers.host],
            agent:[TYPES.NVarChar, ''],
            cliente:[TYPES.Bit, client]
        }
        db.query(consulta, valores, (err, orden) =>{
            if (err)
                console.log(err);
                   
        });
}

module.exports.newDate = function (fecha1) {
    var year = fecha1.getFullYear();
    var mes = fecha1.getMonth() + 1;
    //var mes = fecha1.getMonth();
    var dia = fecha1.getDate();
    //var fecha = new Date(Date.UTC(year, mes, dia));
    var fecha = dia + '-' + mes + '-' + year;
    return fecha
}
    