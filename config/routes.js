// app/routes.js

var dbconfig = require('./config');

var connstring = dbconfig.localDB;
var Drive = dbconfig.DriveN;
var bcrypt = require('bcrypt-nodejs');
var sendE = require('./sendEmail.js');
var logs = require('./logs.js')

var connectionString = dbconfig.SQL_CONN;
const friendly = require('tedious-friendly');
const TYPES = friendly.tedious.TYPES;
const connectionConfig = { options: { useUTC: true } };
const poolConfig = { min: 2, max: 4, log: false };

// create connection pool
const db = friendly.create({ connectionString, connectionConfig, poolConfig });

var qr = require('qr-image');
var fs = require('fs')
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
    // =====================================
		app.get('/qrcode', function(req, res) {
			//res.render('index', { title: 'APPCF' }); // load the index.ejs file
				//https://blog.nodejitsu.com/npmawesome-qr-codes/
				console.log(req.query)
				var code = qr.image('https://grupocfapp.com/equipo?code=' + req.query.code, { type: 'png' });
				var output = fs.createWriteStream('C:/grupocfapp/public/Polizas/' +req.query.code + '.png')

				code.pipe(output);
				res.end('og')
	   });

		 app.get('/equipo', function(req, res) {
 			//res.render('index', { title: 'APPCF' }); // load the index.ejs file
 				//https://blog.nodejitsu.com/npmawesome-qr-codes/
 				console.log(req.query.code.toUpperCase());
				if (req.query.code){

					db.query("select * from Equipos where CodigoBarras = @codigo",{codigo:[TYPES.NVarChar, req.query.code.toUpperCase().trim()]}, (err, equipo) => {
						if (err){
							console.log(error)
						} else {
							db.query("Select polizas.cliente, polizas.FechaInicio, polizas.FechaVencimiento, clients.nombre from polizas inner join clients on polizas.cliente = clients.cliente where polizas.id = @codigo and polizas.estatus = @estatus",{codigo:[TYPES.Int, equipo[0].IdPoliza], estatus: [TYPES.NVarChar, 'Activa' ]}, (err, poliza) => {
								if (err){
									console.log(err)
								} else {
									console.log(equipo);
									res.render('equipoPoliza', {'equipo': equipo[0], 'poliza' : poliza[0]})
								}
							});
						}
					});
				} else {
					res.render('error')
				}

 	   });

	app.get('/', function(req, res) {
		//res.render('index', { title: 'APPCF' }); // load the index.ejs file
        res.redirect('/login');
    });
    app.get('/Orden',orden, function (req, res) {
        //res.render('Orden');

    });

    app.get('/empleados', empleados, function (req, res) {
        //res.render('Orden');
    });

    app.get('/nuevaOrden', function (req, res) {
        var usuario = req.user[0];
        var tecnicos = [];
        var equipos = [];
        db.query("select * from tipoEquipo ", (err, equi) => {
            if (err)
                console.log(err);
            var i = 0;
            while (i < equi.length) {
                equipos.push(equi[i]);
                i = i + 1;
            }
        });
        var tecnico = (function () {
            db.query("select USUARIO from usuarios ", (err, tecni) => {
                if (err)
                    console.log(err);
                var i = 0;
                while (i  < tecni.length) {
                    tecnicos.push(tecni[i]);
                    i = i + 1;
                }
                return tecni;

            });
        })(tecnicos);
        var user = { Equipo: [TYPES.Char, req.user[0].Equipos]}
        Consulta = "select * FROM CONSEC WHERE DATO = @Equipo " ;

        setTimeout(function () {
            db.query(Consulta ,user, (err, consec) => {
                if (err)
                    return console.log(err);
                res.render('equipoNuevo', { 'user': usuario , 'next' : consec[0], 'empleado' : tecnicos, 'equipos': equipos });
            });
        }, 200);


    });

    app.get('/nuevoServicio', function (req, res) {
        var usuario = req.user[0];
        var tecnicos = [];

        db.query("select USUARIO from usuarios where  (area = @soporte or area = @sistemas)", {cliente:[TYPES.SmallInt, 0], soporte:[TYPES.Char, 'Soporte'], sistemas:[TYPES.Char, 'Sistemas']} , (err, tecni) =>  {
            if (err)
                console.log(err);

            if (tecni.length > 0) {
            	Consulta = "select DESCRIP FROM tipopend where descrip <> @gen";
							db.query(Consulta, {gen:[TYPES.Char, 'SYS']}, (err, pendiente) => {
									if (err)
											return console.log(err);
									res.render('servicioNuevo', { 'user': usuario , 'servicio' : pendiente, 'empleado' : tecni });
							});
            }
          });
    });

    app.get('/ordenTable', function (req, res) {
        console.log(req.body);
        res.render('Ordenes');

    });

    app.get('/TonerTable', function (req, res) {
        console.log(req.body);
        res.render('toners');

    });


 
    app.get('/ClientesTable', function (req, res) {
        //console.log(req.body);
        res.render('Clientes');

    });

    app.get("/SistemasTable", function (req, res){
      res.render('servicioSistemas')
    })

    app.get('/usersTable', function (req, res) {
        //console.log(req.body);
        res.render('usuariosTable');

    });


    app.get('/uclientsTable', function (req, res) {
        //console.log(req.body);
        res.render('UclienteTable');

    });

    app.get('/ArticuloTable', function (req, res) {
        console.log(req.body);
        res.render('articulos');
    });


    app.get('/respuesta', function (req, res) {
        var vista = req.query.respuesta;
        var venta = req.query.venta;
        if (venta < 1) {
            venta = 0;
        }
        console.log(vista)
        if (vista === 'reparacion') {
                db.query("SELECT PARTVTA.VENTA AS 'VENTA', VENTAS.ESTADO AS 'ESTADO', PARTVTA.ARTICULO AS 'ARTICULO',PARTVTA.ID_SALIDA AS 'ID_SALIDA', PARTVTA.CANTIDAD AS 'CANTIDAD', PARTVTA.PRECIO AS 'PRECIO' ,PARTVTA.OBSERV AS 'OBSERV' " +
                           " , VENTAS.IMPORTE  AS 'IMPORTE', VENTAS.IMPUESTO AS 'IMPUESTO' from PARTVTA INNER JOIN VENTAS ON PARTVTA.VENTA = VENTAS.VENTA WHERE PARTVTA.VENTA = @ven" , {ven :[TYPES.Int, venta]} ,  (err, partidas) => {
                    if (err)
                        console.log(err);
                    console.log(partidas)
                    res.render(vista, { 'partidas': partidas });
                });
        } else if (vista === 'materiales') {
                var qString = "SELECT PARTVTA.VENTA AS 'VENTA', VENTAS.ESTADO AS 'ESTADO', PARTVTA.ARTICULO AS 'ARTICULO',PARTVTA.ID_SALIDA AS 'ID_SALIDA', PARTVTA.CANTIDAD AS 'CANTIDAD', PARTVTA.PRECIO AS 'PRECIO' ,PARTVTA.OBSERV AS 'OBSERV' "
                    qString +=    " , VENTAS.IMPORTE  AS 'IMPORTE', VENTAS.IMPUESTO AS 'IMPUESTO' from PARTVTA INNER JOIN VENTAS ON PARTVTA.VENTA = VENTAS.VENTA WHERE PARTVTA.VENTA = @ven "
                qString += "UNION SELECT ventas.venta as 'VENTA', ventas.ESTADO as 'ESTADO', orderMaterial.articulo as 'ARTICULO', orderMaterial.ID AS 'ID_SALIDA', orderMaterial.cantidad as 'CANTIDAD', orderMaterial.PRECIO AS 'PRECIO', orderMaterial.Descripcion as 'OBSERV' "
                qString += ", ventas.IMPORTE AS 'IMPORTE', VENTAS.IMPUESTO AS 'IMPUESTO'  from orderMaterial inner join ventas on orderMaterial.VENTA = ventas.VENTA where orderMaterial.VENTA = @ven"

                db.query(qString , {ven:[TYPES.Int, venta]} , (err, partidas) => {
                    if (err)
                        console.log(err);
                    res.render(vista, { 'partidas': partidas });
                });

        } else if (vista === 'reagendar'){
            res.send('')
				} else if (vista === 'asignarExt'){
	          res.render('asignar');
        } else {
            res.render(vista);
        }
    });

    app.get('/tables/ordenes', function (req, res) {
        var values = {
            usuario: [TYPES.Char, req.user[0].Usuario],
            cancel : [TYPES.Char, 'Cancelada'],
            estatus : [TYPES.Char, 'Recepcion']
        }
        if (req.user[0].admon === 0) {
          if (req.user[0].Cliente === 1){
            Consulta = "select id, Serie, Orden, estatus, ClienteNom, TipoEquipo, Registro, Pro_Observ as 'problem' from ordenes where  estatus <> @cancel AND ( Cliente =@usuario ) Order by id desc";
					} else if (req.user[0].proveedor === 1) {
						Consulta = "select id, Serie, Orden, estatus, ClienteNom, TipoEquipo, Registro, Pro_Observ as 'problem' from ordenes where  estatus <> @cancel AND ( asignadoEx =@usuario ) Order by id desc";
          } else {
            Consulta = "select id, Serie, Orden, estatus, ClienteNom, TipoEquipo, Registro, Pro_Observ as 'problem' from ordenes where  estatus <> @cancel AND (Asignado = @usuario  OR Cliente = @usuario or estatus = @estatus ) Order by id desc";
          }
        } else {
              Consulta = "select id, Serie, Orden, estatus, ClienteNom, TipoEquipo, Registro, Pro_Observ as 'problem' from ordenes where estatus <> @cancel Order by id desc";
        }
         db.query(Consulta, values, (err, orden) => {
            if (err) {
                console.error(err);
            }
            res.send(orden);
         });
    });

    app.get('/tables/toners', function (req, res) {
        var user = (req.user[0].Usuario).trim()
        if ( user === "JAIRO") {
            Consulta = "select ordenRemanufactura as 'id', Suc, Modelo, Proceso, Cliente, Estatus, Descripcion from remanufacturatoner where  estatus = @estatus  Order by ordenremanufactura desc";
        } else {
            Consulta = "select ordenRemanufactura as 'id', Suc, Modelo, Proceso, Cliente, Estatus, Descripcion from remanufacturatoner  Order by ordenRemanufactura desc";
        }
        //mysql.open(connstring, function (err, conn) {
            db.query(Consulta, {estatus: [TYPES.Char, 'ENVIADO']},  (err, toner) => {
                if (err)
                    //return done(err);
                    console.log(err);
                res.send(toner);
            });
        //});
    });

    app.get('/tables/Clientes', function (req, res) {

        Consulta = "select CLIENTE, NOMBRE, TELEFONO, RFC, CORREO FROM CLIENTS";

        //mysql.open(connstring, function (err, conn) {
            db.query(Consulta,  (err, cliente) => {
                if (err)
                    return done(err);
                // console.log(orden);
                res.send(cliente);
            });
        //});

    });

    app.get('/tables/Sistemas', function (req, res) {
        Consulta = "select id, Cliente , clienteNr as 'Reporto', usuario as 'Atendio', soporte as 'TipoServicio',  comentarios as 'Sdescripcion' FROM php order by id desc ";
        db.query(Consulta,  (err, sistemas) =>  {
            if (err)
                return done(err);
            // console.log(orden);
            res.send(sistemas);
        });
    });


    app.get('/tables/usuarios', function (req, res) {

        Consulta = "select Usuario, email, telefono, Nombre FROM usuariosWeb where cliente <> 1 AND Usuario <> 'CLIGEN' ";
        db.query(Consulta, (err, cliente) => {
            if (err)
                return done(err);
            // console.log(orden);
            res.send(cliente);
        });
    });

    app.get('/tables/uClientes', function (req, res) {

        Consulta = "select Usuario, password, email, telefono, Nombre FROM usuariosWeb where cliente = @cliente";

        db.query(Consulta, {cliente:[TYPES.SmallInt, 1]}, (err, cliente) => {
            if (err)
                return done(err);
            // console.log(orden);
            res.send(cliente);
        });
    });

    app.get('/tables/Articulos', function (req, res) {

        Consulta = "select ARTICULO, DESCRIP AS 'DESCRIPCION', ROUND(EXISTENCIA,2) AS 'EXISTENCIA' , ROUND(COSTO_U, 2) AS 'COSTOU',  ROUND( SUM(PRECIO1 * 1.16), 2) AS 'PRECIO1', ROUND( SUM(PRECIO2 * 1.16), 2) AS 'PRECIO2' " +
                    " , ROUND(SUM(PRECIO3 * 1.16), 2) AS 'PRECIO3' FROM PRODS WHERE BLOQUEADO = @bloqueado GROUP BY PRODS.ARTICULO, PRODS.DESCRIP, PRODS.EXISTENCIA, PRODS.COSTO_U, PRODS.PRECIO1, PRODS.PRECIO2, PRODS.PRECIO3 ";
        db.query(Consulta, {bloqueado: [TYPES.SmallInt, 0]} , (err, Articulo) => {
            if (err)
                console.log(err);
            res.send(Articulo);
        });
    });

    app.get('/tables/prods', function (req, res) {
        if (req.user[0].admon === 0) {
            Consulta = "select ARTICULO, DESCRIP, PRECIO1 FROM PRODS";
        } else {
            Consulta = "select ARTICULO, DESCRIP, PRECIO1 FROM PRODS";
        }
        db.query(Consulta, (err, prods) => {
            if (err)
                console.log(err);
            res.send(prods);
        });
    });

    app.get('/prods', function (req, res) {

        var like = '%' + (req.query.filtro).replace(' ', '%' ) + '%';
        if (req.query.filtro != "")
            db.query("select top 10 ARTICULO, DESCRIP, PRECIO1  from prods where ARTICULO LIKE @busca OR DESCRIP LIKE @busca " , {busca:[TYPES.Char, like]} ,  (err, prods) => {
                if (err)
                    console.log(err);
                res.render('prods', { 'prods' : prods });
            });
    });

    app.get('/users',isLoggedIn,  function (req, res){
        var like = '%' + (req.query.filtro).replace(' ' , '%') + '%';

        if (req.query.filtro != "")
            db.query("select top 5 id, Usuario, email, admon, telefono, Servicios, Equipos, Nombre, Vend, estacion from usuariosWeb where usuario  LIKE @busca ", {busca:[TYPES.Char, like]}, function (err, user){
                if (err)
                    console.log(err)
                res.send('')
                //res.render('users', {'user': user })
            })
    })

    app.get('/cliente', function (req, res) {
        var like = '%' + (req.query.filtro).replace(' ', '%') + '%';
        if (req.query.filtro != "")

            db.query("select top 8 Cliente, Nombre, rfc, calle, colonia , telefono, numerointerior, numeroexterior, pobla , localidad, correo  from clients where cliente LIKE @busca OR nombre LIKE @busca " , {busca:[TYPES.Char, like]} ,  (err, cliente) => {
                if (err)
                    console.log(err);
                //console.log(cliente)
                res.render('cliente', { 'cliente' : cliente });
            });
    });

    app.get('/Agenda', function (req, res){
        var usuario = req.user[0]
        var values = { usuario:[TYPES.NVarChar, 'MOST2'], cliente:[TYPES.SmallInt, 0], most:[TYPES.NVarChar, 'MOST1'] }
            db.query("select USUARIO FROM usuariosWeb where usuario <> @most AND usuario <> @usuario and cliente = @cliente ",values, (err, tecnico) => {
                if (err)
                    console.log(err);
                res.render('Agenda', { 'tecnico' : tecnico , 'user' : usuario});
            });
    })

    app.get('/agendaPend', function (req, res) {
        var admon = req.user[0].admon;
        var user = req.user[0].Usuario;
        var pen = {};
        pen.success = 1;
        pen.result = [];
        var consulta = '';
        if (admon === 1) {
            if (req.query.asig === 'todos') {
                consulta = "select id, orden, serie,Pro_Observ as 'OBSERV', DATEADD(second, 30, Fecha_ing) as 'FECHA', UsuHora_ing as 'HORA', Estatus FROM  ordenes where Estatus <> @estatus"
            } else {
                consulta = "select id, orden, serie,Pro_Observ as 'OBSERV', DATEADD(second, 30, Fecha_ing) as 'FECHA', UsuHora_ing as 'HORA', Estatus FROM  ordenes where Estatus <> @estatus and asignado = @asignado";
            }
        } else {
            consulta = "select id, orden, serie,Pro_Observ as 'OBSERV', DATEADD(second, 30, Fecha_ing) as 'FECHA', UsuHora_ing as 'HORA', Estatus FROM  ordenes where Estatus <> @estatus and Asignado = @asignado"
        }

            db.query(consulta ,{estatus:[TYPES.Char, 'Cancelada'], asignado:[TYPES.Char, req.query.asig]} ,  (err, pendient) => {
                if (err)
                    console.log(err);
                var i = 0;
                console.log(pendient[0])
                while (i < pendient.length) {
                    var hora = pendient[i].HORA.split(':');
                    var fecha = new Date(pendient[i].FECHA)
                    var dia = fecha.getDate();
                    var mes = fecha.getMonth();
                    var year = fecha.getFullYear();
                    var date = new Date(year, mes, dia + 1, hora[0] , hora[1]);
                    var start = date.getTime();
                    var add = parseInt(hora[0]);
                    var ended = new Date(year, mes, dia + 1, add + 1  , hora[1]);
                    var end = ended.getTime();
                    var p = {};
                    p.id = pendient[i].id;
                    p.title = pendient[i].serie + '-' + pendient[i].orden + ': ' + pendient[i].OBSERV ;
                    p.url = '#';
                    p.class ="event-" + pendient[i].Estatus;
                    p.start = start;
                    p.end = end;
                    p.dataget = 'Orden';
                    p.value = pendient[i].id;
                    p.name = pendient[i].serie + '-' + pendient[i].orden;
                    pen.result.push(p);
                    i = i + 1;
                }
                setTimeout(function () {
                    res.send(pen);
                }, 0);

            });
    });

    // Modificar datos de cliente  (click en boton edit)
    app.get('/client', function (req, res) {
        var like = req.query.filtro
        if (req.query.filtro != "")
            db.query("select * from clients where cliente = @busca " , {busca:[TYPES.Char, like]} ,  (err, cliente) => {
                if (err)
                    console.log(err);
                res.render('client', { 'cliente' : cliente });
            });
    });

		app.get('/Producto', function (req, res) {
        var like = req.query.filtro
        if (req.query.filtro != "")
            db.query("select * from prods where articulo = @busca " , {busca:[TYPES.NVarChar, like]} ,  (err, producto) => {
                if (err)
                    console.log(err);
                res.render('Producto', { 'articulo' : producto });
            });
    });

    app.get('/sistemas', function (req, res) {
      res.render('loginSis', { message: req.flash('loginMessage') });
      //res.render('Sistemas');
    });
  app.get('/sistema', function (req, res) {

        if (req.query.fecha){
            var fechas = new Date(req.query.fecha)
        } else {
            var fechas = new Date()
        }
        if (typeof(req.user) == "undefined"){
          res.redirect('/sistemas')
        } else {
            var usuario = req.user[0].Usuario
            var fecha = fechas;
            db.query("select * from soportesistemas where Atendio = @user AND fechatrabajo = @date " , {user: [TYPES.Char, usuario ], date :[TYPES.Char, fecha]} ,  (err, services) => {
                if (err)
                    console.log(err);
                res.render('Sistemas', {mesage: '', user : req.user[0], servicios: services , date : fechas});
            });
      }
    });

  app.get('/credito', function(req, res){
        var cliente = req.query.cliente.trim();
        var fecha = newDate(new Date());
        var disponible = []
        db.query("select * from clients where cliente = @client AND credito > @credito " , {client :[TYPES.Char, cliente], credito:[TYPES.SmallInt, 0]} , (err, client) => {
            if (err)
                console.log(err);
            if (client.length > 0){
                db.query("select Round(SUM(SALDO), 2) as 'Disponible' from cobranza where cliente = @client AND saldo > @saldo  " , {client:[TYPES.Char, cliente], saldo: [TYPES.SmallInt, 0]} , (err, Dis) => {
                    if (err)
                    console.log(err)
                    disponible.push(Dis[0])
                    //console.log(disponible)
                })
                setTimeout(function () {
                db.query("select * from cobranza where cliente = ? AND saldo > 0 and fecha_venc < ? " , {client:[TYPES.Char, cliente], dates:[TYPES.Char, fecha]} , (err, cobranza) => {
                    if (err)
                        console.log(err);
                    console.log(disponible)
                    res.render('credito', {mesage: '', cli : client, cob : cobranza, D: disponible[0]});
                })
                }, 500);
            }
        });
  });

  app.post('/loginSistemas', passport.authenticate('local-login', {
            successRedirect : '/sistema', // redirect to the secure profile section
            failureRedirect : '/Sistemas', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
    }),
        function(req, res) {
            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
    });
	// LOGIN ===============================
	// show the login form
	app.get('/login', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('login', { message: req.flash('loginMessage') });
	});
	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/Inicio', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });
    app.post('/loginClien', passport.authenticate('local-login', {
        successRedirect : '/service', // redirect to the secure profile section
        failureRedirect : '/servicio', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }),
        function (req, res) {

        if (req.body.remember) {
            req.session.cookie.maxAge = 1000 * 60 * 3;
        } else {
            req.session.cookie.expires = false;
        }
        res.redirect('/');
    });

    app.get('/service', isLoggedIn , function (req, res) {
        var orden = req.flash('ordenId');
        //console.log(orden);
        if (orden) {
            var Consulta = "select * FROM ordenes where id = @id"
            //mysql.open(connstring, function (err, conn) {
                db.query(Consulta,{ id :[TYPES.Int, orden[0]]}, function (err, ordens) {
                    if (err)
                        console.log(err);
                    if (ordens[0].ID_pendiente > 0) {
                        db.query("select ID, PENDIENTE, OBSERV, HoraR, DATEADD(second, 30, FechaR) as  'FechaR' from pendient where id =@id ",{id:[TYPES.Int, ordens[0].ID_pendiente]}, (err, pendient) => {
                            if (err)
                                console.log(err);
                            db.query("select Id, IdPendiente, Respuesta, Observ,  FechaT, HoraT  from respues where IdPendiente =@idp and Respuesta <> @respues order by id",{idp:[TYPES.Int, pendient[0].ID], respues:[TYPES.Char, 'Reporte']}, (err, respues) => {
                                if (err)
                                    console.log(err);
                                //console.log(respues);
                                res.render('inicioCliente', { 'orden' : ordens[0], 'pendiente': pendient[0], 'respuesta': respues });
                            });

                        });
                    } else {
                        res.render('inicioCliente', { 'orden' : ordens[0] });
                    }
                });
            //});
        } else {
            res.render('inicioCliente')
        }


    });




	// SIGNUP =============================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('Registrar', { message: req.flash('signupMessage') });
	});
	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
    app.get('/Inicio', isLoggedIn, ordeness , function (req, res) {

        ordeness(req.user[0].Usuario);

    });
    app.get('/pendienteT', isLoggedIn, pendientes , function (req, res) {
       // ordeness(req.user[0].Usuario);

    });

    app.get('/images', isLoggedIn, imagenes , function (req, res) {
       //ordeness(req.user[0].Usuario);
    });
    app.get('/Seguimi', isLoggedIn, seguimiento, function (req, res) {
    });

    app.get('/Camera', isLoggedIn, function(req, res){

      Consulta = "select id, ID_pendiente, venta, tipoEquipo FROM ordenes where id = @id";
      //mysql.open(connstring, function (err, conn) {
          db.query(Consulta, {id:[TYPES.Int, req.query.id]} , (err, orden1) => {
              if (err)
                  console.log(err);

              res.render('camera', { 'orden' : orden1[0] });
          });
      //});

    });


    function imagenes(req, res, next) {
        var user = req.user[0].Usuario;
        Consulta = "select * FROM ordenImagen where OrdenNo = @orden AND serie = @serie ";
        db.query(Consulta, {orden:[TYPES.Int, req.query.numero], serie:[TYPES.Char, req.query.serie]} , (err, imagen) => {
            if (err)
                console.log(err);

            var id = req.query.serie + req.query.numero;
            if (user.trim() === "CLIGEN") {
                console.log('cliente')
                res.render('imagesClient', { 'imagen' : imagen , 'drive' : Drive });
            } else {
                if (req.user[0].proveedor === 1){
                    res.render('imagesProv', { 'imagen' : imagen , 'drive' : Drive, ide: id });
                } else {
                    res.render('images', { 'imagen' : imagen , 'drive' : Drive, ide: id });
                }
            }
        });
    };


    app.get('/pdftest', function (req, res) {
        var fs = require('fs');
        var pdf = require('html-pdf');
        var html = fs.readFileSync('../login/public/service/CON-967.html', 'utf8')
        var options = {
            format: 'Letter',
            'border': {
                'top': '1in',
                'right': '1in',
                'bottom': '1in',
                'left': '1in'
            }
        };
        pdf.create(html, options).toFile('../login/public/service/CON-967.pdf', function (err, resp) {
            if (err)
                console.log(err);
            console.log(resp.filename)
            res.send(resp);
        });
    });

    function seguimiento(req, res, next) {
			var admon = req.user[0].admon
        Consulta = "select id, ID_pendiente, venta, tipoEquipo FROM ordenes where id = @id" ;
        db.query(Consulta, {id:[TYPES.Int, req.query.id]},function (err, orden1) {
            if (err)
                console.log(err);
            if (req.user[0].Cliente === 1 || req.user[0].proveedor === 1){
                    res.render('comentarios', { 'orden' : orden1[0] });
            } else {
                if (orden1[0].tipoEquipo === 'Servicio') {
                    res.render('eventosServicio', { 'orden' : orden1[0] });
                } else {
                    res.render('eventos', { 'orden' : orden1[0] , 'admon': admon});
                }
            }
        });
    } ;

    app.get('/Usuario', function (req, res) {
        db.query("select * from usuariosWeb where usuario = @usuario ", {usuario:[TYPES.Char, req.query.clave]} , (err, user) => {
            if (err)
                console.log(err);
            res.render('updateUser', { 'user' : user[0] });
        });
    });
  

    app.get('/servicio', function (req, res) {
        //console.log(req.)

        Consulta = "select Cliente, ClienteNom from ordenes where cliente = @cliente"
        //mysql.open(connstring, function (err, conn) {
            db.query(Consulta, { cliente:[TYPES.Char , 'CLIGEN']  } , function (err, cliente) {
                if (err)
                    console.log(err);

                if (cliente.length > 0) {
                    console.log(cliente[0]);
                    //res.send('ok')
                    res.render('loginCliente', { orden : cliente[0], message: req.flash('loginMessage') });
                } else {
                    res.render('loginCliente', { message: req.flash('loginMessage') });
                }
            });
        //});
    });
    
    app.get('/ServicioSis', function(req, res){
        var value = { id:[TYPES.Int, req.query.clave]}

        db.query("select * from php inner join clients on php.cliente  = clients.cliente where id =@id ", value, (err, services) => {
            
            if (err) {
                console.error(err);
            }
            if (services[0].venta > 0) {
                var ventas = { venta : [TYPES.Int, services[0].venta] }
                db.query("select venta, importe, impuesto, datos, serieDocumento, no_referen, tipo_doc, estado, cliente, datos from ventas where venta  = @venta", ventas, (err, vent) => {
                    console.log(vent)
                    if (err){
                        console.log(err)
                    }
                    res.render('ServicioSis', { 'servicio' : services[0], 'venta': vent[0], 'user': req.user[0] });
                })
            } else {
                res.render('ServicioSis', { 'servicio' : services[0] , 'user': req.user[0]});
            }
         });
    })

    function isEmpty(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    }

    function ordeness(req, res, next) {
        console.log(req.user[0])
        var valores ={
                usuario : [TYPES.NVarChar, req.user[0].Usuario],
                cancel: [TYPES.NVarChar, 'Cancelada'],
                estatus: [TYPES.NVarChar, 'Recepcion']
            }

        if (req.user[0].Cliente === 1) {
          Consulta = "select id, Serie, Orden, estatus, ClienteNom, TipoEquipo, Registro, Pro_Observ, DATEADD(second, 30, Fecha_ing) as  'Fecha_ing' , UsuHora_ing from ordenes where (Cliente = @usuario) AND estatus <> @cancel";
        } else if (req.user[0].proveedor === 1) {
          Consulta = "select id, Serie, Orden, estatus, ClienteNom, TipoEquipo, Registro, Pro_Observ, Fecha_ing , UsuHora_ing from ordenes where asignadoEx = @usuario and estatus <> @cancel";
        } else if (req.user[0].admon === 1){
            Consulta = "select id, Serie, Orden, estatus, ClienteNom, TipoEquipo, Registro, Pro_Observ, DATEADD(second, 30, Fecha_ing) as 'Fecha_ing' , UsuHora_ing from ordenes where estatus <> @cancel";
        } else {
            Consulta = "select id, Serie, Orden, estatus, ClienteNom, TipoEquipo, Registro, Pro_Observ, DATEADD(second, 30, Fecha_ing) as  'Fecha_ing' , UsuHora_ing from ordenes where (Asignado = @usuario or estatus = @estatus) AND estatus <> @cancel";
        }

        db.query(Consulta, valores, (err, orden) => {
						console.log(Consulta)
            if (err) {
                console.error(err);
            }
            if (req.user[0].Cliente === 1 || req.user[0].proveedor === 1) {
                res.render('InicioHistorial', { 'ordenes' : orden, 'user': req.user[0], imagen : Drive });
            } else {
                res.render('Inicio', { 'ordenes' : orden, 'user': req.user[0], imagen : Drive });
            }
            //logs.accessLogin(req)
        });
    };


    function pendientes(req, res, next) {
        console.log(req.query.filtro)
        var fecha = new Date(req.query.filtro)
        var day = fecha.getDate() + 1;
        var month = fecha.getMonth() + 1;
        var year = fecha.getFullYear();

        var fechaN = month + "-" + day + "-" + year;
        var valores ={ user:[TYPES.Char,  req.user[0].Usuario ], dates:[TYPES.Char, fechaN], estatus:[TYPES.Char, 'Cancelada']}

        if (req.user[0].admon === 0) {
            Consulta = "select id, Serie, Orden, Estatus, ClienteNom, TipoEquipo, Registro, Pro_Observ, Fecha_ing , UsuHora_ing from ordenes where (Asignado = @usuario AND Fecha_ing = @dates ) OR Cliente = @usuario";
        } else {
            Consulta = "select id, Serie, Orden, Estatus, ClienteNom, TipoEquipo, Registro, Pro_Observ, DATEADD(second, 30, Fecha_ing)  , UsuHora_ing from ordenes where estatus <> @estatus AND fecha_ing = @dates ";
        }
        db.query(Consulta, valores , (err, orden) => {
            if (err)
                console.log(err);
            res.render('Pendientes', { 'ordenes' : orden, 'user': req.user[0], imagen : Drive });
        });
    };

    function orden(req, res, next) {

        var value = { id:[TYPES.Int, req.query.clave]}
        db.query("select * from ordenes where id =@id ", value, (err, ordens) => {
            if (err) {
                console.log(err);
            }
            if (ordens[0].ID_pendiente > 0) {
                var pendiente = {
                    id : [TYPES.Int, ordens[0].ID_pendiente],
					reporte : [TYPES.Char, 'Reporte']
                }
                db.query("select ID, PENDIENTE, OBSERV, HoraR, DATEADD(second, 0, FechaR) as  'FechaR' from pendient where id = @id", pendiente, (err, pendient) => {
                    if (err){
                        console.log(err)
                    }
                    if (req.user[0].Cliente === 1) {
                        consul = 'select Id, IdPendiente, Respuesta, Observ,  FechaT, HoraT, Usuario  from respues where Respuesta <> @reporte and IdPendiente =@id order by id'

                    } else if (req.user[0].proveedor === 1){
                        consul = 'select Id, IdPendiente, Respuesta, Observ,  FechaT, HoraT, Usuario  from respues where Respuesta <> @reporte and IdPendiente =@id order by id'
                    } else {
                        consul =  'select Id, IdPendiente, Respuesta, Observ,  FechaT, HoraT, Usuario  from respues where IdPendiente =@id order by id'

                    }
                    db.query(consul, pendiente, (err, respues) => {
                        if (err)
                            console.log(err);
                        if (req.user[0].Cliente === 1) {
                            res.render('ordenCliente', { 'orden' : ordens[0], 'pendiente': pendient[0], 'respuesta': respues, 'user' : req.user[0] });
                        } else if (req.user[0].proveedor === 1) {
                                res.render('ordenProveedor', { 'orden' : ordens[0], 'pendiente': pendient[0], 'respuesta': respues, 'user' : req.user[0] });
                        } else {
                              res.render('Orden', { 'orden' : ordens[0], 'pendiente': pendient[0], 'respuesta': respues, 'user': req.user[0] });
                        }
                    });
                })
            } else {
                res.render('Orden', { 'orden' : ordens[0] });
            }
         });
    };

    function empleados(req, res, next) {
				var areas ={
					soporte: [TYPES.Char, 'SOPORTE'],
                    uno: [TYPES.SmallInt, 1],
					sistemas: [TYPES.Char, 'SISTEMAS'],
					ventas: [TYPES.Char, 'VENTAS']
				}

				if (req.query.empleado == 'proveedor'){
					db.query("select USUARIO from usuariosweb where observ = 'Proveedor' ", {uno: [TYPES.SmallInt, 1]}, (err, empleado) => {
							if (err)
									console.log(err);
							//consFole.log(empleado)
							res.render('empleados', { 'usuarios' : empleado });
					});
				} else {
					db.query("select USUARIO from usuarios where AREA = 'SOPORTE' OR AREA = 'SISTEMAS' OR AREA = 'VENTAS'  ", areas, (err, empleado) => {
							if (err)
									return done(err);
							//consFole.log(empleado)
							res.render('empleados', { 'usuarios' : empleado });
					});
				}
    }    ;

    function newDate(fecha1) {
        var year = fecha1.getFullYear();
        var mes = fecha1.getMonth() + 1;
        //var mes = fecha1.getMonth();
        var dia = fecha1.getDate();
        //var fecha = new Date(Date.UTC(year, mes, dia));
        var fecha = dia + '-' + mes + '-' + year;
        return fecha
    }

    function newDates(fecha1) {
        var year = fecha1.getFullYear();
        var mes = fecha1.getMonth() + 1;
        //var mes = fecha1.getMonth();
        var dia = fecha1.getDate() + 1;
        //var fecha = new Date(Date.UTC(year, mes, dia));
        var fecha = dia + '-' + mes + '-' + year;
        return fecha
    }



	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
    });

    app.get('/salir', function (req, res) {
        req.logout();
        res.redirect('/Servicio');
    });

		app.get('/salirH', function (req, res) {
        req.logout();
        res.redirect('/Inicio');
    });




};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

//module.exports = sendEmail;
