
var dbconfig = require('./config');


var connstring = dbconfig.localDB;
var Drive = dbconfig.DriveN;

var bcrypt = require('bcrypt-nodejs');
var sendE = require('./sendEmail.js');
var logs = require('./logs.js');


var connectionString = dbconfig.SQL_CONN;
const friendly = require('tedious-friendly');
const TYPES = friendly.tedious.TYPES;
const connectionConfig = { options: { useUTC: true } };
const poolConfig = { min: 2, max: 4, log: false };

const db = friendly.create({ connectionString, connectionConfig, poolConfig });


module.exports = function(app, passport) {
/*app.get('/InicioPoliza',function(req, res){
db.query('select * from polizas,equipos',(err,resultado)=>{
if(err){
console.log(err);
}else{
    console.log(resultado);
    res.render('polizas',{poliza:resultado[0]});
    
}

})

res.render('InicioPoliza');
})
*/
/*app.get('/InicioPoliza',function (req,res){
    //var noSerie={noSerie:[TYPES.NVarChar,req.body.noSerie]}
    /*db.query('select * from equipos where numeroSerie=@noSerie',noSerie,(err,resultado)=>{
        if(err){
        console.log(err);
        }else{
            console.log(resultado);
            res.render('polizas',{poliza:resultado[0]});
            
        }
        
        })
  console.log(req.body)
})



   db.query('select * from polizas where id=2',(err,resulta)=>{
        if(err){
        console.log(err);
        }else{

            console.log(resulta);
            res.render('InicioPoliza',{resulta:resulta[0]});
            
        }
        
        })
  console.log(req.body);
})*/



app.get('/poliza/InicioPoliza/',function(req, res){
    db.query('SELECT * FROM Equipos e INNER JOIN Polizas p ON p.id=e.IdPoliza WHERE p.id=2',(err,resultado)=>{
    if(err){
    console.log(err);
    }else{
        console.log(resultado)
        db.query('select top 3 id, Pro_Observ,Orden,TipoEquipo, Fecha_ing, Estatus from Ordenes where Poliza = 1 and Cliente = @cliente ORDER BY id DESC',{cliente:[TYPES.NVarChar,"C002"]},(err,resu)=>{
            if(err){
            console.log(err);
            }else{
                console.log(resu);
                res.render('InicioPoliza',{resulta:resultado[0],ServRec:resu});
                  
                }
                
            })
                
        
    }
    
    })
    
    })

app.get('/poliza/DetalleEquipo/',function(req, res){
    var value = { id:[TYPES.Int,req.query.id]}
    db.query('SELECT * FROM Equipos e INNER JOIN Polizas p ON p.id=e.IdPoliza WHERE e.id=@id',value,(err,detalle)=>{
    if(err){
    console.log(err);
    }else{
        console.log(detalle)
        db.query('select top 3 id, Pro_Observ,Serie,Orden,TipoEquipo, Fecha_ing, Estatus from Ordenes where Poliza = 1 and Cliente = @cliente and Registro=@codigo ORDER BY id DESC',{cliente:[TYPES.NVarChar,"C002"],codigo:[TYPES.NVarChar,detalle[0].CodigoBarras]},(err,respuesta)=>{
            if(err){
            console.log(err);
            }else{
                console.log(respuesta);
                res.render('DetalleEquipo',{detalle:detalle[0],ServRec1:respuesta});
                      
                }
                })
                    


                
            
    }
        
    })
        
    })
app.post('/poliza/comentarios/',function(req, res){
})


app.get('/poliza/DetalleServicio/',orden,function(req, ress){
             
    })
    function orden(req, res, next) {
        console.log(req.query)
        var value = { id:[TYPES.Int,req.query.id]}


        db.query("select * from ordenes where id =@id ", value, (err, ordens) => {
            if (err) {
                console.error(err);
            }
            if (ordens[0].ID_pendiente > 0) {
                var pendiente = {
                    id : [TYPES.Int, ordens[0].ID_pendiente],
										reporte : [TYPES.Char, 'Reporte']
                }
                db.query("select ID, PENDIENTE,OBSERV, HoraR, DATEADD(second, 0, FechaR) as  'FechaR' from pendient where id = @id", pendiente, (err, pendient) => {

                    if (err){
                        console.log(err)
                    }
                    consul =  'select Id, IdPendiente, Respuesta, Observ,  FechaT, HoraT, Usuario  from respues where IdPendiente =@id order by id'
                    console.log( pendient)

                    db.query(consul, pendiente, (err, respues) => {
                        if (err)
                            console.log(err);
                        console.log(respues);
                        res.render('DetalleServicio', { 'orden' : ordens[0], 'pendiente': pendient[0], 'respues': respues});
                    
                    });
                })
            } else {
                res.render('DetalleServicio', { 'orden' : ordens[0] });
            }
         });
    };
  
app.get('/poliza/SolicitudDeServicio/',function(req, res){
    /*db.query('select * from polizas,equipos',(err,resultado)=>{
    if(err){
    console.log(err);
    }else{
        console.log(resultado);
        res.render('polizas',{poliza:resultado[0]});
        
    }
    
    })
    */
    res.render('SolicitudDeServicio');
    })

app.get('/poliza/inventarioTable/',function(req, res){
        /*db.query('select * from polizas,equipos',(err,resultado)=>{
        if(err){
        console.log(err);
        }else{
            console.log(resultado);
            res.render('polizas',{poliza:resultado[0]});
            
        }
        
        })
        */
res.render('inventarioTable');
})
    

app.get('/tables/inventarioTable', function (req, res) {

    Consulta = "select ID,numeroSerie , CodigoBarras, Marca,Modelo, Tipo, Estatus,Observaciones FROM Equipos where IdPoliza=4";

    //mysql.open(connstring, function (err, conn) {
        db.query(Consulta, {equipos:[TYPES.SmallInt, 1]}, (err, equipos) => {
            if (err)
                //return done(err);
                console.log(err);
            res.send(equipos);
        });
    //});

});
app.get('/poliza/historialTable/',function(req, res){
    /*db.query('select * from polizas,equipos',(err,resultado)=>{
    if(err){
    console.log(err);
    }else{
        console.log(resultado);
        res.render('polizas',{poliza:resultado[0]});
        
    }
    
    })
    */
res.render('historialTable');
})

app.get('/tables/historialTable', function (req, res) {

    Consulta = "select ID, TipoEquipo, Estatus, ObservEquipo FROM Ordenes where cliente='C002'and poliza=1";

    //mysql.open(connstring, function (err, conn) {
        db.query(Consulta, {equipos:[TYPES.SmallInt, 1]}, (err, equipos) => {
            if (err)
                //return done(err);
                console.log(err);
            res.send(equipos);
        });
    //});

});
app.post('/solicitudServicio',function(req,res){
    console.log(req.body)
    res.send('')
})





}
