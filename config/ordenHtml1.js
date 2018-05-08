var dbconfig = require('./config');
var Drive = dbconfig.DriveN;
var Limage = dbconfig.images;
var htmlFile = dbconfig.htmlFile;

module.exports.HTML = function (valores, partidas, imagen, user) {

    //var valores2 = [next, serie, usuario, vendNombre, cliente, nombreC, tel, reporto, dir, tEquipo, numeroSerie, marca, modelo, '', obserEquipo, 0, 0, fuente, serieFuente, 0, '', 0, 0, prev, correctivo, oServicio, soft, hard, 0, otProblema, dProble, 0, 0, 0, 0, '', '', '', '', '', '', '', '', '', '', fecha, 'SERVICIOWEB', usuario, hora, 'Recepcion', 1, 0, 0, 0, 0, '', 0, '', '', 0, 1, 1, 0, '', 0, '']
    var cHtml = "<!DOCTYPE html><!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/html4/strict.dtd'>"
    cHtml += "<html  >"
    cHtml += "<meta http-equiv='Content-Type' content='text/html; charset=utf-8'/>"
    cHtml += "<link href='Styles/StyleSheet.css' rel='stylesheet' />"
    cHtml += "<head>"
    cHtml += "<title>Orden " + valores.Serie + '-' + valores.Orden + "</title>"

    cHtml += "</head>"
    cHtml += "<body onLoad='setTimeout(window.print(), 800)' >"
    cHtml += "<div class='encabezado'>"
    cHtml += "<div id='container'> <img  src='Imagenes/Logo1.jpg' /></div>"
    cHtml += "<div id='Empresa'>"
    //cHtml += "<section class=' EmpNombre '>Grupo cf / Comunicacion sin Fronteras</section>"
    if (valores.Serie === 'CON') {
        cHtml += "<div class='EmpDir section'>"
        cHtml += "Avenida Constitución 127, Centro, 76650,<br /> Ezequiel Montes, Qro.<br />"
        cHtml += "Tels: (441)-277 2763 </p> </div>"
        cHtml += "<div class=' EmpDir  Dos'>"
        cHtml += "ventascorp@grupocf.com.mx<br />"
        cHtml += "www.grupocf.com.mx</div>"
    } else if (valores.Serie === 'CN' || valores.Serie === 'MAT') {
        cHtml += "<div class='EmpDir section'>"
        cHtml += "Avenida Constitución 171, Centro, 76650,<br /> Ezequiel Montes, Qro.<br />"
        cHtml += "Tels: (441)-277 2763 </p> </div>"
        cHtml += "<div class=' EmpDir  Dos'>"
        cHtml += "gerentesop@grupocf.com.mx<br />"
        cHtml += "www.facebook.com/QroGrupoCF</div>"
    }
    cHtml += "</div>"
    cHtml += "</div>"
    
    cHtml += "<div class='Contenedor'>"
    cHtml += "<div><img src='Imagenes/icon-ios7-people-outline.svg' class='img1' /> </div>"
    cHtml += "<strong>Datos de Contacto:</strong>"
    cHtml += "<div class='DatosCliente'>"
    cHtml += "<div class='section Fila'>Nombre:<strong> " + valores.ClienteNom + "</strong></div>"
    cHtml += "<div class='section'>Reportado Por: <strong> " + valores.Contacto + "</strong></div>"
    cHtml += "<div class='section'>Tel:<strong> " + valores.ClienteTel + "</strong></div> "
    cHtml += "<div class='section Fila'>Dir : " + valores.ClienteDir + "</div>"
    cHtml += "</div>"
    cHtml += "<div><img src='Imagenes/icon-monitor.svg' class='img1' /></div> <strong>Datos del equipo:</strong>"
    cHtml += "<div class='DatosEquipo'>"
    cHtml += "<div class='section'>Equipo: <strong>" + valores.TipoEquipo + "</strong></div>"
    cHtml += "<div class='section'> No de Serie: <strong>" + valores.Registro + "</strong></div>"
    cHtml += "<div class='section'>Marca: <strong>" + valores.Marca + "</strong> </div>"
    cHtml += "<div class='section'>Modelo: <strong>" + valores.Modelo + "</strong></div>"
    cHtml += "<div  class='Obser'>Observaciones: " + valores.ObservEquipo + "</div>"
    cHtml += "</div>"
    cHtml += "<div><img src='Imagenes/icon-ios7-star-outline.svg' class='img1' /></div> <strong>Accesorios</strong>"
    if (valores.TipoEquipo) {
        cHtml += "<div class='Accesorios'>"
        var checkIcon = "Imagenes/icon-checkmark-round.svg"

        var cpu = valores.CPU;
        if (cpu === 1)
            cHtml += "<div class='section'><input type='checkbox' name='CPU' id='CP' /><label for='CP'><span ><img src='" + checkIcon + "' /></span>CPU</label></div>"

        if (valores.Teclado === 1)
            cHtml += "<div class='section'><input type='checkbox' name='Teclado' id='squaredFour' /><label for='squaredFour'><span ><img src='" + checkIcon + "' /></span>Teclado</label></div>"
        if (valores.Mouse === 1)
            cHtml += "<div class='section'><input type='checkbox' name='Mouse' id='Mou' /><label for='Mou'><span ><img src='" + checkIcon + "' /></span>Mouse</label></div>"
        if (valores.Monitor === 1)
            cHtml += "<div class='section'><input type='checkbox' name='Monitor' id='Moni' /><label for='Moni'><span ><img src='" + checkIcon + "' /></span>Monitor S/N: " + valores.Monitorsn + " </label></div>"
        if (valores.FuentePoder === 1)
            cHtml += "<div class='section'><input type='checkbox' name='FuentePoder' id='Fuente' /><label for='Fuente'><span ><img src='" + checkIcon + "' /></span>Fuente de Poder S/N: " + valores.FuenteSn + " </label></div>"
        if (valores.Discos === 1)
            cHtml += "<div class='section'><input type='checkbox' name='Discos' id='Discos' /><label for='Discos'><span ><img src='" + checkIcon + "' /></span>Discos</label></div>"
        if (valores.Funda === 1)
            cHtml += "<div class='section'><input type='checkbox' name='Funda' id='Fund' /><label for='Fund'><span ><img src='" + checkIcon + "' /></span>Funda</label></div>"
        if (valores.USB === 1)
            cHtml += "<div class='section'><input type='checkbox' name='USB' id='Ubs' /><label for='Ubs'><span><img src='" + checkIcon + "' /></span>USB</Label></div>"
        if (valores.Negro === 1)
            cHtml += "<div class='section'><input type='checkbox' name='Negro' id='Neg' /><label for='Neg'><span><img src='" + checkIcon + "' /></span>Negro</Label></div>"
        if (valores.Azul === 1)
            cHtml += "<div class='section'><input type='checkbox' name='Azul' id='Az' /><label for='Az'><span><img src='" + checkIcon + "' /></span>Azul</Label></div>"
        if (valores.Magenta === 1)
            cHtml += "<div class='section'><input type='checkbox' name='Magenta' id='Mag' /><label for='Mag'><span><img src='" + checkIcon + "' /></span>Magenta</Label></div>"
        if (valores.Amarillo === 1)
            cHtml += "<div class='section'><input type='checkbox' name='Amarillo' id='Amar' /><label for='Amar'><span><img src='" + checkIcon + "' /></span>Amarillo</Label></div>"
        cHtml += "</div> "
    }
    cHtml += "<div><img src='Imagenes/icon-ios7-gear-outline.svg'  id='Tittleimg'/></div><strong>Descripcion del Servicio</strong>"
    cHtml += "<div class='Servicio'>"
    cHtml += "<div class='section'>Tipo de Servicio: </div>"

    if (valores.Garantia === 1)
        cHtml += "<div class='section'>Garantia </div>"
    if (valores.Poliza === 1)
        cHtml += "<div class='section'>Poliza </div>"
    if (valores.Preventivo === 1)
        cHtml += "<div class='section'>Preventivo </div>"
    if (valores.Correctivo === 1)
        cHtml += "<div class='section'>Correctivo </div>"
    cHtml += "<div class='section'>" + valores.ServOtro + " </div>"
    cHtml += "<div insclass='section'> Origen del Problema:  </div>"
    if (valores.Garantia === 1)
        cHtml += "<div class='section'>Hardware </div>"
    if (valores.Software === 1)
        cHtml += "<div class='section'>Softwere </div>"
    if (valores.maOperacion === 1)
        cHtml += "<div class='section'>Mala Operacion </section>"

    cHtml += "<div class='section'>" + valores.OrProblema + " </div>"
    cHtml += " <div class='Problema'>Descripcion del problema:  " + valores.Pro_Observ + "</div>"
    cHtml += "</div>"
    cHtml += "</div></div>"
    cHtml += "<div class='Datos'>"
    cHtml += "<div class='section Fila' style='text-align:right;'>Fecha: " + dateformat(valores.Fecha_ing) + "</div>"
    cHtml += "<div id='NoOrden'>"
    cHtml += "<div class='Numero'> Orden:<strong> " + valores.Serie + '-' + valores.Orden + "</strong> </div>"
    cHtml += "<div class='Estatus'>Estatus: " + valores.Estatus + "</div>"
    cHtml += "</div>"
    cHtml += "<div class='section Fila'>Atendido Por:</div>"
    cHtml += "<div class='section Fila' style='margin-bottom:6px;'><strong style='font-size:10px;'>" + valores.VendNom + "</strong></div> <br /><br />"
    //cHtml += "<div class='section Fila'><strong>Venta:" + valores.VENTA + "</strong></div> <br /><br />"
    cHtml += "<div class='Fila'><img src='Imagenes/icon-ios7-cart-outline.svg'  class='img1'/></div><strong>Refacciones y/o Servicios --- Venta" + valores.VendNom  + "</strong>"
    cHtml += "<div class='Refacciones'>"
    var i = 0;
    var total = 0;
    while (i < partidas.length) {
        cHtml += "<div class='Partida' style='margin-bottom:5px;'>"
        cHtml += " <div class='Cantidad section'>" + partidas[i].CANTIDAD + "</div>"
        cHtml += " <div class='Observ section'>" + partidas[i].OBSERV + "</div>"
        cHtml += " <div class='Precio section'>" + (partidas[i].PRECIO).toFixed(2) + "</div>"
        cHtml += "</div>"
        total = total + partidas[i].PRECIO;
        i = i + 1;
    }
    cHtml += "</div>"
    if (valores.Garantia == 0){
        cHtml += "<div class='total'> Cargo minimo de:  $ " + total.toFixed(2) + " </div>"
        cHtml += "<div style='padding-top:25px; font-size:10px'>Toda revisión del equipo causa un cargo mínimo de $150.00 MN, excepto servidores, workstations, impresión de volumen (copiadoras, impresoras y/o multifuncionales), plotters, impresoras doble carta que tienen un cargo mínimo de $600.00.</div>"            
        cHtml += "<div style='padding-top:10px; font-size:10px'>*Este monto puede cambiar dependiendo del Diagnostico y reparacion del Equipo.</div>"            

    } else{
        cHtml += "<div class='total'> En caso de proceder Garantía:  $ " + total.toFixed(2) + " </div>"
        cHtml += "<div style='padding-top:25px; padding-left:3px; padding-right:3px; text-align:justify; font-size:9px'>De las Garantías:(1) La Garantía de refacciones y/o equipos está estipulada por cada fabricante o proveedor. Grupo CF apoyará al cliente en el trámite de garantía, y no es responsable de los tiempos y/o políticas del fabricante, y el cliente se sujeta a éstas. En caso de que el fabricante o proveedor invalide la garantia, GrupoCF no se hace responsable por la reparación o garantía del producto. Grupo CF prdrá cotizar la reparación del equipo, en caso de que aplique. (2) La garantia en mano de obra es de 30 días, y solo aplica en la falla reparada, y de los componentes reparados. No hay garantía en servicios de software, sistemas operativos y/o antivirus.</div>"		
    }
    
    cHtml += "</div>"
    
    var cliente = valores.ClienteNom.split(' ')
    var nombre = cliente[0].split('')
    var apellido = cliente[1].split('')
    var password = nombre[0] + nombre[1] + apellido[0] + valores.Serie + valores.id 
    
     //------Firma
    cHtml += "<table style='padding-bottom:10px;'>"
    cHtml += "<tr><th>Acepto Terminos y Condiciones<br />  Nombre y Firma <br /> " + valores.Contacto " </th>"     
    cHtml += "<th style ='text-align:center;'>Puede consultar su ORDEN DE SERVICIO en la siguiente pagina: <br /> grupocfapp.com <br /> Su contraseña es: " + password +  "</th></tr>"
    cHtml += "</table> "
     //------Firma
    
    //---------Cliente
    cHtml += "<div class='encabezado' style='border-top:dashed 1px; padding-top:10px;' >"
    cHtml += "<div id='container'> <img  src='Imagenes/Logo1.jpg' /></div>"
    cHtml += "<div id='Empresa'>"
    //cHtml += "<section class=' EmpNombre '>Grupo cf / Comunicacion sin Fronteras</section>"
    if (valores.Serie === 'CON') {
        cHtml += "<div class='EmpDir section'>"
        cHtml += "Avenida Constitución 127, Centro, 76650,<br /> Ezequiel Montes, Qro.<br />"
        cHtml += "Tels: (441)-277 2763 </p> </div>"
        cHtml += "<div class=' EmpDir  Dos'>"
        cHtml += "ventascorp@grupocf.com.mx<br />"
        cHtml += "www.grupocf.com.mx</div>"
    } else if (valores.Serie === 'CN' || valores.Serie === 'MAT') {
        cHtml += "<div class='EmpDir section'>"
        cHtml += "Avenida Constitución 171, Centro, 76650,<br /> Ezequiel Montes, Qro.<br />"
        cHtml += "Tels: (441)-277 2763 </p> </div>"
        cHtml += "<div class=' EmpDir  Dos'>"
        cHtml += "gerentesop@grupocf.com.mx<br />"
        cHtml += "www.facebook.com/QroGrupoCF</div>"
    }
    cHtml += "</div>"
    cHtml += "</div>"
    
    cHtml += "<div class='Contenedor'>"
    cHtml += "<div><img src='Imagenes/icon-ios7-people-outline.svg' class='img1' /> </div>"
    cHtml += "<strong>Datos de Contacto:</strong>"
    cHtml += "<div class='DatosCliente'>"
    cHtml += "<div class='section Fila'>Nombre:<strong> " + valores.ClienteNom + "</strong></div>"
    cHtml += "<div class='section'>Reportado Por: <strong> " + valores.Contacto + "</strong></div>"
    cHtml += "<div class='section'>Tel:<strong> " + valores.ClienteTel + "</strong></div> "
    cHtml += "<div class='section Fila'>Dir : " + valores.ClienteDir + "</div>"
    cHtml += "</div>"
    cHtml += "<div><img src='Imagenes/icon-monitor.svg' class='img1' /></div> <strong>Datos del equipo:</strong>"
    cHtml += "<div class='DatosEquipo'>"
    cHtml += "<div class='section'>Equipo: <strong>" + valores.TipoEquipo + "</strong></div>"
    cHtml += "<div class='section'> No de Serie: <strong>" + valores.Registro + "</strong></div>"
    cHtml += "<div class='section'>Marca: <strong>" + valores.Marca + "</strong> </div>"
    cHtml += "<div class='section'>Modelo: <strong>" + valores.Modelo + "</strong></div>"
    cHtml += "<div  class='Obser'>Observaciones: " + valores.ObservEquipo + "</div>"
    cHtml += "</div>"
    cHtml += "<div><img src='Imagenes/icon-ios7-star-outline.svg' class='img1' /></div> <strong>Accesorios</strong>"
    if (valores.TipoEquipo) {
        cHtml += "<div class='Accesorios'>"
        var checkIcon = "Imagenes/icon-checkmark-round.svg"

        var cpu = valores.CPU;
        if (cpu === 1)
            cHtml += "<div class='section'><input type='checkbox' name='CPU' id='CP' /><label for='CP'><span ><img src='" + checkIcon + "' /></span>CPU</label></div>"

        if (valores.Teclado === 1)
            cHtml += "<div class='section'><input type='checkbox' name='Teclado' id='squaredFour' /><label for='squaredFour'><span ><img src='" + checkIcon + "' /></span>Teclado</label></div>"
        if (valores.Mouse === 1)
            cHtml += "<div class='section'><input type='checkbox' name='Mouse' id='Mou' /><label for='Mou'><span ><img src='" + checkIcon + "' /></span>Mouse</label></div>"
        if (valores.Monitor === 1)
            cHtml += "<div class='section'><input type='checkbox' name='Monitor' id='Moni' /><label for='Moni'><span ><img src='" + checkIcon + "' /></span>Monitor S/N: " + valores.Monitorsn + " </label></div>"
        if (valores.FuentePoder === 1)
            cHtml += "<div class='section'><input type='checkbox' name='FuentePoder' id='Fuente' /><label for='Fuente'><span ><img src='" + checkIcon + "' /></span>Fuente de Poder S/N: " + valores.FuenteSn + " </label></div>"
        if (valores.Discos === 1)
            cHtml += "<div class='section'><input type='checkbox' name='Discos' id='Discos' /><label for='Discos'><span ><img src='" + checkIcon + "' /></span>Discos</label></div>"
        if (valores.Funda === 1)
            cHtml += "<div class='section'><input type='checkbox' name='Funda' id='Fund' /><label for='Fund'><span ><img src='" + checkIcon + "' /></span>Funda</label></div>"
        if (valores.USB === 1)
            cHtml += "<div class='section'><input type='checkbox' name='USB' id='Ubs' /><label for='Ubs'><span><img src='" + checkIcon + "' /></span>USB</Label></div>"
        if (valores.Negro === 1)
            cHtml += "<div class='section'><input type='checkbox' name='Negro' id='Neg' /><label for='Neg'><span><img src='" + checkIcon + "' /></span>Negro</Label></div>"
        if (valores.Azul === 1)
            cHtml += "<div class='section'><input type='checkbox' name='Azul' id='Az' /><label for='Az'><span><img src='" + checkIcon + "' /></span>Azul</Label></div>"
        if (valores.Magenta === 1)
            cHtml += "<div class='section'><input type='checkbox' name='Magenta' id='Mag' /><label for='Mag'><span><img src='" + checkIcon + "' /></span>Magenta</Label></div>"
        if (valores.Amarillo === 1)
            cHtml += "<div class='section'><input type='checkbox' name='Amarillo' id='Amar' /><label for='Amar'><span><img src='" + checkIcon + "' /></span>Amarillo</Label></div>"
        cHtml += "</div> "
    }
    cHtml += "<div><img src='Imagenes/icon-ios7-gear-outline.svg'  id='Tittleimg'/></div><strong>Descripcion del Servicio</strong>"
    cHtml += "<div class='Servicio'>"
    cHtml += "<div class='section'>Tipo de Servicio: </div>"

    if (valores.Garantia === 1)
        cHtml += "<div class='section'>Garantia </div>"
    if (valores.Poliza === 1)
        cHtml += "<div class='section'>Poliza </div>"
    if (valores.Preventivo === 1)
        cHtml += "<div class='section'>Preventivo </div>"
    if (valores.Correctivo === 1)
        cHtml += "<div class='section'>Correctivo </div>"
    cHtml += "<div class='section'>" + valores.ServOtro + " </div>"
    cHtml += "<div insclass='section'> Origen del Problema:  </div>"
    if (valores.Garantia === 1)
        cHtml += "<div class='section'>Hardware </div>"
    if (valores.Software === 1)
        cHtml += "<div class='section'>Softwere </div>"
    if (valores.maOperacion === 1)
        cHtml += "<div class='section'>Mala Operacion </section>"

    cHtml += "<div class='section'>" + valores.OrProblema + " </div>"
    cHtml += " <div class='Problema'>Descripcion del problema:  " + valores.Pro_Observ + "</div>"
    cHtml += "</div>"
    cHtml += "</div></div>"
    cHtml += "<div class='Datos'>"
    cHtml += "<div class='section Fila' style='text-align:right;'>Fecha: " + dateformat(valores.Fecha_ing) + "</div>"
    cHtml += "<div id='NoOrden'>"
    cHtml += "<div class='Numero'> Orden:<strong> " + valores.Serie + '-' + valores.Orden + "</strong> </div>"
    cHtml += "<div class='Estatus'>Estatus: " + valores.Estatus + "</div>"
    cHtml += "</div>"
    cHtml += "<div class='section Fila'>Atendido Por:</div>"
    cHtml += "<div class='section Fila' style='margin-bottom:6px;'><strong style='font-size:10px;'>" + valores.VendNom + "</strong></div> <br /><br />"
    //cHtml += "<div class='section Fila'><strong>Venta:" + valores.VENTA + "</strong></div> <br /><br />"
    cHtml += "<div class='Fila'><img src='Imagenes/icon-ios7-cart-outline.svg'  class='img1'/></div><strong>Refacciones y/o Servicios --- Venta" + valores.VendNom  + "</strong>"
    cHtml += "<div class='Refacciones'>"
    var i = 0;
    var total = 0;
    while (i < partidas.length) {
        cHtml += "<div class='Partida' style='margin-bottom:5px;'>"
        cHtml += " <div class='Cantidad section'>" + partidas[i].CANTIDAD + "</div>"
        cHtml += " <div class='Observ section'>" + partidas[i].OBSERV + "</div>"
        cHtml += " <div class='Precio section'>" + (partidas[i].PRECIO).toFixed(2) + "</div>"
        cHtml += "</div>"
        total = total + partidas[i].PRECIO;
        i = i + 1;
    }
    cHtml += "</div>"
    if (valores.Garantia == 0){
        cHtml += "<div class='total'> Cargo minimo de:  $ " + total.toFixed(2) + " </div>"
        cHtml += "<div style='padding-top:25px; font-size:10px'>Toda revisión del equipo causa un cargo mínimo de $150.00 MN, excepto servidores, workstations, impresión de volumen (copiadoras, impresoras y/o multifuncionales), plotters, impresoras doble carta que tienen un cargo mínimo de $600.00.</div>"            
        cHtml += "<div style='padding-top:10px; font-size:10px'>*Este monto puede cambiar dependiendo del Diagnostico y reparacion del Equipo.</div>"            

    } else{
        cHtml += "<div class='total'> En caso de proceder Garantía:  $ " + total.toFixed(2) + " </div>"
        cHtml += "<div style='padding-top:25px; padding-left:3px; padding-right:3px; text-align:justify; font-size:9px'>De las Garantías:(1) La Garantía de refacciones y/o equipos está estipulada por cada fabricante o proveedor. Grupo CF apoyará al cliente en el trámite de garantía, y no es responsable de los tiempos y/o políticas del fabricante, y el cliente se sujeta a éstas. En caso de que el fabricante o proveedor invalide la garantia, GrupoCF no se hace responsable por la reparación o garantía del producto. Grupo CF prdrá cotizar la reparación del equipo, en caso de que aplique. (2) La garantia en mano de obra es de 30 días, y solo aplica en la falla reparada, y de los componentes reparados. No hay garantía en servicios de software, sistemas operativos y/o antivirus.</div>"		
    }
    
    cHtml += "</div>"

    
     //------Firma
    cHtml += "<table style='padding-bottom:10px;'>"
    cHtml += "<tr><th>Acepto Terminos y Condiciones<br />  Nombre y Firma <br /> " + valores.Contacto " </th>"     
    cHtml += "<th style ='text-align:center;'>Puede consultar su ORDEN DE SERVICIO en la siguiente pagina: <br /> grupocfapp.com <br /> Su contraseña es: " + password +  "</th></tr>"
    cHtml += "</table> "
     //------Firma
    
    
    
    
    //---------Cliente
    
    //----------Reverso
    
    cHtml += "<footer style='border-top:none'>"
    //cHtml += "<div class='encabezado'>"
    //cHtml += "<div id='container'> <img  src='Imagenes/Logo1.jpg' /></div>"
    //cHtml += "<div id='Empresa'>"
    //cHtml += "<section class=' EmpNombre '>Grupo cf / Comunicacion sin Fronteras</section>"
    //if (valores.Serie === 'CON') {
    //    cHtml += "<div class='EmpDir section'>"
    //    cHtml += "Avenida Constitución 127, Centro, 76650,<br /> Ezequiel Montes, Qro.<br />"
    //    cHtml += "Tels: (441)-277 2763 o 277 0923 </p> </div>"
    //    cHtml += "<div class=' EmpDir  Dos'>"
    //    cHtml += "ventascorp@grupocf.com.mx<br />"
    //    cHtml += "www.grupocf.com.mx</div>"
    //} else if (valores.Serie === 'CN' || valores.Serie === 'MAT') {
    //    cHtml += "<div class='EmpDir section'>"
    //    cHtml += "Avenida Constitución 171, Centro, 76650,<br /> Ezequiel Montes, Qro.<br />"
    //    cHtml += "Tels: (441)-277 2763 o 277 0923 </p> </div>"
    //    cHtml += "<div class=' EmpDir  Dos'>"
    //    cHtml += "ventascorp@grupocf.com.mx<br />"
    //    cHtml += "www.grupocf.com.mx</div>"
    //}
    //cHtml += "</div></div>"

    //cHtml += "<div class='Equip'><strong>" + valores.TipoEquipo + ", S/N:" + valores.Registro + ", " + valores.Marca + ", " + valores.Modelo + " </strong></div>"
    cHtml += "<div class='two'>"
    cHtml += "<div class='section'> Orden:<strong> " + valores.Serie + " " + valores.Orden + "</strong> </div>"
    cHtml += "</div>"

    cHtml += "<P style='margin-top:5px;'>En Ezequiel Montes,Qro el dia: " + dateformat(valores.Fecha_ing) + ", " + valores.ClienteDir
    cHtml += "<p style='margin-top:0px; margin-bottom:0px;'>Términos y Condiciones</p>"
    cHtml += "<div class='Terminos'>"
    cHtml += "<ol class='auto-style2' style='padding-left:20px'>"
    cHtml += "<li>Toda revisión del equipo causa un cargo mínimo de $150.00 MN, excepto servidores, workstations, impresión de volumen (copiadoras, impresoras y/o multifuncionales), plotters, impresoras doble carta que tienen un cargo mínimo de $600.00.</li>"
    cHtml += "<li>No se entregará ningún equipo sin presentar la ORDEN DE SERVICIO, y no es válido sin la firma del personal autorizado.</li>"
    cHtml += "<li>En caso de no presentar la ORDEN DE SERVICIO tendrá un cargo adicional de $50.00, y deberá de presentarse el titular de la orden, con una copia de identificación oficial y comprobante de propiedad del equipo. No se podrá entregar a otra persona diferente a las declaradas en la ORDEN DE SERVICIO.</li>"
    cHtml += "<li>La empresa <strong>NO SE HACE RESPONSABLE DE LA INFORMACIÓN CONTENIDA </strong> en los equipos o dispositivos. Cuando aplique cambio del disco duro o formateo de éste, solo se efectuará el cambio y/o instalación, y no se incluye"
    cHtml += " ninguna información, software o respaldo anterior. Solo se respaldará la información solicitada por el cliente,  con un cargo adicional, y <strong> NO ES RESPONSABILIDAD DE LA EMPRESA LA INTEGRIDAD DE ÉSTA </strong>.</li>"
    cHtml += "<li>Para Garantías es necesario fotocopia de la factura que prueba la fecha de compra y número de serie del equipo presentado, ademas que el equipo no debe dar muestra de haber sido intervenido, ni presentar componentes quemados</li>"
    cHtml += "<li>El tiempo de reparación está sujeto a la disponibilidad de refacciones, traslado de éstas por parte del proveedor, así como al tipo de falla presentada.</li>"
    cHtml += "<li>El diagnóstico y estado real de los componentes internos de su equipo quedaran sujetos hasta la revision del técnico.</li>"
    cHtml += "<li>Las refacciones y/o productos sobre pedido deberán de ser pagadas al 100% por anticipado, y están sujetas al tiempo de entrega del proveedor. El costo de la mano de obra podrá cobrarse parcialmente, y el resto contra la entrega del equipo. </li>"
    cHtml += "<li>No hay devolución o cancelación en refacciones y/o productos sobre pedido.</li>"
    cHtml += "</ol>"
    
    if (valores.AutApertura === 1) {
        cHtml += " <div class='section'><input type='checkbox' name='Aut1' id='Checkbox1' /><label for='Checkbox1'><span ><img src='Imagenes/icon-checkmark-round.svg' /></span>Autorizo apertura si es necesario</label>"
        cHtml += "</div>"
    } else {
        cHtml += " <div class='section'><input type='checkbox' name='Aut1' id='Checkbox1' /><label for='Checkbox1'><span ></span>Autorizo apertura sin previo Aviso</label>"
        cHtml += "</div>"
    }
    cHtml += "</div>"
    cHtml += " <div class='Terminos' aria-disabled='True' >"
    cHtml += "<ol class='auto-style2' start='9' style='padding-left:20px'>"
    
    cHtml += "<li>De las Garantías:(1) La Garantía de refacciones y/o equipos está estipulada por cada fabricante o proveedor. Grupo CF apoyará al cliente en el trámite de garantía, y no es responsable de los tiempos y/o políticas del fabricante, y el cliente se sujeta a éstas. En caso de que el fabricante o proveedor invalide la garantia, GrupoCF no se hace responsable por la reparación o garantía del producto. Grupo CF prdrá cotizar la reparación del equipo, en caso de que aplique. (2) La garantia en mano de obra es de 30 días, y solo aplica en la falla reparada, y de los componentes reparados. No hay garantía en servicios de software, sistemas operativos y/o antivirus.</li>"
    cHtml += "<li>En caso de que el equipo tenga más de 15 días en fase de Terminado, se cobrará $25.00 diarios de almacenamiento. En caso de tener más de 30 días ,el quipo causará abandono, y a los 60 días será enviado a cuarentena donde pasará a un proceso de donación , despiece o eliminación . En caso de que el cliente haya pagado parcial o totalmente la reparación , perderá el monto total de dicho pago.</li>"
    cHtml += "<li>Cualquier restauración o evento de software, tiene como cargo mínimo $120.00, excepto servidores.</li>"
    cHtml += "<li>Solo se trabajara sobre la(s) falla(s) reportada(s) en este documento , haciendo caso omiso a las otras fallas que se presentaran y no estén involucradas  con la descrita en el presente.</li>"
    cHtml += "<li>El tiempo promedio para el diagnóstico del equipo es de 1 a 4 días hábiles. </li>"
    cHtml += "<li>El tiempo de solución a equipos en garantía está sujeto a los tiempos y condiciones del fabricante y a la disponibilidad de refacciones por parte de éste.</li>"
    cHtml += "<li>Los precios son más I.V.A. la forma de pago debe ser en efectivo, cheque, tarjeta bancaria o transferencia.</li>"
 		cHtml += "<li>Hacer su pago a favor de CARLOS CHAVEZ FERNANDEZ.</li>"
 		cHtml += "<li>Horario de atención: De lunes a viernes de 9:30 a 18:30 Hrs, y sábados de 9:30 a 13:30 Hrs.</li>"
    cHtml += "<li>Para cualquier duda o aclaración comunicarse al teléfono <strong>(441) 277 2763</strong>, o al correo <strong>gerentesop@grupocf.com.mx</strong>, a la COORDINACIÓN DE SOPORTE TECNICO.</li>"
 		cHtml += "<li>El cliente declara haber leído y acepta éstos Términos y Condiciones, y autoriza los trabajos necesarios para la revisión del equipo.</li>"
 	  cHtml += "</ol>"
    if (valores.AutRepara === 1) {
        cHtml += "<div class='section'><input type='checkbox' name='Aut2' id='Checkbox2' /><label for='Checkbox2'><span ><img src='Imagenes/icon-checkmark-round.svg' /></span>Autorizo reparacion</label>"
    } else {
        cHtml += "<div class='section'><input type='checkbox' name='Aut2' id='Checkbox2' checked='checked' /><label for='Chechbox2'><span ></span>Autorizo reparacion</label>"
    }
    cHtml += "</div></div>"
    cHtml += "<table>"
    cHtml += "<tr><th>Acepto Terminos y Condiciones<br />  Nombre y Firma</th>"
    cHtml += "<th>INGENIERIA DE SERVICIO<br />Nombre y firma</th>"
    cHtml += "<th>Cliente Recibe de conformidad<br /> Nombre y Firma</th></tr>"
    cHtml += "<th class='auto-style1'><p>" + valores.Contacto + "</p></th>"
    cHtml += "<th class='auto-style1'><p>" + valores.VendNom + "</p></th>"
    cHtml += "<th class='auto-style1'><p>" + valores.Contacto + "</p></th></tr>"
    cHtml += "</table>"
    
     cHtml += "<div class='imagenes'> <div class='galery'>"
    var m = 0;
    while (m < imagen.length) {
        var l = 1;
        if (imagen[m].serieWeb != '') {
            cHtml += "<img src='/service/" + imagen[m].serieWeb + ".png' />"
        } else {

            cHtml += "<img src='"+ Drive +  valores.Serie + '-' + valores.Orden + '-'+ l + ".jpg' />"
        }
        l = l + 1;
        m = m + 1;
    }

    cHtml += "</div></div>"
    cHtml += "</footer> "
    
    
    //----Cliente
    cHtml += "<footer class='punteada'>"
    //cHtml += "<div class='encabezado'>"
    //cHtml += "<div id='container'> <img  src='Imagenes/Logo1.jpg' /></div>"
    //cHtml += "<div id='Empresa'>"
    //cHtml += "<section class=' EmpNombre '>Grupo cf / Comunicacion sin Fronteras</section>"
    //if (valores.Serie === 'CON') {
    //    cHtml += "<div class='EmpDir section'>"
    //    cHtml += "Avenida Constitución 127, Centro, 76650,<br /> Ezequiel Montes, Qro.<br />"
    //    cHtml += "Tels: (441)-277 2763 o 277 0923 </p> </div>"
    //    cHtml += "<div class=' EmpDir  Dos'>"
    //    cHtml += "ventascorp@grupocf.com.mx<br />"
    //    cHtml += "www.grupocf.com.mx</div>"
    //} else if (valores.Serie === 'CN' || valores.Serie === 'MAT') {
    //    cHtml += "<div class='EmpDir section'>"
    //    cHtml += "Avenida Constitución 171, Centro, 76650,<br /> Ezequiel Montes, Qro.<br />"
    //    cHtml += "Tels: (441)-277 2763 o 277 0923 </p> </div>"
    //    cHtml += "<div class=' EmpDir  Dos'>"
    //    cHtml += "ventascorp@grupocf.com.mx<br />"
    //    cHtml += "www.grupocf.com.mx</div>"
    //}
    //cHtml += "</div></div>"

    //cHtml += "<div class='Equip'><strong>" + valores.TipoEquipo + ", S/N:" + valores.Registro + ", " + valores.Marca + ", " + valores.Modelo + " </strong></div>"
    cHtml += "<div class='two'>"
    cHtml += "<div class='section'> Orden:<strong> " + valores.Serie + " " + valores.Orden + "</strong> </div>"
    cHtml += "</div>"

    cHtml += "<P style='margin-top:5px;'>En Ezequiel Montes,Qro el dia: " + dateformat(valores.Fecha_ing) + ", " + valores.ClienteDir
    cHtml += "<p style='margin-top:0px; margin-bottom:0px;'>Términos y Condiciones</p>"
    cHtml += "<div class='Terminos'>"
    cHtml += "<ol class='auto-style2' style='padding-left:20px'>"
    cHtml += "<li>Toda revisión del equipo causa un cargo mínimo de $150.00 MN, excepto servidores, workstations, impresión de volumen (copiadoras, impresoras y/o multifuncionales), plotters, impresoras doble carta que tienen un cargo mínimo de $600.00.</li>"
    cHtml += "<li>No se entregará ningún equipo sin presentar la ORDEN DE SERVICIO, y no es válido sin la firma del personal autorizado.</li>"
    cHtml += "<li>En caso de no presentar la ORDEN DE SERVICIO tendrá un cargo adicional de $50.00, y deberá de presentarse el titular de la orden, con una copia de identificación oficial y comprobante de propiedad del equipo. No se podrá entregar a otra persona diferente a las declaradas en la ORDEN DE SERVICIO.</li>"
    cHtml += "<li>La empresa <strong>NO SE HACE RESPONSABLE DE LA INFORMACIÓN CONTENIDA </strong> en los equipos o dispositivos. Cuando aplique cambio del disco duro o formateo de éste, solo se efectuará el cambio y/o instalación, y no se incluye"
    cHtml += " ninguna información, software o respaldo anterior. Solo se respaldará la información solicitada por el cliente,  con un cargo adicional, y <strong> NO ES RESPONSABILIDAD DE LA EMPRESA LA INTEGRIDAD DE ÉSTA </strong>.</li>"
    cHtml += "<li>Para Garantías es necesario fotocopia de la factura que prueba la fecha de compra y número de serie del equipo presentado, ademas que el equipo no debe dar muestra de haber sido intervenido, ni presentar componentes quemados</li>"
    cHtml += "<li>El tiempo de reparación está sujeto a la disponibilidad de refacciones, traslado de éstas por parte del proveedor, así como al tipo de falla presentada.</li>"
    cHtml += "<li>El diagnóstico y estado real de los componentes internos de su equipo quedaran sujetos hasta la revision del técnico.</li>"
    cHtml += "<li>Las refacciones y/o productos sobre pedido deberán de ser pagadas al 100% por anticipado, y están sujetas al tiempo de entrega del proveedor. El costo de la mano de obra podrá cobrarse parcialmente, y el resto contra la entrega del equipo. </li>"
    cHtml += "<li>No hay devolución o cancelación en refacciones y/o productos sobre pedido.</li>"
    cHtml += "</ol>"
    
    if (valores.AutApertura === 1) {
        cHtml += " <div class='section'><input type='checkbox' name='Aut1' id='Checkbox1' /><label for='Checkbox1'><span ><img src='Imagenes/icon-checkmark-round.svg' /></span>Autorizo apertura si es necesario</label>"
        cHtml += "</div>"
    } else {
        cHtml += " <div class='section'><input type='checkbox' name='Aut1' id='Checkbox1' /><label for='Checkbox1'><span ></span>Autorizo apertura sin previo Aviso</label>"
        cHtml += "</div>"
    }
    cHtml += "</div>"
    cHtml += " <div class='Terminos' aria-disabled='True' >"
    cHtml += "<ol class='auto-style2' start='9' style='padding-left:20px'>"
    
    cHtml += "<li>De las Garantías:(1) La Garantía de refacciones y/o equipos está estipulada por cada fabricante o proveedor. Grupo CF apoyará al cliente en el trámite de garantía, y no es responsable de los tiempos y/o políticas del fabricante, y el cliente se sujeta a éstas. En caso de que el fabricante o proveedor invalide la garantia, GrupoCF no se hace responsable por la reparación o garantía del producto. Grupo CF prdrá cotizar la reparación del equipo, en caso de que aplique. (2) La garantia en mano de obra es de 30 días, y solo aplica en la falla reparada, y de los componentes reparados. No hay garantía en servicios de software, sistemas operativos y/o antivirus.</li>"
    cHtml += "<li>En caso de que el equipo tenga más de 15 días en fase de Terminado, se cobrará $25.00 diarios de almacenamiento. En caso de tener más de 30 días ,el quipo causará abandono, y a los 60 días será enviado a cuarentena donde pasará a un proceso de donación , despiece o eliminación . En caso de que el cliente haya pagado parcial o totalmente la reparación , perderá el monto total de dicho pago.</li>"
    cHtml += "<li>Cualquier restauración o evento de software, tiene como cargo mínimo $120.00, excepto servidores.</li>"
    cHtml += "<li>Solo se trabajara sobre la(s) falla(s) reportada(s) en este documento , haciendo caso omiso a las otras fallas que se presentaran y no estén involucradas  con la descrita en el presente.</li>"
    cHtml += "<li>El tiempo promedio para el diagnóstico del equipo es de 1 a 4 días hábiles. </li>"
    cHtml += "<li>El tiempo de solución a equipos en garantía está sujeto a los tiempos y condiciones del fabricante y a la disponibilidad de refacciones por parte de éste.</li>"
    cHtml += "<li>Los precios son más I.V.A. la forma de pago debe ser en efectivo, cheque, tarjeta bancaria o transferencia.</li>"
 		cHtml += "<li>Hacer su pago a favor de CARLOS CHAVEZ FERNANDEZ.</li>"
 		cHtml += "<li>Horario de atención: De lunes a viernes de 9:30 a 18:30 Hrs, y sábados de 9:30 a 13:30 Hrs.</li>"
    cHtml += "<li>Para cualquier duda o aclaración comunicarse al teléfono <strong>(441) 277 2763</strong>, o al correo <strong>gerentesop@grupocf.com.mx</strong>, a la COORDINACIÓN DE SOPORTE TECNICO.</li>"
 		cHtml += "<li>El cliente declara haber leído y acepta éstos Términos y Condiciones, y autoriza los trabajos necesarios para la revisión del equipo.</li>"
 	  cHtml += "</ol>"
    if (valores.AutRepara === 1) {
        cHtml += "<div class='section'><input type='checkbox' name='Aut2' id='Checkbox2' /><label for='Checkbox2'><span ><img src='Imagenes/icon-checkmark-round.svg' /></span>Autorizo reparacion</label>"
    } else {
        cHtml += "<div class='section'><input type='checkbox' name='Aut2' id='Checkbox2' checked='checked' /><label for='Chechbox2'><span ></span>Autorizo reparacion</label>"
    }
    cHtml += "</div></div>"
    cHtml += "<table>"
    cHtml += "<tr><th>Acepto Terminos y Condiciones<br />  Nombre y Firma</th>"
    cHtml += "<th>INGENIERIA DE SERVICIO<br />Nombre y firma</th>"
    cHtml += "<th>Cliente Recibe de conformidad<br /> Nombre y Firma</th></tr>"
    cHtml += "<th class='auto-style1'><p>" + valores.Contacto + "</p></th>"
    cHtml += "<th class='auto-style1'><p>" + valores.VendNom + "</p></th>"
    cHtml += "<th class='auto-style1'><p>" + valores.Contacto + "</p></th></tr>"
    cHtml += "</table>"
    
     cHtml += "<div class='imagenes'> <div class='galery'>"
    var m = 0;
    while (m < imagen.length) {
        var l = 1;
        if (imagen[m].serieWeb != '') {
            cHtml += "<img src='/service/" + imagen[m].serieWeb + ".png' />"
        } else {

            cHtml += "<img src='"+ Drive +  valores.Serie + '-' + valores.Orden + '-'+ l + ".jpg' />"
        }
        l = l + 1;
        m = m + 1;
    }

    cHtml += "</div></div>"
    cHtml += "</footer> "
    
    //----Cliente

    
    
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
        //console.log('crea HTML bien')
}


function dateformat(fecha) {
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
