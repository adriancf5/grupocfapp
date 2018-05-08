
var mysql = require('msnodesql');
var dbconfig = require('./config');
//var connstring = dbconfig.SQL_CONN;
var connstring = dbconfig.localDB;
var Drive = dbconfig.DriveN;
var PDFDocument = require('pdfkit');
var fs = require('fs');


module.exports = function (app, passport) {
   
    
   
    app.get('/ordenPDF', function (req, res) {
        //console.log(req.user)
        var ordenId = req.body.ordenId;
        if (!ordenId) {
            ordenId = 681
        } 
        Consulta = "select * from ordenes where id = " + ordenId;
            
        mysql.open(connstring, function (err, conn) {
            conn.query(Consulta, function (err, orden) {
                if (err)
                    res.render("error", { message: "", error: err })
                    
                newPDF(orden[0], ordenId);
                res.send('ok');          
            });
        });
    })
    

    function newPDF(query, id){

        var doc = new PDFDocument();
        //console.log(doc);
        // 621 PPI (letter)

        doc.pipe(fs.createWriteStream('/Users/Usuerhp/Documents/Projects/Login/Login/public/pdf/' + query.Serie +  '-' + query.Orden +'.pdf'));
         
        doc.font('public/fonts/Nova/Regular.ttf')
            .fontSize(12)
            .text('Grupo CF / Comunicacion Sin Fronteras', 100, 30, { paragraphGap : -10 })
        doc.moveDown()
           .text(' Avenida Constitucion No: 127', { paragraphGap : -10})
        doc.moveDown()
            .text('Col. Centro Ezequiel Montes Qro', { paragraphGap : -10})
        doc.image('public/images/logo.png', 25, 25, { width: 60 })
        doc.lineJoin('round')
             .rect(20, 20, 570, 70)
             .stroke()
        doc.lineJoin('round')
            .rect(20, 100, 350, 200)
            .stroke()
        // Datos de Orden
        doc.image('public/Imagenes/icon-ios7-people-outline.png', 20,100, {width: 10})
        doc.lineJoin('round')
            .rect(380, 100, 200, 200)
            .stroke()
        doc.scale(0.6)
            .translate(470, 380)
            .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
            .fill('red', 'even-odd')
            .restore()

        //doc.addPage()
        //doc.layout('landscape')
        //doc.size('letter')
        //doc.save()
        //    .moveTo(100, 150)
        //    .lineTo(100, 250)
        //    .lineTo(200, 250)
        //    .fill("#FF3300")
        
        //doc.addPage()
        //    .fillColor("blue")
        //    .text('Here is a link!', 100, 100)
        //    .underline(100, 100, 160, 27, "#0000FF")
        //    .link(100, 100, 160, 27, 'http://google.com/')
        //doc.font('fonts/PalatinoBold.ttf')
        //    .fontSize(25)
        //    .text('Some text with an embedded font!', 100, 100)
        //doc.addPage()
        //    .fontSize(25)
        //    .text(query.ClienteNom, 100, 100)
        //doc.polygon([100, 0], [50, 100], [150, 100])
        //doc.stroke()
        
        //doc.addPage()
        //doc.lineWidth(25)
        //doc.lineCap('butt')
        //    .moveTo(50, 20)
        //    .lineTo(100, 20)
        //    .stroke()
        
        //doc.lineCap('round')
        //    .moveTo(150, 20)
        //   .lineTo(200, 20)
        //    .stroke()
        
        //doc.lineCap('square')
        //    .moveTo(250, 20)
        //    .circle(275, 30, 15)
        //    .stroke()
        
        ///doc.lineJoin('miter')
        //    .rect(20, 100, 50, 50)
        //    .stroke()
        
       // doc.lineJoin('round')
       //     .rect(150, 100, 50, 50)
       //     .stroke()
        
        //doc.lineJoin('bevel')
        //    .rect(250, 100, 50, 50)
        //    .stroke()
        
        //doc.pipe(res);
        
        doc.end();
    }
    
};

