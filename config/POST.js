var dbconfig = require('./config');
var Drive = dbconfig.DriveN;
var Limage = dbconfig.images;
var htmlFile = dbconfig.htmlFile;
var fs = require('fs');
var bcrypt = require('bcrypt-nodejs');
var fileHtml = require('./ordenHTMLN.js')
var sendE = require('./sendEmail.js')
var bcrypt = require('bcrypt-nodejs');
var to = dbconfig.nameAdmon + ' <' + dbconfig.emailAdmon + '> ';
var userAdmon = dbconfig.userAdmon;
var urlPublic = dbconfig.urlPublic;

var connectionString = dbconfig.SQL_CONN;
const friendly = require('tedious-friendly');
const TYPES = friendly.tedious.TYPES;
const connectionConfig = { options: { useUTC: true } };
const poolConfig = { min: 2, max: 4, log: false };

// create connection pool
const db = friendly.create({ connectionString, connectionConfig, poolConfig });

module.exports = function (app, passport) {


    app.post('/dePartida', isLoggedIn, function (req, res) {
        var articulo = req.body.articulo;
            var queryString = "select estado from ventas where venta =  @venta ";
            var values ={ venta:  [TYPES.Int,  req.body.ventas]};
            db.query(queryString , values,  (err, datos) => {
                if (err)
                    console.log(err);
                if (datos[0].estado === 'PE') {
                    var values = {salida:[TYPES.Int, req.body.valor],venta:[TYPES.Int ,req.body.ventas], art:[TYPES.Char, articulo]};
                    db.query("delete from partvta where id_salida = @salida and venta = @venta and articulo = @art" , values, (err, datos) => {
                        if (err)
                            console.log(err);
                            updateVenta(req.body.ventas);
                            res.end('')
                    });
                    var values = {salida:[TYPES.Int, req.body.valor],venta:[TYPES.Int ,req.body.ventas], art:[TYPES.Char, articulo]};
                    db.query("delete from orderMaterial where id = @salida and venta = @venta and articulo = @art " , values, (err, datos) => {
                        if (err)
                            console.log(err);
                    });
                } else {
                    res.end('')
                }
            });
    });

    app.post('/soporteSistemas', isLoggedIn, function (req, res){
        console.log(req.body)
        if (cliente != '' && descrip != ''){
            var values = {cliente  :[TYPES.Char, req.body.cliente],
                          nombre : [TYPES.NVarChar, req.body.nombre],
                          usuario: [TYPES.Char, req.user[0].Usuario],
                          Anombre: [TYPES.NVarChar, req.user[0].Nomvre],
                          tservicio: [TYPES.Char, req.body.tservicio],
                          reporto: [TYPES.Char, req.body.contacto],
                          descrip: [TYPES.NVarChar, req.body.observacion],
                          tiempo: [TYPES.Char, req.body.tiempo],
                          estatus: [TYPES.Char, req.body.estatus],
                          fecha1: [TYPES.Char, fechaini],
                          fecha2: [TYPES.Char, fechafin],
                          hour: [TYPES.Char, hora],
                          clave: [TYPES.Char, req.body.Servicios],
                          }
            var insertQuery = "INSERT INTO soporteSistemas ( Cliente, nombre, Atendio, aNombre,  Tiposervicio, "
            insertQuery += " reporto, sdescripcion, Tiempo, estatus, Fechaini, FechaFin, Horaini, Horafin, "
            insertQuery += " ClaveSoporte, fechaTrabajo ) values( @cliente, "
            insertQuery += " @nombre, @usuario, @Anombre, @tservicio, @reporto, @descrip, @tiempo, @estatus, @fecha1, fecha2, @hour, @hour, @clave, @fecha1) ";

            db.query(insertQuery, values , (err, soporte) => {
                if (err) {
                    res.redirect('/Sistema', {mesage: 'No se pudo guardar el servicio, Intentalo mas tarde', user: req.user[0]});
                    console.log(err)

                } else {
                  res.redirect('/Sistema');
                }
            })
        } else {
            res.redirect('/Sistema');
        }
    });

    app.post('/OrdenRes', isLoggedIn, function (req, res) {
        var respuesta = (req.body.respuesta).trim();
        var Estatus = 'Recepcion'
        if (respuesta === 'asignar') {

           var asignado = (req.body.Asignado).trim();

            Estatus = 'Revision'
        } else if (respuesta === 'diagnostico') {
            Estatus = 'Diagnostico';
        } else if (respuesta === 'reparacion') {
            Estatus = 'Reparacion'
        } else if (respuesta === 'termino') {
            Estatus = 'Terminado'
        } else if (respuesta === 'entregar') {
            Estatus = 'Entregado'
        } else if (respuesta === 'otra') {
            Estatus = 'Diagnostico'
        }
        var user1 = req.user[0].Usuario;
        var fecha1 = new Date();
        var fecha = newDate(fecha1)
        var horaHoy = (fecha1.getHours()) + ":" + (fecha1.getMinutes())
        var fechaHoy = fecha;
        if (req.body.startdate != '') {
            var fechaInicio = req.body.startdate
            console.log(req.body.startdate)
        } else {
            var fechaInicio = fechaHoy
        }
        if (req.body.exittime != '') {
            var hora = (req.body.exittime)
        } else {
            var hora = horaHoy
        }
        if (req.body.startdate1 != '') { var fechaFinal = req.body.startdate1; } else { var fechaFinal = fechaHoy }
        if (req.body.exittime1 != '') {var horaFinal = (req.body.exittime1); } else {  var horaFinal = horaHoy}


        db.query("SELECT Consec from consec where dato = @dato", {dato: [TYPES.Char, 'respuesta']} ,(err, consec) => {
            if (err) {
                console.log(err);
            } else {
                id = consec[0].Consec + 1;
                var respues ={
                    ide:[TYPES.Int, id],
                    idPendiente:[TYPES.Int, parseInt(req.body.idPendiente) ],
                    respuesta: [TYPES.NVarChar, respuesta ],
                    comentario: [TYPES.NVarChar,  req.body.comentario],
                    fecha1: [TYPES.Char, fechaInicio],
                    hora1: [TYPES.NVarChar, hora],
                    Fecha2: [TYPES.Char, fechaFinal],
                    hora2: [TYPES.NVarChar, horaFinal],
                    solucion: [TYPES.SmallInt, 0],
                    ultimo: [TYPES.SmallInt, 1],
                    llamada: [TYPES.NVarChar, '(Ninguno)'],
                    usuario: [TYPES.NVarChar, req.user[0].Usuario],
                    fecha: [TYPES.Char, fecha],
                    hora: [TYPES.NVarChar, horaHoy]

                }


                var queryString = "INSERT INTO respues ( Id, IdPendiente, Respuesta, Observ, fecha, Hora, fechaT, HoraT, Solucion, "
                queryString += " Ultimo, TLlamada, Usuario, usuFecha, UsuHora) "
                queryString += " VALUES( @ide, @idPendiente, @respuesta, @comentario ,@Fecha1,  @hora1 ,@Fecha2, @hora2, @solucion, @ultimo, @llamada, @usuario, @fecha ,@hora) "
                //queryString += " VALUES( @ide, @idPendiente, @respuesta, @comentario , @fecha , @hora1 , @fecha, @hora2, @solucion, @ultimo, @llamada, @usuario, @fecha, @hora) "
                //console.log(respues)
                db.query(queryString, respues , (err, respuest) => {
                    if (err)
                        console.log(err);
                    console.log('test')
                    db.query("UPDATE consec set consec = @ide where dato = @resp",{ide:[TYPES.Int, id], resp:[TYPES.NVarChar, 'respuesta']}, (err, consul) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    res.end('');
                });
                if (respuesta === 'asignar') {
                    var dat = {asignado:[TYPES.NVarChar, asignado], idP: [TYPES.Int, parseInt(req.body.idPendiente)]}
                    db.query("UPDATE pendient set para =@asignado where id = @idP" , dat , (err, consul) => {
                        if (err) {
                            res.end(err);
                        } else {
                            //db.query("Select Serie, Orden, email, nombre from ordenes inner join usuariosWeb on ordenes.asignado = usuariosWeb.usuario where ID_pendiente =@idP"  , dat,   (err, o) => {
                                //if (err) {
                                    //console.log(err);
                                //} else {
                                    //var text = "Te ha sido asignada la orden"
                                    //var html = "</br><a href='" + urlPublic + "'> Ingresa, para revisarla!</a>"
                                    //sendE.sendEmail(o[0].nombre + " <" + o[0].email + "> ", 'Orden ' + o[0].Serie + '-' + o[0].Orden + ': Asignada', text, html)
                                //}
                            //});
                        }
                    });
                    db.query("UPDATE ordenes set asignado = @asignado where ID_pendiente = @idP" , dat , (err, consul) => {
                        if (err) {
                            res.end(err);
                        }
                    });
                }
                if (respuesta === 'asignarExt') {
                    var dato= {asig:[TYPES.NVarChar, req.body.Asignado], idP: [TYPES.Int, parseInt(req.body.idPendiente)]}
                    console.log('idpendiente  =' + respuesta)
                    db.query("UPDATE ordenes set asignadoEx = @asig where ID_pendiente = @idP" , dato , (err, consul) => {
                        if (err) {
                            console.log(err)
                        } else {
                          db.query("Select Serie, Orden, email, nombre from ordenes inner join usuariosWeb on ordenes.asignadoEx = usuariosWeb.usuario where ID_pendiente =@idP"  , dato,   (err, o) => {
                              if (err) {
                                  console.log(err);
                              } else if(o.length  > 0){
                                  var text = "Te ha sido asignada la orden"
                                  var html = "</br><a href='" + urlPublic + "'> Ingresa, para revisarla!</a>"
                                  sendE.sendEmail(o[0].nombre + " <" + o[0].email + "> ", 'Orden ' + o[0].Serie + '-' + o[0].Orden + ': Asignada', text, html)
                              }
                          });
                        }
                    });
                }
                var dat = {asignado:[TYPES.NVarChar, asignado], idP: [TYPES.Int, parseInt(req.body.idPendiente)], resp: [TYPES.NVarChar, Estatus], entero:[TYPES.SmallInt, 1]}

                if (req.body.respuesta && req.body.respuesta != 'Reporte' && req.body.respuesta != 'asignarExt'  && req.body.respuest != 'comentario') {
                    db.query("UPDATE ordenes set  Estatus =@resp where ID_pendiente = @idP" , dat,  (err, consul) => {
                        if (err) {
                            res.end(err);
                        }
                    });
                }

                if (respuesta === 'diagnostico'  || respuesta === 'otra') {
                    db.query("UPDATE ordenes set Diagnostico = @entero  where ID_pendiente =@idP " , dat , (err, consul) => {
                        if (err) {
                            res.end(err);
                        }
                    });
                } else if (respuesta === 'reparacion') {
                    db.query("UPDATE ordenes set Reparacion = @entero  where ID_pendiente = @idP " , dat,   (err, consul) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                } else if (respuesta === 'termino') {
                    db.query("UPDATE ordenes set Terminado = @entero  where ID_pendiente = @idP " , dat,  (err, consul) => {
                        if (err) {
                            res.end(err);
                        } else {
                            db.query("Select Serie, Orden, Venta from ordenes where ID_pendiente = @idP " , dat, (err, o) => {
                                if (err) {
                                    console.log(err);
                                }
                                db.query("UPDATE ventas set ocupado = @cero where venta = @venta", {venta:[TYPES.Int, o[0].Venta ], cero:[TYPES.Int, 0]}, (err, vent) =>{
                                    if (err) {
                                        console.log(err)
                                    }
                                });

                                var text = ""
                                var html = "<a href='"+ urlPublic + "/orden/"+ o[0].Serie + '-' + o[0].Orden +".html'> La orden ha sido terminada. </a>"
                                sendE.sendEmail(to, 'Orden '+ o[0].Serie + '-' + o[0].Orden + ': Terminada', text, html)

                            });

                        }
                    });

                } else if (respuesta === 'entregar') {
                    var dat = {idP:[TYPES.Int, parseInt(req.body.idPendiente)], uno:[TYPES.SmallInt, 1], estado:[TYPES.Char, 'CO']}
                    db.query("UPDATE ordenes set Entregado = @uno  where ID_pendiente = @idP" , dat , (err, consul) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    db.query("UPDATE pendient set ESTADO = @estado where id = @idP "  , dat,  (err, consul) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            }
        });

    });

    function changFecha(id, fecha, hora){
        //var valores = [fecha, hora, id ]
        var valores ={fecha:[TYPES.Char, fecha], hora:[TYPES.Char, hora], id:[TYPES.Int, id]}
        db.query("UPDATE ordenes set fecha_ing = @fecha and UsuHora_ing = @hora where id = @id", valores, (err, datos) => {
            if (err)
                res.render("error", { message: "", error: err })
            });
    }

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/Inicio', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    app.post('/updateUser', function (req, res) {
        console.log(req.body)
        var r = req.body;
        db.query("Select * from usuariosWeb where usuario = @user ",  {user:[TYPES.Char, (req.body.username).trim()]}, (err, datos) => {
            if (err){
                res.render("error", { message: "", error: err })
            }
            if (datos.length == 1) {
                if (r.admon == 'on'){
                    var admon = 1
                } else {
                    var admon = 0
                }
                if (r.password != ''){
                    var password = bcrypt.hashSync(r.password, null, null)
                } else {
                     var password = datos[0].password
                }

                var valores ={ nombre:[TYPES.NVarChar,r.nombre ],
                             password: [TYPES.Char, password],
                             correo: [TYPES.Char, r.correo],
                             telefono: [TYPES.Char, r.telefono],
                             equipos: [TYPES.Char, r.Equiposa],
                             servicios: [TYPES.Char, r.Servicios],
                             vend: [TYPES.Char, r.Vendedor],
                             estacion: [TYPES.Char, r.Estacion],
                             admon: [TYPES.SmallInt, admon],
                             observ: [TYPES.NVarChar, r.observacion],
                             user: [TYPES.Char,  (req.body.username).trim()]}

                db.query("update usuariosweb set nombre = @nombre, password = @password, email = @correo, telefono = @telefono, Equipos = @Equipos, Servicios = @servicios, Vend = @vend,  estacion = @estacion, admon = @admon , Observ = @observ where usuario = @user " ,  valores,  (err, datos)  => {
                    if (err){
                        console.log(err)
                        //res.render("error", { message: "", error: err })
                    }
                  });
            }
        });
        res.end()
    });

    app.post('/UserNew', function (req, res) {
        //mysql.open(connstring, function (err, conn) {
        db.query("select * from usuariosWeb where usuario =@user ",{ user:[TYPES.Char, req.body.username ]},(err, rows) =>{
            if (err)
                res.render("error", { message: "", error: err })
            if (rows.length) {
                    res.render("error", { message: "El usuario ya existe", error: "" })
            } else {
                    // if there is no user with that username
                    // create the user
                var newUsersql = {
                    username: req.body.username,
                    password: bcrypt.hashSync(req.body.password, null, null)  // use the generateHash function in our user model
                };
                var admon = 0;
                var cliente = 0;
                var proveed = 0;
                var activo = 0;
                if (req.body.admon) { admon = 1 };
                if (req.body.cliente) { cliente = 1};
                if (req.body.proveed){ proveed = 1};
                if (req.body.activo){activo = 1}
                var values = { correo:[TYPES.Char, req.body.correo],
                             admon: [TYPES.SmallInt, admon],
                             correo2: [TYPES.Char,  req.body.correo2],
                             telefono: [TYPES.Char, req.body.telefono ],
                             tel2: [TYPES.Char, req.body.telefono1 ],
                             dir: [TYPES.NVarChar, req.body.Direccion],
                             estado: [TYPES.Char, 'Queretaro'],
                             pais: [TYPES.Char, 'Mexico'],
                             cp: [TYPES.Char, req.body.CP],
                             observ : [TYPES.NVarChar, req.body.observacion],
                             equipos: [TYPES.Char, req.body.Equipos],
                             servicios: [TYPES.Char, req.body.Servicios],
                             cliente: [TYPES.Char, cliente],
                             nombre : [TYPES.Char, req.body.nombre],
                             vend: [TYPES.Char, req.body.Vendedor],
                             estacion: [TYPES.Char, req.body.Estacion],
                             usuario: [TYPES.Char, req.body.username ],
                             password: [TYPES.NVarChar, newUsersql.password ],
                             proveedor: [TYPES.SmallInt, proveed],
                             activo : [TYPES.SmallInt, activo]
                            }
                var insertQuery = "INSERT INTO usuariosWeb ( Usuario, Password, email, admon,  correoP, telefono, telefono2, "
                    insertQuery += " Dir1, Estado, Pais, CP, Observ,  Equipos, Servicios, Cliente, Nombre, Vend, estacion, proveedor, activo)  "
                    insertQuery += " values(@usuario, @password, @correo, @admon, @correo2, @telefono, @tel2, @dir, @estado, "
                    insertQuery += " @pais, @cp, @observ, @equipos, @servicios , @cliente, @nombre, @vend, @estacion, @proveedor, @activo) ";

                db.query(insertQuery, values ,  (err, rows) => {
                    if (err) {
                        res.render("error", { message: "" , error: err })
                        console.log(err);
                        return;
                    }
                    res.redirect('/');
                });
            }
        });
    });

    app.post('/nuevoEquipo', function (req, res) {
        if (req.body.startdate) {
            var fecha1 = req.body.startdate;
            fecha = newDates(fecha1)
        } else {
            var fecha1 = new Date();
            var fecha = newDate(fecha1)
        }
        if (req.body.exittime) {
            hora = (req.body.exittime)
        } else {
            var hora = (fecha1.getHours()) + ":" + (fecha1.getMinutes())
        }
        var q = req.body, correo = q.correo, numeroSerie = '', modelo = '', marca = '', serieFuente = '', obserEquipo = '',
            tServicio = q.TipoServicio, oServicio = q.otroServicio, oProblema = '',
            otProblema = '', dProble = q.descProblema, usuario = req.user[0].Usuario, fuente = 0, serie = '', hard = 0, soft = 0
        var authA = 0, authR = 0, fotos = '', password = '';
        var negro = 0, magenta = 0, azul = 0, amarillo = 0;
        var cpu = 0, teclado = 0, mouse = 0, monitor = 0, monitorsn = 0, otroColor = '';
        var prev = 0, correctivo = 0, otro = 0, recepcion = 1, diagnostico = 0, reparacion = 0, terminado = 0, estatus = 'Recepcion', asignado = ''
        var completo = 0, garantia = 0, poliza = 0;
        if (q.TipoEquipo === "Servicio") {
            serie = req.user[0].Servicios;
            if (q.completada === 'on') {
                completo = 1;
            }
            if (q.asignado != 'default') {
                asignado = q.asignado;
            }
        } else {

            serie = req.user[0].Equipos, numeroSerie = q.serie, modelo = q.Modelo, marca = q.marca, serieFuente = q.nsFuentePoder, obserEquipo = q.comentario, oProblema = q.origenProblema;
            otProblema = q.otroProblema, monitorsn = q.MonitorSn, otroColor = q.otroColor;
            if (q.negro === 'on') {
                negro = 1
            }
            if (q.amarillo === 'on') {amarillo = 1}
            if (q.magenta === 'on') { magenta = 1}
            if (q.azul === 'on') {azul = 1}
            if (q.fuentePoder === 'on') {var fuente = 1}
            if (q.CPU === 'on') {cpu = 1}
            if (q.Teclado === 'on') {teclado = 1}
            if (q.Monitor === 'on') {monitor = 1}
            if (req.body.apertura === 'on') {authA = 1}
            if (req.body.aReparacion === 'on') {authR = 1}
            if (tServicio === 'Preventivo') {prev = 1}
            else if (tServicio === 'Correctivo') {correctivo = 1}
            else if (tServicio === 'Garantia'){garantia = 1}
            else if (tServicio === 'Poliza'){poliza = 1}
            var soft = 0, hard = 0;
            if (oProblema === 'Software') {soft = 1;} else if (oProblema === 'Hardware') {hard = 1}
            fotos = req.body.fotos
        }
        if (completo === 1) {diagnostico = 1, reparacion = 1, terminado = 1, estatus = 'Terminado'}

        var siguiente = [];

        db.query("select Consec from consec where Dato = @serie " ,{serie:[TYPES.Char, serie]},  (err, datos) => {
            if (err)
                res.render("error", { message: "", error: err })
            if (datos.length > 0) {
                add(datos[0]);
            }
        });
        function add(consec) {

            var next = consec.Consec + 1;
            var valores = {
                orden:[TYPES.Int, next],
                serie: [TYPES.Char, serie],
                vend: [TYPES.Char, req.user[0].Vend ],
                vNombre: [TYPES.NVarChar, req.user[0].Nombre],
                cliente: [TYPES.Char, q.clave],
                cNombre: [TYPES.NVarChar, q.clienteNombre],
                tel: [TYPES.Char, q.telefono],
                reporto: [TYPES.NVarChar, q.reporto],
                dir: [TYPES.NVarChar,  q.calle + ' , ' + q.colonia + ' , '+ q.poblacion],
                tEquipo: [TYPES.Char, q.TipoEquipo],
                nSerie: [TYPES.Char, numeroSerie],
                marca: [TYPES.Char, marca],
                modelo: [TYPES.Char, modelo],
                password: [TYPES.Char, password],
                observ: [TYPES.NVarChar, obserEquipo ],
                cero: [TYPES.SmallInt, 0],
                fuente: [TYPES.SmallInt, fuente],
                sFuente: [TYPES.Char, serieFuente],
                garantia: [TYPES.SmallInt, garantia],
                poliza: [TYPES.SmallInt, poliza],
                prev: [TYPES.SmallInt, prev],
                correctivo: [TYPES.SmallInt, correctivo],
                oServicio: [TYPES.Char, oServicio],
                hardware: [TYPES.SmallInt, hard],
                software: [TYPES.SmallInt, soft],
                oProblema: [TYPES.Char, otProblema],
                problema: [TYPES.NVarChar, dProble],
                cpu: [TYPES.SmallInt, cpu],
                teclado: [TYPES.SmallInt, teclado],
                mouse: [TYPES.SmallInt, mouse],
                monitor: [TYPES.SmallInt, monitor],
                monitorsn: [TYPES.Char, monitorsn],
                negro: [TYPES.SmallInt, negro],
                magenta: [TYPES.SmallInt, magenta],
                azul: [TYPES.SmallInt, azul],
                amarillo: [TYPES.SmallInt, amarillo],
                fecha: [TYPES.Char, fecha],
                estacion: [TYPES.Char, req.user[0].estacion],
                usuario: [TYPES.Char, usuario],
                hora: [TYPES.Char, hora],
                estatus: [TYPES.Char, estatus],
                recepcion: [TYPES.SmallInt, recepcion],
                diagnostico: [TYPES.SmallInt, diagnostico],
                reparacion: [TYPES.SmallInt, reparacion],
                terminado: [TYPES.SmallInt, terminado],
                entregado: [TYPES.SmallInt, 0],
                ventaSerie: [TYPES.Char, ''],
                ventaReferen: [TYPES.Int, 0],
                authA: [TYPES.SmallInt, authA],
                authR: [TYPES.SmallInt, authR],
                asignado: [TYPES.Char, asignado],
                venta: [TYPES.Int, 0],
                otroColor: [TYPES.Char, otroColor]
            }
            if (next > 1) {
                insertOrden(valores, fotos, req, res)
            }
        };
    });

    function insertOrden(valores, fotos, req, res){

        if (fotos != '') {
            var imagen = fotos.split(",")
            //console.log(fotos)
        } else {
            var imagen = [];
        }
        var partidas = [];
        if (req.body.TipoEquipo === 'Servicio' && req.body.descrip) {
            var descrip = req.body.descrip;
            var articulo = req.body.articulo;
            var precio = req.body.price;
            var cantidad = req.body.canti;
            if (typeof(descrip) === 'object') {
                var i = 0;
                while (i < descrip.length) {
                    partidas.push([descrip[i], articulo[i], precio[i], cantidad[i]]);
                    i = i + 1;
                }
            } else if (descrip.length && typeof(descrip) == 'string') {
                partidas.push([descrip, articulo, precio, cantidad]);
            }
        }

            var queryString = "INSERT INTO Ordenes (Orden, Serie, Vend, VendNom ,Cliente, ClienteNom, ClienteTel, contacto, ClienteDir, TipoEquipo, Registro, Marca, Modelo, Password,  " //14
            queryString += " ObservEquipo, Discos, Funda, FuentePoder, FuenteSn, USB, Garantia, Poliza, Preventivo, Correctivo, ServOtro, Hardware, Softwere, MaOperacion,"   //15
            queryString += " OrProblema, Pro_Observ, CPU, Teclado, Mouse, Monitor, Monitorsn, Negro, Magenta, Azul, Amarillo, Color4, Color5, Color6, Color7, " //16
            queryString += " Fecha_ing, Estacion, Usuario, UsuHora_ing, Estatus, Recepcion, Diagnostico, Reparacion, " //8
            queryString += " Terminado, Entregado, VentaSerie, VentaReferen, AutApertura, AutRepara, ID_pendiente, Asignado,  Venta , ModCartucho) "
            queryString += " VALUES(@orden ,@serie ,@vend ,@vNombre ,@cliente ,@cNombre ,@tel ,@reporto ,@dir ,@tEquipo ,@nSerie ,@marca ,@modelo ,@password ,@observ ,@cero , @cero, @fuente ,@sFuente ,@cero ,@garantia ,@poliza ,@prev ,@correctivo  ,@oServicio ,@hardware ,@software ,@cero ,@oProblema ,@problema , @cpu ,@teclado ,@mouse ,@monitor ,@monitorsn ,@negro ,@magenta ,@azul ,@amarillo ,@cero ,@cero ,@cero ,@cero , @fecha ,@estacion ,@usuario ,@hora ,@estatus ,@recepcion ,@diagnostico ,@reparacion ,@terminado , @entregado ,@ventaSerie ,@ventaReferen ,@authA , @authR ,@cero ,@asignado , @venta , @otroColor) "
            db.query(queryString, valores,  (err, consec) => {
                if (err) {
                    console.log(err)
                    res.render("error", { message: "", error: err })
                } else {
                    id = valores.orden[1];
                    var serie = valores.serie[1];
                    db.query("UPDATE consec set consec =@id where dato =@serie" ,{id:[TYPES.Int,id], serie:[TYPES.Char, serie]},(err, orden) => {
                        if (err)
                            res.render("error", { message: "", error: err })
                    });
                    if (imagen.length > 0) {
                        insertImagen(imagen, valores.orden[1], valores.serie[1]);
                    }

                    var obser = "Venta de Orden de Servicio: " + valores.serie[1] + '-'+ valores.orden[1];
                    var venta = [valores.cliente[1], valores.vend[1], 86.21,0,13.79,1,0,1,obser,1, 'MN',valores.cNombre[1], valores.usuario[1], valores.estacion[1], req.user[0].estacion, valores.orden[1], valores.serie[1] ]
                    insertVenta(venta, partidas);

                    var pendient = [valores.orden[1], valores.serie[1], valores.observ[1], valores.usuario[1]]
                    insertPendiente(pendient, valores.asignado[1]);

                    insertUserWeb(valores.cliente[1], valores.cNombre[1], valores.tel[1]);
                    res.render('ordenFinal', { orden: valores.orden[1] , serie : valores.serie[1] , cliente : valores.cliente[1]})

                    setTimeout(function () {
                        creaHTML(valores.serie[1], valores.orden[1], valores.cliente[1], req)
                    }, 2000);

                }
            });
    }
    function insertUserWeb(cliente, nombre, telefono){
            var queryString = "select usuario from usuariosWeb where usuario =@client and cliente = @entero "
            db.query(queryString , {client: [TYPES.Char, cliente], entero:[TYPES.SmallInt, 1]}, (err, datos) => {
                if (err)
                    res.render("error", { message: "", error: err })
                if (!datos.length) {
                    var insertQuery = "INSERT INTO usuariosWeb ( Usuario, Password, email, admon,  correoP, telefono, telefono2, "
                    insertQuery += " Dir1, Estado, Pais, CP, Observ, img, Equipos, Servicios, Cliente, Nombre) values(@usuario, "
                    insertQuery += " @password, @correo , @admon, @correop, @tel, @tel2, @dir, @estado, @pais , @cp, @cadena, @cadena,"
                    insertQuery += " @cadena, @cadena, @cliente , @nombre) ";
                    var values = {
                                    usuario:[TYPES.Char, cliente],
                                    password: [TYPES.NVarChar, newPassword() ],
                                    correo: [TYPES.Char, ''],
                                    correop: [TYPES.NVarChar, ''],
                                    tel: [TYPES.Char, telefono],
                                    tel2: [TYPES.Char, ''],
                                    dir: [TYPES.NVarChar, ''],
                                    estado: [TYPES.Char, 'Queretaro'],
                                    pais: [TYPES.Char, 'Mexico'],
                                    cp: [TYPES.Char, ''],
                                    cadena: [TYPES.Char, ''],
                                    cliente: [TYPES.SmallInt, 1],
                                    nombre: [TYPES.NVarChar, nombre],
                                    admon: [TYPES.SmallInt, 1]
                                   }
                    db.query(insertQuery, values , (err, usuario) => {
                        if (err) {
                            console.log(err)
                        }
                        console.log(usuario)
                    })
                }
            });
    }
    function newPassword(){
        var leter = ['a', 'b', 'c', 'd', 'f', 'g' , 'h' , 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v']
        var numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

        var password = 'CF' + numbers[Math.floor(Math.random() * numbers.length)] + numbers[Math.floor(Math.random() * numbers.length)]
         password += leter[Math.floor(Math.random() * numbers.length)] + numbers[Math.floor(Math.random() * numbers.length)] + numbers[Math.floor(Math.random() * numbers.length)] + leter[Math.floor(Math.random() * numbers.length)]

        return password
    }

    function insertImagen(serieImagen, orden, serie){
        var imagen = serieImagen;
        var fecha1 = new Date();
            var fecha = newDate(fecha1)
        var hora = (fecha1.getHours()) + ":" + (fecha1.getMinutes())
        var i = 0;
        var values = ''
        while (i < imagen.length) {
            var url = "/service/" + imagen[i] + ".png";
            values = {
              orden:[TYPES.Int, orden],
              serie: [TYPES.Char, serie],
              fecha: [TYPES.Char, fecha],
              hora: [TYPES.Char, hora],
              url: [TYPES.NVarChar, url],
              imagen: [TYPES.NVarChar, imagen[i]]
            }
            addImagen(values);
            i = i + 1;
        }
    }
    app.post('/newimagen', function (req, res) {
        var fecha1 = new Date();
        var fecha = newDate(fecha1)
        var hora = (fecha1.getHours()) + ":" + (fecha1.getMinutes())
        var id = req.body.id
        //mysql.open(connstring, function (err, conn) {
            var queryString = "SELECT Orden, Serie from ordenes where id = @id"
            db.query(queryString , {id: [TYPES.Int, parseInt(id)]}, (err, datos) => {
                if (err){
                    console.log(err);
                } else {
                    var values = {
                        orden:[TYPES.Int, datos[0].Orden],
                        serie: [TYPES.Char, datos[0].Serie],
                        fecha: [TYPES.Char, fecha],
                        hora: [TYPES.Char, hora],
                        url: [TYPES.NVarChar,  "/service/"+ req.body.name +".png"],
                        imagen: [TYPES.NVarChar, req.body.name]
                    }
                    //console.log(v)
                    addImagen(values)
                }
            });
        //});
        res.end()

    });
    function addImagen(values){
            var queryString = "INSERT INTO ordenImagen (OrdenNo, Serie, Usufecha, UsuHora, Imagen, serieWeb )"
            queryString += " values (@orden, @serie , @fecha ,@hora ,@url ,@imagen )"
            db.query(queryString , values,  (err, datos) => {
                if (err)
                    console.log(err);
            });
    }

    function insertPendiente(valores, asignado) {
        var fecha1 = new Date();
        var fecha = newDate(fecha1);
        var hora = (fecha1.getHours()) + ":" + (fecha1.getMinutes())
        var pendiente = "Orden de servicio: " + valores[1] + "-" + valores[0];
        var siguiente = [];

        db.query("select Consec from consec where Dato = @pen ", {pen:[TYPES.NVarChar, 'pendiente']},  (err, datos) => {
            if (err)
                res.render("error", { message: "", error: err })
            var i = 0;
            if (datos.length > 0) {
                add(datos[0])
            }

        });
        function  add(id) {
            var id = parseInt(id.Consec) + 1
            var pendient = {
                ide : [TYPES.Int, id ],
                pendiente: [TYPES.NVarChar, pendiente],
                observ: [TYPES.NVarChar, valores[2]],
                fecha: [TYPES.Char, fecha],
                hora: [TYPES.Char, hora],
                cero: [TYPES.Int, 0],
                cadena: [TYPES.Char , ''],
                rev: [TYPES.Char, 'REV'],
                estado: [TYPES.Char, 'PE'],
                para: [TYPES.NVarChar, 'SUP'],
                user: [TYPES.NVarChar, valores[3]]
              }
                var queryString = "INSERT INTO pendient ( Id, PENDIENTE, OBSERV, Fecha, Hora, FechaR, HoraR, IDContacto, "
                queryString += " Articulo, TIPO, ESTADO, F_ini, Para, Usuario,   UsuFecha, UsuHora, idpoliza) "
                queryString += " VALUES( @ide, @pendiente, @observ, @fecha , @hora , @fecha , @hora, @cero, @cadena, @rev, @estado ,@fecha , @para, @user, @fecha, @hora , @cero ) "

                db.query(queryString, pendient ,  (err, consec) => {
                    if (err) {
                        console.log(err);
                    } else {
                        db.query("UPDATE consec set consec =@ide where dato = @pen" ,{ide:[TYPES.Int, id], pen:[TYPES.Char, 'pendiente']}, (err, respuest) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                        var values ={ide:[TYPES.Int, id], orden:[TYPES.Int, parseInt(valores[0])], serie:[TYPES.Char, valores[1]]}
                        db.query("UPDATE Ordenes set ID_pendiente = @ide where Orden = @orden AND Serie =@serie", values, (err, consul) => {
                            if (err) {
                                console.log(err)
                            }
                        });
                        if (asignado != '') {
                            insertRespuest(id, 'asignar', '', fecha, hora, 0, 0, '(Ninguno)', valores[3], asignado)
                        }
                    }
                });
        };
    }

    function insertRespuest(idPendiente, respuesta, comentario, fecha, hora, solucion, ultimo, llamada, user1 , asignado) {
        //mysql.open(connstring, function (err, conn) {
        db.query("SELECT Consec from consec where dato = @res", {res:[TYPES.Char, 'respuesta']}, (err, consec) => {
            if (err) {
                console.log(err);
            } else {
                id = consec[0].Consec + 1;
                var queryString = "INSERT INTO respues ( Id, IdPendiente, Respuesta, Observ, Fecha, Hora, FechaT, HoraT, Solucion, "
                queryString += " Ultimo, TLlamada, Usuario, UsuFecha, UsuHora) "
                queryString += " VALUES( @ide, @idp, @respues, @observ , @fecha , @hora , @fecha, @hora, @solucion, @ultimo, @llamada, @user, @fecha, @hora) "
                var valores= {
                  ide: [TYPES.Int, id],
                  idp: [TYPES.Int, idPendiente],
                  respues: [TYPES.Char, respuesta],
                  observ: [TYPES.NVarChar, comentario],
                  fecha: [TYPES.Char, fecha],
                  hora: [TYPES.Char, hora],
                  solucion: [TYPES.SmallInt, solucion],
                  ultimo: [TYPES.SmallInt, ultimo],
                  llamada: [TYPES.Char, llamada],
                  user: [TYPES.Char, user1]
                }
                db.query(queryString, valores ,  (err, respuest) => {
                    if (err) {
                        console.log(err);
                    } else {
                        db.query("UPDATE consec set consec = @ide where dato = @respues ",{ide:[TYPES.Int, id], respues:[TYPES.Char, 'respuesta']}, (err, consul) => {
                            if (err) { console.log(err) }
                        });
                    }
                });
                db.query("UPDATE pendient set para = @para where id = @id"  ,{para:[TYPES.Char, asignado], id:[TYPES.Int, idPendiente]}, (err, consul)  => {
                    if (err) {console.log(err)}
                });
                db.query("UPDATE ordenes set  Estatus = @estatus  where ID_pendiente = @id "  , {estatus:[TYPES.Char, 'Revision'], id:[TYPES.Int, idPendiente]}, (err, consul) =>{
                      if (err) {console.log(err)}
                });
            }
          });
        //});

    }

    function insertVenta(valores, partidas){
        db.query("select Consec from consec where Dato = @dato", {dato:[TYPES.NVarChar, 'ventapendiente']}, (err, datos) => {
            if (err)
                console.log(err)
            var i = 0;
            if (datos.length > 0) {
                add(datos[0])
            }
        });

        var fecha1 = new Date();
        var fecha = newDate(fecha1)
        var hora = (fecha1.getHours()) + ":" + (fecha1.getMinutes());

        function add(id){
           var referen = parseInt(id.Consec) + 1;
          //console.log(venta)
          var venta = {
            ocupado: [TYPES.SmallInt, 0],
            estado: [TYPES.Char, 'PE'],
            cero: [TYPES.SmallInt, 0],
            noReferen: [TYPES.Int, referen],
            fecha: [TYPES.Char, fecha],
            cliente: [TYPES.Char, valores[0]],
            vend: [TYPES.Char, valores[1]],
            importe: [TYPES.Float, valores[2]],
            descuento: [TYPES.Float, valores[3]],
            impuesto: [TYPES.Float, valores[4]],
            precio: [TYPES.Float, valores[5]],
            costo: [TYPES.Float, valores[6]],
            almacen: [TYPES.Int, valores[7]],
            observ: [TYPES.NVarChar, valores[8]],
            tipoC: [TYPES.Float, valores[9]],
            moneda: [TYPES.Char, valores[10]],
            nombre: [TYPES.NVarChar, valores[11]],
            usuario: [TYPES.NVarChar, valores[12]],
            hora: [TYPES.Char, hora],
            mismo: [TYPES.Char, '(Al mismmo)'],
            caja: [TYPES.NVarChar, valores[13]],
            cadena: [TYPES.Char, ''],
            estacion: [TYPES.Char, valores[14]],
            corte: [TYPES.Char, 'N'],
            local: [TYPES.Char, 'Local']
          }
            //mysql.open(connstring, function (err, conn) {
            var queryString = "INSERT INTO ventas (OCUPADO, TIPO_DOC, serieDocumento, NO_REFEREN, F_EMISION, F_VENC, CLIENTE, VEND, IMPORTE, DESCUENTO, IMPUESTO, PRECIO, COSTO,  "//13
            queryString += " ALMACEN, ESTADO, OBSERV, TIPO_CAM, MONEDA, DESC1, DESC2, DESC3, DESC4, DESC5, DATOS, ENFAC, VENTAREF, CIERRE, cierretienda, DESGLOSE, USUARIO, USUFECHA, " //18
            queryString += " USUHORA, AUTO, Relacion, PEDCLI, DATEMB, AplicarDes, TipoVenta, Exportado, SUCURSAL, VentaSuc, Pago1, Pago2, Concepto1, Concepto2, Pago3, Concepto3, " //16
            queryString += " VentaOrigen, Diario, Caja, OrigenDev, Corte, Impreso, BANCO, NumeroCheque, estacion ,Ticket, importar, sucremota, ventaremota, comodin  ) " //14 = 61
            queryString += " VALUES( @ocupado ,@estado , @cadena , @noReferen, @fecha ,@fecha ,@cliente ,@vend ,@importe ,@descuento ,@impuesto ,@precio ,@costo, "
            queryString += "@almacen ,@estado, @observ , @tipoC, @moneda, @cero, @cero, @cero, @cero, @cero, @nombre, @cero, @cero, @cero, @cero, @cero, @usuario, @fecha,  " //18
            queryString += "@hora, @cero, @mismo, @cadena, @cadena, @cero, @cadena, @cero, @cadena, @cero, @cero, @cero, @cadena, @cadena, @cero, @cadena, "; //16
            queryString += "@cero, @cero, @caja, @cero, @corte, @cadena, @cadena, @cadena, @estacion, @cero, @cero, @local, @cero, @cadena) ";
            db.query(queryString, venta, (err, consec) => {
                if (err) {
                    console.log(err);
                } else {

                    db.query("UPDATE consec set consec =@consec  where dato = @dato" ,{consec:[TYPES.Int, referen], dato:[TYPES.Char, 'ventapendiente']}, (err, orden) => {
                        if (err)
                            res.render("error", { message: "", error: err })
                    });
                    db.query("SELECT VENTA from ventas where TIPO_DOC = @pe and NO_REFEREN = @ref" , {pe: [TYPES.Char, 'PE'], ref:[TYPES.Int, referen]}, (err, cVenta) => {
                        if (err)
                            res.render("error", { message: "", error: err })
                        if (cVenta.length > 0) {
                            var vent = {venta:[TYPES.Int, cVenta[0].VENTA], orden: [TYPES.Int, parseInt(valores[15])], serie:[TYPES.Char, valores[16]]}
                            db.query("UPDATE ordenes set venta = @venta where Orden = @orden AND Serie = @serie " , vent ,  (err, orden) => {
                                if (err)
                                    console.log(err);
                            });
                            var partvta = [cVenta[0].VENTA, 'SOP', 1, 129.31 , 'Revision de Equipo', valores[12], fecha, hora, 1, 1, 129.31, valores[14]];
                            if (partidas.length > 0) {
                                var i = 0;
                                while (i < partidas.length) {
                                    var precio = parseInt(partidas[i][2]) / 1.16;
                                    if (partidas[i][1] != '') {
                                        partvta = [cVenta[0].VENTA, partidas[i][1], partidas[i][3], precio , partidas[i][0], usuario, fecha, hora, 1, 1, precio, estacion]
                                        insertPartvta(partvta);
                                    } else {
                                        var part = [partidas[i][1], partidas[i][0], precio, partidas[i][3], 0, cVenta[0].VENTA]
                                        insertMaterial(part);
                                    }
                                    i = i + 1;
                                }
                            } else {
                                db.query("select * from polizas where cliente = @cliente " , {cliente: [TYPES.Char, valores[0]]}, (err, poliza) => {
                                    if (err)
                                        console.log(err);
                                    insertPartvta(partvta);
                                });
                            }
                        }
                    });
                }
            });
            //});
        }
    }

    app.post('/partida', function (req, res) {
        var venta = (req.body.ventas).trim();
        var articulo = (req.body.articulos).trim();
        var descripcion = (req.body.descripcions).trim();
        var precio = req.body.precios;
        var cantidad = req.body.cantidad;
        var usuario = req.user[0].Usuario;
        var fecha1 = new Date();
        var fecha = newDate(fecha1);
        var hora = (fecha1.getHours()) + ":" + (fecha1.getMinutes())
        var almacen = 1;
        var caja = req.user[0].estacion;
        if (articulo != "") {
            //mysql.open(connstring, function (err, conn) {
            db.query("SELECT articulo from prods where articulo = @prod ", {prod: [TYPES.Char, articulo] } , (err, prod) => {
                if (err)
                    console.log(err)
                if (prod.length > 0) {
                    var valores = [venta, articulo, cantidad, precio, descripcion, usuario, fecha, hora, almacen, cantidad, precio, caja]
                    insertPartvta(valores);
                    res.end('ok');
                }
            })
            //})
        } else  {
            var valores = [articulo, descripcion, precio, cantidad, 0, venta]
            insertMaterial(valores)
            res.end('ok');
        }
    });

    function insertMaterial(valores){
        //mysql.open(connstring, function (err, conn){
        var queryString = "INSERT INTO orderMaterial (Articulo, Descripcion, Precio, Cantidad, ordenId, venta) "
        queryString += " VALUES (@articulo , @descrip, @precio, @cantidad, @id , @venta)"
        var values = {
          articulos: [TYPES.Char, valore[0]],
          descrip: [TYPES.NVarChar, valores[1]],
          precio: [TYPES.Float, valores[2]],
          cantidad: [TYPES.Float, valores[3]],
          id: [TYPES.Int, valores[4]],
          venta: [TYPES.Int, valores[5]]
        }

        db.query(queryString, values,  (err, partida) => {
            if (err)
                console.log(err)
        })
        //})

    }

    function insertPartvta(valores) {
        //mysql.open(connstring, function (err, conn) {
        var queryString = "INSERT INTO PARTVTA (VENTA, ARTICULO, CANTIDAD, PRECIO, COSTO, DESCUENTO, IMPUESTO, OBSERV, USUARIO, UsuHora, usuFecha, ALMACEN, "
        queryString += " LISTA, PRCANTIDAD, estado, precioBase, CAJA, Devolucion, DevConf, Id_Entrada, Invent, importe, kit, costo_u, iespecial, "
        queryString += " puntadas, colores, verificado, donativo, A01 )"
        queryString += " VALUES(@venta, @articulo, @cantidad , @precio , @costo , @descuento, @impuesto, @observ, @usuario,  @hora, @fecha, @almacen, "
        queryString += " @lista, @prcantidad , @estado, @precioBase, @caja, @cero, @cero, @cero, @uno, @precio, @cero, @costo , @cero"
        queryString += ", @cero, @cero, @cero, @cero, @cero) "
        var values = {
          venta: [TYPES.Int, valores[0]],
          articulo: [TYPES.Char, valores[1]],
          cantidad: [TYPES.Float, valores[2]],
          precio: [TYPES.Float, valores[3]],
          costo: [TYPES.Float, 0],
          descuento: [TYPES.Float, 0],
          impuesto: [TYPES.Float, 16],
          observ: [TYPES.NVarChar, valores[4]],
          usuario: [TYPES.Char, valores[5]],
          fecha: [TYPES.Char, valores[6]],
          hora: [TYPES.Char, valores[7]],
          almacen: [TYPES.Int, valores[8]],
          lista: [TYPES.Int, 1],
          prcantidad: [TYPES.Float, valores[9]],
          estado: [TYPES.Char, 'PE'],
          precioBase: [TYPES.Float, valores[10]],
          caja: [TYPES.Char, valores[11]],
          cero: [TYPES.SmallInt, 0],
          uno: [TYPES.SmallInt, 1],
        }


        db.query(queryString, values ,  (err, partidas) =>  {
            if (err) {
                console.log(err);
            } else {
                updateVenta(valores[0]);
            }
        });
        //});
    }
    function updateVenta(venta) {
        //mysql.open(connstring, function (err, conn) {
            var queryString = "select SUM(precio * cantidad) as 'importe' , SUM((precio * cantidad) *( impuesto / 100)) AS 'impuesto' from partvta where venta = @venta"
            db.query(queryString, {venta: [TYPES.Int, venta]},  (err, partvta) => {
                if (err) {
                    console.log(err);
                } else {
                    //mysql.open(connstring, function (err, conn) {
                    var importe = partvta[0].importe
                    var impuesto = partvta[0].impuesto
                    var queryString = "update ventas set importe = @importe , impuesto = @impuesto where venta = @venta"

                    var valores= {importe:[TYPES.Float, importe], impuesto:[TYPES.Float, impuesto], venta: [TYPES.Int, venta]}
                    db.query(queryString, valores ,  (err, partvta) => {
                        if (err) {
                            console.log(err);
                        } else {
                            return true;
                        }
                    });
                    //});
                }
            });
        //});
    }

    app.post('/nuevaOrden', function (req, res) {
        console.log(req.body);
    });

    app.post('/nuevoCliente',isLoggedIn, function (req, res) {
        var c = req.body
        var queryString = '';
        var fecha1 = new Date();
        var fecha = newDate(fecha1);
        var hora = (fecha1.getHours()) + ":" + (fecha1.getMinutes())
        var numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
        var clave = 'C' + '00' + numbers[Math.floor(Math.random() * numbers.length)] + numbers[Math.floor(Math.random() * numbers.length)] + numbers[Math.floor(Math.random() * numbers.length)]
        var datos= {
            clave: [TYPES.Char, c.clave],
            nombre: [TYPES.NVarChar,c.clienteNombre],
            calle: [TYPES.NVarChar, c.calle],
            colonia: [TYPES.Char, c.colonia],
            telefono: [TYPES.Char, c.telefono],
            usuario: [TYPES.Char, req.user[0].Usuario ],
            hora: [TYPES.Char, hora],
            fecha: [TYPES.Char, fecha],
            correo: [TYPES.Char, c.correo],
            pais: [TYPES.Char, 'Mexico']
        }
        //console.log('test')
        //mysql.open(connstring, function (err, conn) {
            db.query("select cliente from clients where cliente = @clave ", {clave: [TYPES.Char, c.clave ]} ,  (err, cliente) => {
                if (err) {
                    console.log(err);
                } else {

                    var query = ''
                    if (cliente.length > 0 && c.clave != '') {
                        query = "UPDATE  clients set nombre = @nombre , calle = @calle, colonia = @colonia,  "
                        query += " telefono = @telefono , correo = @correo  where cliente = @clave"
                        clave = c.clave
                    } else {
                        if (c.clave === '' && c.clienteNombre != '') {

                            query = "INSERT INTO clients ( cliente, nombre, calle, colonia,  pais, telefono,  usuario, usuhora, usufecha, "
                            query += "  correo ) values(@clave, @nombre , @calle, @colonia, @pais, @telefono,  @usuario, @hora, @fecha ,  @correo)"
                           datos['clave'] = [TYPES.Char, clave]
                        }
                    }
                    //mysql.open(connstring, function (err, conn) {
                        db.query(query, datos , (err, cliente) => {
                            if (err) {
                                console.log(err)
                            }

                            res.end(clave)
                        });
                    //});
                }
            });
        //});
        //res.end('');
    });

    function clienteExist(clave){

    }

    function newFecha(dates) {
        var fecha1 = new Date(dates);
        var year = fecha1.getFullYear() + 1;
        var mes = fecha1.getMonth() + 1;
        var dia = fecha1.getDate();
        var dates = dia + '-' + mes + '-' + year;
        return dates
    }

    app.post('/imagen', function (req, res, next) {
        var alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
        var numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
        var valor = alpha[Math.floor(Math.random() * alpha.length)] + numbers[Math.floor(Math.random() * numbers.length)] + alpha[Math.floor(Math.random() * alpha.length)] + numbers[Math.floor(Math.random() * numbers.length)] + alpha[Math.floor(Math.random() * alpha.length)];

        var body = '';
        req.addListener('data', function (data, callback) {

            if (data) {
                body += data;
                base64Data = body.replace(/^data:image\/png;base64,/, ""),
                binaryData = new Buffer(base64Data, 'base64').toString('binary');
                require("fs").writeFile(Limage + valor + ".png", binaryData, "binary", function (err) {
                    //console.log(err); // writes out file without error, but it's not a valid image
                });
            }
            //callback();
        });
        req.addListener('error', function (error) {
            //console.error('got a error', error);
            next(err);
        });
        req.addListener('end', function (data) {
            //console.log('ended');
            //res.end('I have your data, thanks');
        });
        req.addListener('aborted', function () {
            //console.log("client has disconnected");
            //unlink file here
        });
        res.send(valor);

        function getMatches(string, regex, index) {
            index || (index = 1); // default to the first capturing group
            var matches = [];
            var match;
            while (match = regex.exec(string)) {
                matches.push(match[index]);
            }
            return matches;
        }


    });

    function creaHTML(serie, orden, cliente, req){
        console.log('test')
        var imagen = [];
        var user = []
        db.query("select serieWeb from OrdenImagen where OrdenNo = @orden and Serie =@serie" ,{orden:[TYPES.Int, orden], serie: [TYPES.Char, serie]} , (err, img) => {
            if (err)
                console.log(err);
            var i = 0;
            while (i < img.length) {
                imagen.push(img[i]);
                i = i + 1;
            }
        });
        db.query("select Password, Cliente from usuariosWeb where usuario = @cliente and cliente = @uno" ,{cliente:[TYPES.Char, cliente], uno:[TYPES.Int, 1]}, (err, us) => {
            if (err)
                console.log(err);
            var i = 0;
            while (i < us.length) {
                user.push(us[i]);
                i = i + 1;
            }
        });
        db.query("select * from ordenes where serie = @serie and Orden =@orden ", { orden:[TYPES.Int, orden], serie:[TYPES.Char, serie]},(err, Orden) => {
            if (err)
                console.log(err);
                //console.log(Orden);
            if (Orden.length > 0) {
                var queryString = "select ARTICULO, CANTIDAD, OBSERV, ROUND(SUM(PRECIO * (1 + IMPUESTO/100)),2) AS 'PRECIO'  from partvta where venta = @venta GROUP BY ARTICULO, CANTIDAD, OBSERV, PRECIO "
                queryString += " UNION SELECT ARTICULO, cantidad, descripcion as 'OBSERV', ROUND(SUM(PRECIO * (1.16)),2) AS 'PRECIO' FROM orderMaterial where venta = @venta GROUP BY ARTICULO,  CANTIDAD, DESCRIPCION, PRECIO"
                db.query(queryString , {venta:[TYPES.Int, Orden[0].VENTA  ]}, (err, partvta) => {
                    if (err)
                        console.log(err);
                    setTimeout(function () {
                        if (Orden[0].TipoEquipo === 'Servicio' || req.user[0].Usuario === 'CLIGEN' || req.user[0].Cliente === 1) {
                            HTMLServicio(Orden[0], partvta, user);
                        } else {
                            fileHtml.HTML(Orden[0], partvta, imagen, user)
                        }
                    }, 400);
                });
            }
        });
    }

    app.get('/ordenFile', function (req, res, next) {

        creaHTML(req.query.serie, req.query.numero, req.query.cliente, req)
        setTimeout(function () {
            res.redirect('/Orden/' + req.query.serie + '-' + req.query.numero + '.html')
        }, 1000)

    });

    app.get('/reporteSistemas', function (req, res, next) {
      var vend = req.query.vend;
      if (req.query.fecha) {
          var fecha = new Date(req.query.fecha)
      } else {
          var fecha = new Date()
      }
      var hoy = newDate(fecha);
      var user = req.user[0];
        db.query("select * from soportesistemas where Atendio = @vend AND fechatrabajo = @fecha " , {vend: [TYPES.Char, vend], fecha:[TYPES.Char, hoy]}, (err, servicios) => {
            if (err)
              console.log(err);
            res.render('reportesis', {s:servicios, u: user, f : fecha});
          });
        //reporteHTML(req.query.vend, req)
        //setTimeout(function () {
        //    res.redirect('/reporte/sis-' + req.query.vend + '.html')
        //}, 800)
    });
    app.get('/delete', function (req, res) {

        //mysql.open(connstring, function (err, conn) {
        var values = {serie:[TYPES.Char, req.query.serie], orden:[TYPES.Int, req.query.numero], cliente:[TYPES.Char, req.query.cliente]}
        db.query("select * from ordenes where serie = @serie and orden = @orden and cliente = @cliente" , values  , (err, orden) => {
            if (err)
                console.log(err);
            if (orden.length > 0) {
                db.query("update ordenes set estatus = @est where id = @id ", {est:[TYPES.Char, 'Cancelada'], id:[TYPES.Int,orden[0].id ]} , (err, nomb) =>{
                    if (err)
                        console.log(err);
                    creaHTML(req.query.serie, req.query.numero, req.query.cliente, req)
                });
                var pendientes = {estado:[TYPES.Char, 'CO'], id:[TYPES.Int, orden[0].ID_pendiente ]}
                db.query("update pendient set estado = @estado where id = @id ", pendientes ,  (err, nomb) => {
                    if (err)
                        console.log(err);
                });
                var ventas = {ocupado:[TYPES.Int, 1], venta:[TYPES.Int, orden[0].VENTA]}
                db.query("update ventas set ocupado = @ocupado where venta = @venta ", ventas , (err, nomb) => {
                    if (err)
                        console.log(err);
                });

                setTimeout(function () {
                    res.redirect('/Orden/' + req.query.serie + '-' + req.query.numero + '.html')
                }, 800)
            }

        });
        //});


    });

    app.get('/service/ordenFile', function (req, res, next) {

        creaHTML(req.query.serie, req.query.numero, req.query.cliente, req)
        setTimeout(function () {
            res.redirect('/Orden/' + req.query.serie + '-' + req.query.numero + '.html')
        }, 800)

    })



    function HTMLServicio(valores, partidas, user) {
        var respues = [];
        var nombre = [];
        //mysql.open(connstring, function (err, conn) {
        db.query("select nombre from usuariosWeb where usuario = @usuario ", {usuario:[TYPES.Char, valores.Asignado]} ,(err, nomb) => {
            if (err)
                 console.log(err);
            if (nomb.length > 0) {
                nombre.push(nomb[0]);
            }
        });
        //});

        //mysql.open(connstring, function (err, conn) {
        var qString = " select id, pendiente, observ, fecha, hora from pendient where id = @id  UNION "
            qString += "  select id, respuesta as 'pendiente',observ, fecha, hora from respues where idPendiente = @id order by fecha, id "
            db.query(qString, {id:[TYPES.Int, valores.ID_pendiente ]} ,  (err, pendient) => {
            if (err)
                console.log(err);
            var i = 0;
            while (i < pendient.length) {
                respues.push(pendient[i]);
                i = i + 1;
            }

        });
        //});

        setTimeout(function () {

            var cHtml = "<!DOCTYPE html><!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/html4/strict.dtd'>"
            cHtml += "<html  >"
            cHtml += "<meta http-equiv='Content-Type' content='text/html; charset=utf-8'/>"
            cHtml += "<link href='Styles/StyleSheet.css' rel='stylesheet' />"
            cHtml += "<head>"
            cHtml += "<title>Orden " + valores.Serie + '-' + valores.Orden + "</title>"

            cHtml += "</head>"
            cHtml += "<body onLoad='setTimeout(window.print(), 1000)' >"
            cHtml += "<div class='encabezado'>"
            cHtml += "<div id='container'> <img  src='Imagenes/Logo1.jpg' /></div>"
            cHtml += "<div id='Empresa'>"
            //cHtml += "<section class=' EmpNombre '>Grupo cf / Comunicacion sin Fronteras</section>"

            if (valores.Serie === 'CON') {
                cHtml += "<div class='EmpDir section'>"
                cHtml += "Avenida Constitución 127, Centro, 76650,<br /> Ezequiel Montes, Qro.<br />"
                cHtml += "Tels: (441)-277 2763 o 277 0923 </p> </div>"
                cHtml += "<div class=' EmpDir  Dos'>"
                cHtml += "ventascorp@grupocf.com.mx<br />"
                cHtml += "www.grupocf.com.mx</div>"
            } else if (valores.Serie === 'CN' || valores.Serie === 'MAT' || valores.Serie === 'R' || valores.Serie === 'PRU') {
                cHtml += "<div class='EmpDir section'>"
                cHtml += "Avenida Constitución 171, Centro, 76650,<br /> Ezequiel Montes, Qro.<br />"
                cHtml += "Tels: (441)-277 2763 o 277 0923 </p> </div>"
                cHtml += "<div class=' EmpDir  Dos'>"
                cHtml += "ventascorp@grupocf.com.mx<br />"
                cHtml += "www.grupocf.com.mx</div>"
            }
            cHtml += "</div>"
            cHtml += "</div>"
            cHtml += "<div class='Contenedor' style='height:700px!important'>"
            cHtml += "<div><img src='Imagenes/icon-ios7-people-outline.svg' class='img1' /> </div>"
            cHtml += "<strong>Datos de Contacto:</strong>"
            cHtml += "<div class='DatosCliente'>"
            cHtml += "<div class='section Fila'>Nombre:<strong> " + valores.ClienteNom + "</strong></div>"
            cHtml += "<div class='section'>Reportado Por: <strong> " + valores.Contacto + "</strong></div>"
            cHtml += "<div class='section'>Tel:<strong> " + valores.ClienteTel + "</strong></div> "
            cHtml += "<div class='section Fila'>Dir : " + valores.ClienteDir + "</div>"
            cHtml += "</div>"
            cHtml += "<div><img src='Imagenes/icon-ios7-gear-outline.svg'  id='Tittleimg'/></div><strong>Descripcion del Servicio</strong>"
            cHtml += "<div class='Servicio'><div class='section'><strong>Servicio</strong></div>"
            cHtml += "<div class='section'>Tipo de Servicio: </div>"
            cHtml += "<div class='section'>" + valores.ServOtro + " </div>"
            cHtml += " <div class='Problema'>Descripcion del problema:  " + valores.Pro_Observ + "</div>"
            cHtml += "</div>"

            cHtml += "<div class='Fila'><img src='Imagenes/icon-ios7-cart-outline.svg'  class='img1'/></div><strong>Lista de Materiales y/o servicios </strong>"
            cHtml += "<div class='Refacciones'>"
            var i = 0;
            var total = 0;
            while (i < partidas.length) {
                cHtml += "<div class='Partida'>"
                cHtml += "<div class='section'><input type='checkbox' id='Checkbox2' checked='checked' /><label for='Chechbox2'><span ><img src='Imagenes/icon-uncheck.png' style='width:16px;'/></span></label></div>"
                cHtml += " <div class='Cantidad section'>" + partidas[i].CANTIDAD + "</div>"
                cHtml += "<div class='section' style='width:90px!important;'>" + partidas[i].ARTICULO + "</div>"

                cHtml += " <div class='Observ section' style='width:45%!important'>" + partidas[i].OBSERV + "</div>"
                cHtml += " <div class='Precio section'>" + (partidas[i].PRECIO).toFixed(2) + "</div>"
                cHtml += "</div>"
                total = total + partidas[i].PRECIO;
                i = i + 1;
            }
            cHtml += "</div>"
            cHtml += "<div class='total'>$ " + total.toFixed(2) + " </div>"
            cHtml += "</div></div>"
            cHtml += "<div class='Datos'>"
            cHtml += "<div class='section Fila'>Fecha: " + dateformat(valores.Fecha_ing) + "</div>"
            cHtml += "<div id='NoOrden'>"
            cHtml += "<div class='Numero'> Orden:<strong> " + valores.Serie + '-' + valores.Orden + "</strong> </div>"
            cHtml += "<div class='Estatus'>Estatus: " + valores.Estatus + "</div>"
            cHtml += "</div>"
            cHtml += "<div class='section Fila'>Atendido Por:</div>"
            cHtml += "<div class='section Fila'><strong>" + valores.VendNom + "</strong></div> <br /><br />"
            cHtml += "<div class='section Fila'><strong>Venta:" + valores.VENTA + "</strong></div> <br /><br />"
            // Historial
            cHtml += "<div class='section' style='margin-top:15px;'> Reporte tecnico </div>"
            cHtml += "<div class='container'>"
            var i = 0;
            //console.log(respues)
            //console.log(nombre)
            while (i < respues.length) {
                cHtml += "<div class='section evento'><div class='section espacio'> <strong> " + (respues[i].pendiente).toUpperCase() + "</strong></div >"

                if ((respues[i].pendiente).toLowerCase() === "asignar" && nombre.length > 0)
                    cHtml += "<div class='section espacion'> A: " + nombre[0].nombre + "</div >"

                cHtml += "<div class='section espacio Fila' style='margin-bottom:4px;'>Observaciones: " + respues[i].observ + "</div >"
                cHtml += "<div class='section fecha' style='font-size:0.8em;'>" + dateformat(respues[i].fecha) + " a las :    " + respues[i].hora + "</div >"
                cHtml += "</div >"

                i = i + 1;
            }


            cHtml += "</div>"
            // Historial
            cHtml += "</div>"
            cHtml += "<footer>"
            cHtml += "<table>"
            cHtml += "<th>INGENIERIA DE SERVICIO<br />Nombre y firma</th>"
            cHtml += "<th>Cliente Recibe de conformidad<br /> Nombre y Firma</th></tr>"
            if (nombre.length > 0) {
                cHtml += "<th class='auto-style1'><p>" + nombre[0].nombre + "</p></th>"
            } else {
                cHtml += "<th class='auto-style1'><p>" + valores.VendNom + "</p></th>"
            }

            cHtml += "<th class='auto-style1'><p>" + valores.Contacto + "</p> </th>"
            cHtml += "</table></footer> "
            cHtml += "</div>"
            cHtml += "</body>"

            cHtml += "</html>"
            cHtml = cHtml.replace("Ñ", "&Ntilde")
            cHtml = cHtml.replace("ñ", "&ntilde")
            cHtml = cHtml.replace("Á", "&Aacute")
            cHtml = cHtml.replace("É", "&Eacute")
            cHtml = cHtml.replace("Í", "&Iacute")
            cHtml = cHtml.replace("Ó", "&Oacute")
            cHtml = cHtml.replace("Ú", "&Uacute")
            cHtml = cHtml.replace("á", "&aacute")
            cHtml = cHtml.replace("é", "&eacute")
            cHtml = cHtml.replace("í", "&iacute")
            cHtml = cHtml.replace("ó", "&oacute")
            cHtml = cHtml.replace("ú", "&uacute")
            cHtml = cHtml.replace(".svg", ".png")


            require("fs").writeFile(htmlFile + valores.Serie + '-' + valores.Orden + ".html", cHtml, "utf8", function (err) {
                console.log(err); // writes out file without error, but it's not a valid image
            });
            console.log('crea HTML bien')

        }, 600);

    }

    function newDate(fecha1){
        var year = fecha1.getFullYear();
        var mes = fecha1.getMonth() + 1;
        //var mes = fecha1.getMonth();
        var dia = fecha1.getDate();
        //var fecha = new Date(Date.UTC(year, mes, dia));
        var fecha = mes + '-' + dia + '-' + year;
        return fecha
    }

    function newDates(fecha1) {
        var year = fecha1.getFullYear();
        var mes = fecha1.getMonth() + 1;
        //var mes = fecha1.getMonth();
        var dia = fecha1.getDate() + 1;
        //var fecha = new Date(Date.UTC(year, mes, dia));
        var fecha = mes + '-' + dia + '-' + year;
        return fecha
    }

    function dateformat(fecha){
        var date = new Date(Date.parse(fecha));
        var monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
            'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ]
        var dia = date.getUTCDate();
        var mes = monthNames[date.getMonth()];
        var year = date.getFullYear();
        var fecha = dia + '  ' + mes + '  ' + year;
        return fecha
    }
};

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}
