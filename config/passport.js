// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
// load up the user model
var mysql = require('tedious');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./config');
var Connection = require('tedious').Connection,
    Request = require('tedious').Request
var config = dbconfig.params

var connectionString = dbconfig.SQL_CONN;
const friendly = require('tedious-friendly');
const TYPES = friendly.tedious.TYPES;
const connectionConfig = { options: { useUTC: true } };
const poolConfig = { min: 2, max: 4, log: false };

// create connection pool
const db = friendly.create({ connectionString, connectionConfig, poolConfig });


module.exports = function (passport) {


    // expose this function to our app using module.exports

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.Id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        var  values = {
            id: [ TYPES.Int, id]
        };
        db.query('select * from usuariosWeb where id = @id', values, (err, user) => {
            if (err) {
                console.error(err);
            }
                done(err, user);; // --> [{ id: '8F41C105-1D24-E511-80C8-000C2927F443', email: 'bart@hotmail.com' }]
        });
 
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function (req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            mysql.open(connstring, function (err, conn) {
                conn.query("select * from usuariosWeb where usuario = '" + username + "'", function (err, rows) {
                    if (err)
                        return done(err);
                    if (rows.length) {
                        return done(null, false, req.flash('signupMessage', 'El usuario ya existe.'));
                    } else {
                        // if there is no user with that username
                        // create the user
                        var newUsersql = {
                            username: username,
                            password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                        };


                        var insertQuery = "INSERT INTO usuariosWeb ( Usuario, Password ) values ('" + newUsersql.username + "','" + newUsersql.password + "')";
                        //console.log(insertQuery);

                        conn.query(insertQuery, function (err, rows) {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            conn.query("SELECT * from usuariosWeb WHERE usuario ='" + newUsersql.username + "'", function (err, newuser) {
                                if (err) {
                                    console.log(err);
                                    return;
                                }

                                return done(null, newuser[0]);

                            });
                        });
                    }
                });
            });
        })
    );


    //new user
    passport.use(
        'local-user',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function (req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            console.log(req.body);
            var  values = {
                user: [ TYPES.Char, req.body.username]
            };
            db.query('select * from usuariosWeb where usuario = @user', values, (err, users) => {
                if (err) {
                    console.error(err);
                }
                if (users.length){
                    return done(null, false, req.flash('signupMessage', 'El usuario ya existe.'));
                }else{
                    var newUser = {
                            username: username,
                            password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                        };
                    var admon = 0, cliente = 0
                    if (req.body.admon) {
                        admon = 1
                    }
                    if (req.body.cliente) {
                        cliente = 1
                    }
                    var values = {
                        usuario: [TYPES.Char, newUser.username ],
                        pass: [TYPES.Char, newUser.password],
                        email: [TYPES.Char, req.body.correo],
                        adm: [TYPES.Int, admon],
                        estado: [TYPES.Char, 'Queretaro'],
                        Pais: [TYPES.Char, 'México'],
                        cp : [TYPES.Char, req.body.CP],
                        observ: [TYPES.NVarChar, req.body.observacion],
                        equipos: [TYPES.Char, req.body.Equipos],
                        servicios : [TYPES.Char, req.body.Servicios],
                        client : [TYPES.Int, cliente],
                        nombre : [TYPES.NVarChar, req.body.nombre ]
                    }
                    db.query('INSERT INTO usuariosWeb ( Usuario, Password, email, admon, Estado, Pais, CP, Observ, Equipos, Servicios, Cliente, Nombre values(@username, @pas, @email, @adm, @esstado, @Pais, @cp, @observ, @equipos, @servicios, @client, nombre ) ', values, (err, usernew) => {
                        if (err) {
                            console.error(err);
                        }
                        done(err, usernew[0]);;
                    });

                }

            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            // allows us to pass back the entire request to the callback
            passReqToCallback : true
        },
        // callback with email and password from our form

        function (req, username, password, done) {
            var usuario ={
                name:[TYPES.Char, username]
            }
            db.query('select * from usuariosWeb where usuario = @name', usuario, (err, user) => {
                if (err) {
                    console.log(err)
                }
                //console.log(user)
                if (user.length > 0) {
                    if (username === 'CLIGEN') {
                        //console.log("CLIGEN")
                        var div = (/\d{4}/).exec(password);
                        var le = (/\w+[^0-9]/).exec(password);
                        var ot = '', nom = '',ape = '', serie = ''
                        if (le) {
                            ot = le[0].split(''), nom = ot[0] + ot[1], ape = ot[2], serie = ot[3] + ot[4] + ot[5]
                        }
                        var int = 0;
                        if (div) {
                            int = parseInt(div);
                        }
                        var orden = {
                            id:[TYPES.Int, int],
                            serie: [TYPES.Char, serie]
                        }
                        db.query('Select id , ClienteNom , Serie from ordenes where id  = @id and serie = @serie', orden, (err, orden) => {
                            if (err) {
                                return done(err)
                            }
                            if (orden.length > 0 ) {
                                var cliente = orden[0].ClienteNom.split(' ')
                                var nombre = cliente[0].split('') ;
                                var apellido = cliente[1].split('');
                                if ( (nombre[0] + nombre[1])=== nom && apellido[0] === ape ){
                                    return done(null, user[0], req.flash('ordenId', int ));
                                } else {
                                    return done(null, false, req.flash('loginMessage', 'Asegurese de haber colocado correctamente la contraseña.'));
                                }

                            } else {
                                return done(null, false, req.flash('loginMessage', 'La contraseña es incorrecta.'));
                            }

                        });
                    }
                var hash = ''
                if (user.length > 0 && username != 'CLIGEN') {

                    var encrypted_length = user[0].Password.length;

                    if (encrypted_length != 60) {
                        //throw "Not a valid BCrypt hash.";
                        hash = bcrypt.hashSync(user[0].Password);
                    } else {
                        hash = user[0].Password;
                    }
                    // if the user is found but the password is wrong
                    if (!bcrypt.compareSync(password, hash)){
                        return done(null, false, req.flash('loginMessage', 'Oops! Contraseña incorrecta.'));   
                    } else{
                            return done(null, user[0]);
                    }
                }
            } else {
                return done(null, false, req.flash('loginMessage', 'El usuario no existe.'));
            }
            });

        })
    );
};
