$(window).load(function () {

    $('.loader').hide();
    $('.see').fadeIn('slow');

});




$(document).ready(function () {
    function disabled (elem){
      elem.addClass('disabled')
    }
    $(function () {
        $('.js-popover').popover()
        $('.js-tooltip').tooltip()
    })

    $('#calendar').datepicker({
    });

    $(document).on('change', function (e) {
        var $tar = $(e.target);
        if ($tar.hasClass('respuesta')) {
            var styleValue = '';
            styleValue = $($tar).val();
            respuesta(styleValue)
        }

        if ($tar.hasClass('tipoEquipo')) {
            var target = $($tar).val()
            if (target === 'PC' || target === 'Laptop') {
                $(document).find('#adicionales').removeClass('hide');
                $(document).find('#cartuchos').addClass('hide');
            } else if (target === 'ImpresoraL' || target === 'ImpresoraY' || target === 'ImpresoraM' || target === 'MultifuncionalL' || target === 'MultifuncionalY') {
                $(document).find('#cartuchos').removeClass('hide');
                $(document).find('#adicionales').addClass('hide');
            }
        }

        if ($tar.hasClass('agendaEmw')) {
            var target = $($tar).val()
            $(document).find('#calendario').empty()

            var empleado = $(document).find('.agendaEm').val();

            var options = {
                language: 'es-ES',
                //events_source: '../html/events.json.php',
                events_source: '/agendaPend?asig=' + empleado + '',
                view: 'month',
                tmpl_path: '../tmpls/',
                tmpl_cache: false,
                day: 'now',
                onAfterEventsLoad: function (events) {
                    if (!events) {
                        return;
                    }
                    var list = $('#eventlist');
                    list.html('');

                    $.each(events, function (key, val) {
                        $(document.createElement('li'))
					.html('<a href="' + val.url + '">' + val.title + '</a>')
					.appendTo(list);
                    });
                },
                onAfterViewLoad: function (view) {
                    $('.page-header h3').text(this.getTitle());
                    $('.btn-group button').removeClass('active');
                    $('button[data-calendar-view="' + view + '"]').addClass('active');
                },
                classes: {
                    months: {
                        general: 'label'
                    }
                }
            };
        }
    });

    function respuesta(styleValue){
        var venta = $(document).find('.modal.fade.in').attr('venta');
        // var venta = $.trim($('.tab-pane.active').find('.noVenta').text());
        var tipo = $(document).find('.modal.fade.in .' + styleValue).hasClass(styleValue);

        if (!tipo) {
            $(document).find('.modal.fade.in #detalleRespues').children().remove();
            $.get(
                '/respuesta',
                         { respuesta: styleValue , 'venta' : venta },
                        function (data) {

                    $(document).find('.modal.fade.in #detalleRespues').append(data);
                }
            );
            if (styleValue == 'asignarExt'){
              filtro = 'proveedor'
            } else {
              filtro = ''
            }
            $.get(
                '/empleados',
                         { empleado : filtro },
                        function (data) {
                          setTimeout(function (){
                              $(document).find('.modal.fade.in .empleado').append(data);
                          }, 100)

                }

            );
        }
    }

    $(document).on('click', function (e) {
        var $tar= $(e.target);
        if ($tar.hasClass('ion-android-close')) {

            var $tabc = $($tar).parents('li').find('a').attr('href');
            //alert($tabc)
            $($tabc).not('#principal').not('#inicio').remove();
            $($tar).parents('li').not('#principal').not('#inicio').remove();
            $('#principal').addClass('in active');
            $('#inicio').addClass('in active');
        }

        if ($tar.hasClass('ion-android-add-contact')) {


        }
        if ($tar.hasClass('ion-laptop')) {
            $('.modal.fade.in div.ordenNew').toggle('slow');
            $('.modal.fade.in div.equipoNew').toggle('slow');
        }
        if ($tar.hasClass('goback')) {
            if ($tar.parent().hasClass('equipoNew')) {
                $('.modal.fade.in div.ordenNew').toggle('slow');
                $('.modal.fade.in div.equipoNew').toggle('slow');
            }
            if ($tar.parent().hasClass('clientNew')) {
                $('.modal.fade.in div.clientNew').toggle('slow');
                $('.modal.fade.in dvi.ordenNew').toggle('slow');
            }

        }

        if ($tar.parents().hasClass('next')) {
            var target = $tar.attr('next-slide');
            var fin = parseInt($tar.attr('final'));
            //alert(target)

            if (fin === 1) {

                setTimeout(function () {
                    $(document).find('div#serviciosN').remove();
                    $(document).find('div#OrdenesN').remove();
                    $(document).find('a#linkModal').remove();
                    setTimeout(function (){
                        $(document).find('a#linkModal').remove();
                    }, 100)

                }, 500);

            }
            if (target === 'finalN') {

            } else {
                next($tar);
            }
        };

        function next($tar){
            var style = $tar.attr('next-style')
            var progres = $(document).find('.modal.fade.in div.progress-bar').attr('style', style);
            var target = $tar.attr('next-slide')
            var actual = $tar.attr('this-slide')
            $('.modal.fade.in div#' + actual).toggle('slow');
            $('.modal.fade.in div#' + target).toggle('slow');
            if (target === 'camaraN') {
                var video = $(document).find('video').attr('src')
                //alert(video)
                if (!video) {
                    camera();
                }
            }
        }

        if ($tar.parents().hasClass('previous')) {
            var styles = $tar.attr('prev-style')
            var progres = $(document).find('.modal.fade.in div.progress-bar').attr('style', styles);
            var target = $tar.parents().attr('next-slide')
            var actual = $tar.parents().attr('this-slide')
            $('.modal.fade.in div#' + actual).toggle('slow');
            $('.modal.fade.in div#' + target).toggle('slow');
        }

        if ($tar.hasClass('ion-clipboard')) {

        }
        if ($tar.hasClass('ion-calendar')) {
            $('.fechas').toggle('slow');
        //}
        //function fechasTo() {

            var date = new Date();
            var dia = date.getDate()
            var mes = date.getUTCMonth() + 1;
            var year = date.getFullYear();
            if (dia < 10) {
                dia = '0' + dia;
            }
            if (mes > 10) {
                var now = year + '-' + mes + '-' + dia;
            } else {
                var now = year + '-0' + mes + '-' + dia;
            }
            $(document).find('.modal.fade.in #startdate').attr('value', now);
            $(document).find('.modal.fade.in #startdate1').attr('value', now);

            var hora = date.getHours();
            var minuto = date.getMinutes();
            if (hora < 10){
                hora = '0' + hora;
            }
            if (minuto < 10){
                minuto = '0' + minuto;
            }

            var time = hora + ':' + minuto;
            $(document).find('.modal.fade.in #exittime').attr('value', time);
            $(document).find('.modal.fade.in #exittime1').attr('value', time);
            //$('.fechas').hide();
        }
        //}
        //Busqueda de articulos
        if ($tar.parents().hasClass('articulo')) {
            var articulo = $tar.parents().attr('clave');
            var descripcion = $tar.parents().attr('descripcion');
            var precio = $tar.parents().attr('precio');
            $(document).find('.modal.fade.in input.prods').attr({ 'clave': articulo, 'descripcion': descripcion, 'precio': precio });
            $(document).find('.modal.fade.in input[name="Descripcion"]').val(descripcion);
            $(document).find('.modal.fade.in input[name="Precio"]').val(precio);
            $(document).find('.modal.fade.in input[name="Cantidad"]').val(1)
            $(document).find('.modal.fade.in input.prods').val(articulo)
            $(document).find('.modal.fade.in #products').empty();
        }

        //Busqueda de clientes
        if ($tar.parents().hasClass('cliente')) {
            var cliente = $tar.parents().attr('clave');
            var descripcion = $tar.parents().attr('descripcion');
            var rfc = $tar.parents().attr('rfc');
            $('body').find('input.clients').attr({ 'clave': cliente, 'descripcion': descripcion, 'rfc': rfc });
            $('body').find('input.clients').val(cliente)
            $('body').find('.modal.fade.in input[name="clienteNombre"]').val(descripcion)
            $('body').find('.modal.fade.in input[name="calle"]').val($tar.parents().attr('calle'))
            $('body').find('.modal.fade.in input[name="colonia"]').val($tar.parents().attr('colonia'))
            $('body').find('.modal.fade.in input[name="interior"]').val($tar.parents().attr('int'))
            $('body').find('.modal.fade.in input[name="exterior"]').val($tar.parents().attr('ext'))
            $('body').find('.modal.fade.in input[name="telefono"]').val($tar.parents().attr('telefono'))
            $('body').find('.modal.fade.in input[name="correo"]').val($tar.parents().attr('correo'))
            $('body').find('.modal.fade.in input[name="reporto"]').val(descripcion)
            $('body').find('.modal.fade.in input[name="poblacion"]').val($tar.parents().attr('pobla'))


            $('body').find('.modal.fade.in div#clients').empty();

        }
        if ($tar.hasClass('material')) {
            var $find = $(document).find('.modal.fade.in input.prods');
            var articulo = $(document).find('.modal.fade.in input[name="prod"]').val();
            var descripcion = $(document).find('.modal.fade.in input[name="descripcion"]').val();
            var precio = $(document).find('.modal.fade.in input[name="Precio"]').val();
            var cantidad = $(document).find('.modal.fade.in input[name="cantidad"]').val()
            var type = $tar.attr('send');
            var venta = $tar.attr('venta')


            if (type === 'ajax' && descripcion != "" && venta != "") {
                $.ajax({
                    type: 'POST', url: '/partida', data : { ventas : venta, articulos : articulo, descripcions: descripcion, precios: precio },
                    dataType: 'text',
                    success: function (response) {
                        setTimeout(function () {
                            $(document).find('.moda.fade.in div#detalleRespues').children().remove();
                            setTimeout(function () {
                                respuesta('materiales');
                            }, 200)
                        }, 300);
                    },
                    error: function (xhr) {
                        $('#resError').removeClass('hide')
                        $('#resError').append('Error: ' + xhr.status + ' ' + xhr.statusText)
                    }
                });
            } else {
                $(document).find('.modal.fade.in div.venta').append('<section class="partida col-xs-12"><div class="col-xs-10"><div name="descripcion">' + descripcion + '</div> <div name="precio">' + precio + '</div><div>' + articulo + '</div>   </div><div class="col-xs-2"><div style="font-size:1.5em;">' + cantidad + '</div><div style="padding-left:0px!important;" class="ion-android-trash removeMat"></div></div> </section>')
                $(document).find('.modal.fade.in div.venta section.partida').append('<div style="display:none"><input name="articulo" value="' + articulo + '" > <input name="descrip" value="' + descripcion + '"> <input name="price" value="' + precio + '"> <input name="canti" value="' + cantidad + '"> </div>')

            }

            $(document).find('.modal.fade.in #Materiales input').each(function () {
                if ($(this).attr('type') === 'text') {
                    $(this).val('');
                }

            });
        }

        if ($tar.hasClass('removeMat')) {
            $tar.parent().parent().remove()
        }


        if ($tar.hasClass('carrito')) {
//            var articulo = $(document).find('.modal.fade.in input.prods').attr('clave');
//            var descripcion = $(document).find('.modal.fade.in input.prods').attr('descripcion');
//            var precio = ($(document).find('.modal.fade.in input.prods').attr('precio')) / 1.16;

            var venta = $(document).find('.modal.fade.in').attr('venta');
            var prod = $(document).find('.modal.fade.in input.prods').attr('value');
            
            var descripcion =  $(document).find('.modal.fade.in input[name="Descripcion"]').val();
            var precio = $(document).find('.modal.fade.in input[name="Precio"]').val()/ 1.16;
            var cantidad = $(document).find('.modal.fade.in input[name="Cantidad"]').val()
            var articulo = $(document).find('.modal.fade.in input.prods').val()
            
            $(document).find('.modal.fade.in input.prods').val('');
            
            //var datos = ;
            if (articulo != "" && prod != "") {
                $.ajax({
                    type: 'POST', url: '/partida', data : { ventas : venta, articulos : articulo, descripcions: descripcion, precios: precio, cantidad: cantidad },
                    dataType: 'text',
                    success: function (response) {
                        setTimeout(function () {
                            $(document).find('#detalleRespues').children().remove();
                            setTimeout(function (){
                                var styleValue = 'reparacion';
                                respuesta(styleValue);
                            }, 200)
                        }, 300);
                    },
                    error: function (xhr) {
                        $('#resError').removeClass('hide')
                        $('#resError').append('Error: ' + xhr.status + ' ' + xhr.statusText)

                    }
                });
            }


        }

        if ($tar.hasClass('cliente')) {
            var dataE = $('.client').serialize();
            //alert(dataE)

            if (dataE != '') {
                $.ajax({
                    type: 'POST', url: '/nuevoCliente', data : dataE,
                    dataType: 'text',
                    success: function (response) {
                        //alert(response);
                    },
                    error: function (xhr) {
                        $('#errorDisplay').html('Error: ' + xhr.status + ' ' + xhr.statusText);
                    }
                });
            }
        }

        if ($tar.hasClass('ion-android-social-user')) {
            $.ajax({
                type: 'GET', url: '/ordenPDF',
                dataType: 'text',
                success: function (response) {
                    //alert('ok');
                },
                error: function (xhr) {
                    $('#errorDisplay').html('Error: ' + xhr.status + ' ' + xhr.statusText);
                }
            });

        }

        if ($tar.hasClass('ion-flag')) {
            var source = $($tar).attr('data-get');
            var ordenId = $($tar).attr('value');
            var modal = $(document).find('div[id=ID-' + ordenId + ']').attr('value');

            if (!modal) {
                $.ajax({
                    type: 'GET', url: source, data : { 'id' : ordenId },
                    dataType: 'text',
                    success: function (response) {
                        $('body').append(response);
                    },
                    error: function (xhr) {
                        $('#errorDisplay').html('Error: ' + xhr.status + ' ' + xhr.statusText);
                    }
                });
                $($tar).append("<a data-toggle='modal' data-target='#ID-" + ordenId + "' class='Recepcion'></a>");
                setTimeout(function () {
                    $(document).find("a[data-target='#ID-" + ordenId + "']").trigger('click');
                }, 300);

            } else {
                $(document).find("a[data-target='#ID-" + ordenId + "']").trigger('click');
            }
        }

        if ($tar.hasClass('ion-images')) {
            var source = $($tar).attr('data-get');
            var ordenId = $($tar).attr('value');
            var modal = $(document).find('div[id=IDC-' + ordenId + ']').attr('value');

            if (!modal) {
                $.ajax({
                    type: 'GET', url: source, data : { 'id' : ordenId },
                    dataType: 'text',
                    success: function (response) {
                        $('body').append(response);
                    },
                    error: function (xhr) {
                        $('#errorDisplay').html('Error: ' + xhr.status + ' ' + xhr.statusText);
                    }
                });
                $($tar).append("<a data-toggle='modal' data-target='#IDC-" + ordenId + "' class=''></a>");
                setTimeout(function () {
                    $(document).find("a[data-target='#IDC-" + ordenId + "']").trigger('click');
                    var video = $(document).find('video').attr('src')
                    //alert(video)
                    if (!video) {
                        camera();
                    }
                }, 300);

            } else {
                $(document).find("a[data-target='#IDC-" + ordenId + "']").trigger('click');
            }
        }

        if ($tar.not('.ion-android-add').parents().hasClass('nav menu')) {
            var element = document.getElementById('bartab');
            //alert(element)
            var style = document.defaultView.getComputedStyle(element)
             var display = style.getPropertyValue('display');
            //alert(display);
            if (display === 'block') {
                setTimeout(function () {
                    $(document).find('.ion-navicon-round').trigger('click');
                }, 200)
            }

        }

        if ($tar.hasClass('modalNew')) {
            var id = $($tar).attr('id-target');
            var source = $($tar).attr('data-get');
            var modal = $(document).find('#' + id).attr('id');
            if (!modal) {
                $.ajax({
                    type: 'GET', url: source ,
                    dataType: 'text',
                    success: function (response) {
                        $('body').append(response);
                    },
                    error: function (xhr) {
                        $('#errorDisplay').html('Error: ' + xhr.status + ' ' + xhr.statusText);
                    }
                });
                $($tar).append("<a id='linkModal' data-toggle='modal' data-target='#"+ id +"'></a>");
                setTimeout(function () {
                    $(document).find("a[data-target='#" + id + "']").trigger('click');
                }, 900);

            } else {
                $(document).find("a[data-target='#" + id + "']").trigger('click');
            }


        }

        if ($tar.hasClass('ion-camera')) {
            setTimeout(function () {
              var ordenId = $tar.attr('ordenid')
              if (ordenId > 0 ) {


                  addImagen(1, ordenId)
              } else {
                  addImagen(0)
              }
            }, 200);
        }




        function camera() {

            App.init();

        }

        if ($tar.hasClass("imagenn")) {
            //document.getElementById("ima").addEventListener("click", function () {
            //addImagen();
            //});
        }
        function addImagen(imagen, idOrden) {
            //var drawing = document.getElementById("canvas");
            var drawing = $(document).find('#canvas:last-child')
            //console.log(drawing[0])
            if (drawing[0].getContext) {
                //get data URI of the image
                var imgURI = drawing[0].toDataURL("image / jpeg");
                //display the image
                var image = document.createElement("img");
                image.name = 'imagen';
                image.src = imgURI;

                $.ajax({
                    type: 'POST', url: '/imagen', data: imgURI,
                    contentType: false,
                    dataType: false,
                    success: function (response) {

                        var canvas = $(document).find('canvas:last-child')
                        if (canvas) {
                            canvas.attr('value', response)
                        }
                        if (imagen != 0 ){
                          $.ajax({
                              type: 'POST', url: '/newimagen', data: {name: response , id : idOrden},
                              dataType: "text",
                              success: function (response) {

                              },
                              error: function (xhr) {
                                  $('#errorDisplay').html('Error: ' + xhr.status + ' ' + xhr.statusText);
                              }
                          });
                        }
                    },
                    error: function (xhr) {
                        $('#errorDisplay').html('Error: ' + xhr.status + ' ' + xhr.statusText);
                    }
                });
            }
        }

        if ($tar.attr('type-send') === 'delete') {
            var target = $tar.attr('data-set')
            var value = $tar.attr('value')
            var venta = $tar.attr('venta')
            var dir = $tar.attr('url')
            var clave = $tar.attr('articulo')
            var name = $tar.attr('name')

            $.ajax({
                type: 'POST', url: dir, data: { tar: target, ventas: venta, valor : value, articulo : clave },
                dataType: 'text',
                success: function (response) {
                    setTimeout(function () {
                        $(document).find('#detalleRespues').children().remove();
                        setTimeout(function () {
                            //if (name === "") {
                                var styleValue = 'reparacion';
                            //} else {
                                //var styleValue = name;
                            //}

                            respuesta(styleValue);
                        }, 200)
                    }, 400);
                },
                error: function (xhr) {
                    $('#errorDisplay').html('Error: ' + xhr.status + ' ' + xhr.statusText);
                }
            });
        }


        if ($tar.attr('type-send') === 'ajax') {

            var target = $($tar).attr('form-target');

            var dataPost = '';

            var $findTarget1 = $(document).find('.modal.fade.in form[form-name=' + target + ']');
            var dataPost = $findTarget1.serialize();
            var Durl = $findTarget1.attr('action');
            var type = "text";

            if (dataPost != '') {
                $.ajax({
                    type: 'POST', url: Durl, data : dataPost,
                    dataType: type,
                    success: function (response) {
                        $(document).find('.modal.fade.in input').each(function () {
                           // $(this).val('');
                        });
                        if ($tar.attr('form-target') === 'cliente') {
                            $(document).find('input[name=clave]').val(response)
                        }

                    },
                    error: function (xhr) {

                        //$('#errorDisplay').html('Error: ' + xhr.status + ' ' + xhr.statusText);
                        $('#resError').removeClass('hide')
                        $('#resError').append('Error: ' + xhr.status + ' ' + xhr.statusText)
                    },
                    complete: function () {
                        if ($tar.attr('form-target') === 'Rpendient') {
                            var content = $('body').find('.tab-pane.fade.in.active div.row.ordenContent')
                            content.remove();
                            
                            var ide = $('body').find('div.modal.fade.eventos.in').attr('value')
                            $.ajax({
                                type: 'GET', url: '/Orden', data : { clave: ide },
                                dataType: 'text',
                                success: function (response) {
                                    if (content) {
                                        $('body').find('.tab-pane.fade.in.active').append(response);
                                        datepa();
                                    }

                                },
                                error: function (xhr) {
                                    $('#errorDisplay').html('Error: ' + xhr.status + ' ' + xhr.statusText);
                                },
                                complete: function () {
                                    $(document).find('.tab-pane.fade.in.active div.loader').hide();
                                    var modal = $('body').find('.modal-backdrop.fade.in')
                                    modal.remove()
                                }
                            });
                            //alert(response);
                        }
                    }
                });
            }
        }

        if ($tar.attr('type-send') === 'ajaxUpdate') {

            var target = $($tar).attr('form-target');

            var dataPost = '';
            var $findTarget = $(document).find('.fade.in form[form-name=' + target + ']');
            var dataPost = $findTarget.serialize();
            var Durl = $findTarget.attr('action');
            var type = "text";

            if (dataPost) {
                $.ajax({
                    type: 'POST', url: Durl, data : dataPost,
                    dataType: type,
                    success: function (response) {
                    },
                    error: function (xhr) {

                        $('#resError').removeClass('hide')
                        $('#resError').append('Error: ' + xhr.status + ' ' + xhr.statusText)
                    },
                    complete: function () {

                    }
                });
            }
        }


        if ($tar.attr('type-send') === 'ajaxO') {

            var target = $($tar).attr('form-target');
            var target2 = $($tar).attr('form-target2');
            var dataPost = '';

            var $findTarget1 = $(document).find('.modal.fade.in form[form-name=' + target + ']');
            var dataPost1 = $findTarget1.serialize();
            if (target2) {
                var images = [];
                var $canvas = $(document).find(".modal.fade.in canvas").each(function () {
                    images.push($(this).attr('value'))
                });
                var $findTarget = $(document).find('.modal.fade.in form[form-name=' + target2 + ']');
                var dataPost2 = $findTarget.serialize();
                dataPost = dataPost2 + '&' + dataPost1 + '&fotos=' + images;
            } else {
                var dataPost = dataPost1;
            }
            var Durl = $findTarget1.attr('action');
            var type = "text";
            var exist = $(document).find('.modal.fade.in #ordenResult').attr('serie');

            if (dataPost != '' && typeof (exist) != 'string') {
                $.ajax({
                    type: 'POST', url: Durl, data : dataPost,
                    dataType: type,
                    success: function (response) {
                        $(document).find('.modal.fade.in input').each(function () {
                            //$(this).val('');
                        });
                        if (!$tar.attr('this-slide')) {
                            $(document).find('.modal.fade.in [data-dismiss="modal"]').trigger('click')
                        }
                        if (target === 'Equipo') {
                            next($tar);
                        }
                        $(document).find('#finalResult').append(response);
                    },
                    error: function (xhr) {
                        //$('#errorDisplay').html('Error: ' + xhr.status + ' ' + xhr.statusText);
                        $('#resError').removeClass('hide')
                        $('#resError').append('Error: ' + xhr.status + ' ' + xhr.statusText)
                    }
                });
            } else {
                if (target === 'Equipo') {
                    next($tar);
                }
            }

        }

        //if ($tar.attr('verificar') === 'cliente') {
        //    var url = $tar.attr('data-post');

        //}
        if ($tar.hasClass('ion-edit') || $tar.hasClass('event-tab')) {


            var tab = $($tar).attr('name').trim();
            var ide = $($tar).attr('value').trim();
            var dataget = $($tar).attr('data-get');
            var $tabExists = $('.nav-tabs').find('li[value="' + ide + '"]').attr('value');

            if ($tabExists) {
                $('.active').not('.navbar-nav li').not('.day').not('.btn').removeClass('active');
                $('.nav-tabs').find('li[value=' + ide + ']').addClass('active');
                $('#' + tab).addClass('fade in active');

            } else {
                $('.active').not('.navbar-nav li').not('.btn').removeClass('active');
                $('.nav-tabs').append('<li class="active" name="orden" value="' + ide + '"><a href="#' + tab + '" data-toggle="tab">' + tab + '</a><div class="closec ion-android-close"></div></li>');
                $('.tab-content').append('<div id="' + tab + '" class="tab-pane fade in active"><div class="span loader"><div class="cloud"></div></div></div>');
                //$.get('/' + dataget, { clave : ide } , function (data) {
                //    $('#' + tab).append(data);
                //    datepa();
                //});
                $.ajax({
                    type: 'GET', url: '/' + dataget, data : {clave: ide },
                    dataType: 'text',
                    success: function (response) {
                        $('#' + tab).append(response);
                        datepa();
                    },
                    error: function (xhr) {
                        $('#errorDisplay').html('Error: ' + xhr.status + ' ' + xhr.statusText);
                    },
                    complete: function () {
                        $(document).find('.tab-pane.fade.in.active div.loader').hide();
                    }
                });
            }
        };

        if ($tar.hasClass('ion-android-image')) {
            var numero = $($tar).attr('value');
            var serie = $($tar).attr('name');
            var source = "/images";
            //$('body').find('#myCarousel').empty();
            $('body').find('#my-slide').remove();


            $.ajax({
                type: 'GET', url: source, data : { 'serie' : serie, 'numero' : numero },
                dataType: 'text',
                success: function (response) {
                    $('body').find('.slideImage').append(response);
                    $(function () {
                        $('#my-slide').DrSlider();
                    });
                    //$('body').find('#myCarousel').append(response);
                },
                error: function (xhr) {
                    $('#errorDisplay').html('Error: ' + xhr.status + ' ' + xhr.statusText);
                }
            });
        }


        if ($tar.attr('type-send') === 'ajax-tab') {

            var target = $($tar).attr('tab-name');
            var tab = $($tar).attr('tab-target');
            var source = $($tar).attr('data-source');
            var $tabExists = $('.nav-tabs').find('li[tab-name=' + target + ']').attr('tab-name');
            var param = ''
            if ($tabExists) {
                $('.nav-tabs li.active').not('.day').not('.btn').removeClass('active');
                $('.nav-tabs').find('li[tab-name=' + target + ']').addClass('active');
                $('.tab-pane.active').not('.day').not('.btn').removeClass('active');
                $('.tab-content').find('#' + tab).addClass('fade in active');

            } else {
                $('.active').not('.navbar-nav li').not('.menu li').not('.btn').removeClass('active');
                $('.nav-tabs').append('<li class="active" tab-name="' + target + '"><a href="#' + tab + '" data-toggle="tab">' + target + '</a><div class="closec ion-android-close"></div></li>');
                $('.tab-content').append('<div id="' + tab + '" class="tab-pane fade in active"><div class="span loader"> <div class="cloud"></div></div></div>');
                if (dataPost != '') {
                    $.ajax({
                        type: 'GET', url: source, data : param,
                        dataType: 'text',
                        success: function (response) {
                            $('#' + tab).append(response);
                            if (target != 'Agenda') {
                                $('.tab-pane').find('[data-toggle="table"]').bootstrapTable();
                            }

                        },
                        error: function (xhr) {
                            $('#errorDisplay').html('Error: ' + xhr.status + ' ' + xhr.statusText);
                        },
                        complete: function () {
                            $(document).find('.tab-pane.fade.in.active div.loader').hide();
                        }
                    });
                }
            }

        }

        if ($tar.attr('data-remove') === 'modal') {
            var close = $tar.attr('modal-re')
            var target = $tar.attr('class-re')
            if (close) {
                setTimeout(function (){
                    $(document).find('.'+ close + '').trigger('click');
                    if (target) {
                        setTimeout(function () {
                            $(document).find('.' + target + '').remove();
                            $(document).find('.ion-flag a:first-child').remove();
                        }, 400);
                    }
                }, 200)
            }
        }

    });
    // Fires when an element has losts focus (a generic version of blur)
    $(document).on('focusout', function (e) {
        var $event = $(e.target);
        var clave = $($event).attr('type');
        if (clave === 'text') {

        }
    });
    // Fires when an element has received foucus (bubbling version)
    $(document).on('focusin', function (e) {

    });
    // Fires when an element has received focus
    $(document).on('focus', function (e) {

    });

    $(document).on('keypressa', function (e) {
        var $tar = $(e.target);
        var tipo = $($tar).hasClass('prods');
        var prod = $(document).find('.modal.fade.in .prods').val() + String.fromCharCode(e.charCode);
        if (tipo && prod.length > 3) {
            buscaProduct(prod);
        }
    });

    $(document).on('keyup', function (e) {
        var $tar = $(e.target);
        var tipo = $($tar).hasClass('prods');
        var len = $tar.val();
        var type = $tar.attr('type');
        if (len.length > 0 && type === 'text') {
            var placeholder = $tar.attr('placeholder')
            var html1 = '<div id="placeholder"> ' + placeholder + '</div>'
            var exist = $tar.parent().find('#placeholder').attr('id')
            //alert(exist)
            if (!exist && (placeholder != 'Buscar' ) ) {
                if (placeholder != 'Modelo') {
                      $tar.parent().prepend(html1);
                }

            }
            //alert(placeholder);
        } else if (type != 'password'){
            $tar.parent().find('#placeholder').remove()
        }
        var prod = $(document).find('.modal.fade.in .prods').val();
        if (tipo) {

            if ( prod.length > 3) {
                var prod = $(document).find('.modal.fade.in .prods').val();
                buscaProduct(prod);
            }
        }

        var bus = $($tar).hasClass('clients');
        var cliente = $('.modal.fade.in').find('.clients').val();
        if (bus) {

            if (cliente.length > 3) {
                var client = $('.modal.fade.in').find('.clients').val();

                buscaClient(client);
            } else {
                $('.modal.fade.in').find('#clients').empty();
            }
        }

        if ($tar.attr('name') === 'clienteNombre') {
            $(document).find('input[name=reporto]').val($tar.val())
        }
        if ($tar.hasClass('user')) {
            var user = $('.modal.fade.').find('.user').val();
            if (user.length > 3) {
                //buscaUser(user);
            } else {
                $('.modal.fade.in').find('#user').empty();
            }
        }

        if ($tar.attr('name')  === 'password') {
            var pass1 = $(document).find('.fade.in input[name="password1"]')

            if ($tar.val() === pass1.val()) {
                $tar.attr('style', ' border:2px solid #ccc')
            } else {
                $tar.attr('style', 'border-color:red')
            }
        }


    });

    function buscaUser(user){
        $(document).find('.modal.fade.in #user').empty();
        $.get(
            '/users',
                { filtro: user },
                     function (data) {
                $(document).find('.modal.fade.in #user').append(data);
            }
        );
    }

    function buscaProduct(prod) {

        $(document).find('.modal.fade.in #products').empty();

        $.get(
            '/prods',
                { filtro: prod },
                     function (data) {
                $(document).find('.modal.fade.in #products').append(data);
            }
        );

    }

    function buscaClient(client) {

        $('.modal.fade.in').find('#clients').empty();

        $.get(
            '/cliente',
                { filtro: client },
                     function (data) {
                $('.modal.fade.in').find('#clients').append(data);
            }
        );

    }



    //$(document).on("textInput", function (event) {
        //alert(event[1]);
    //});

    function datepa() {
        var $fecha = $('.tab-pane').find('.fecha');
        //alert($fecha[0]);
        $('.tab-pane.active').find('.fecha').each(function (n) {
            var date = new Date(Date.parse($(this).text()));

            var $monthNames = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
                'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ]
            date.setDate(date.getDate() + 1);
            var dia = date.getDate();
            var mes = $monthNames[date.getMonth()];
            var year = date.getFullYear();
            var fecha = dia + '  ' + mes + '  ' + year;
            $('<div class="date">' + fecha + '</div>').insertAfter(this);
            $(this).remove();
        });
    };


});
