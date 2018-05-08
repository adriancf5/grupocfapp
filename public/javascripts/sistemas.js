$(document).ready(function () {
    datepa()
          $(function () {
              $('#datetimepicker1').datetimepicker({
                locale: 'es',
                format: 'MM-DD-YYYY HH:mm'
              });
          });

    $(document).on('click', function (e){
        var $tar = $(e.target);
        if ($tar.parents().hasClass('cliente')) {
            var cliente = $tar.parents().attr('clave');
            var descripcion = $tar.parents().attr('descripcion');
            var rfc = $tar.parents().attr('rfc');
            $('body').find('input.clients').attr({ 'clave': cliente, 'descripcion': descripcion, 'rfc': rfc });
            $('body').find('#nombreCliente').append(descripcion)
            $('body').find('input.clients').val(cliente)
            $('body').find('input[name="nombre"]').val(descripcion)
            $('body').find('#clientes').empty();

        }

        if ($tar.parents().hasClass('articulo')) {
            var articulo = $tar.parents().attr('clave');
            var descripcion = $tar.parents().attr('descripcion');
            var precio = $tar.parents().attr('precio');
            $(document).find('input.servicios').attr({ 'clave': articulo, 'descripcion': descripcion, 'precio': precio });
            $(document).find('input.servicios').val(articulo)
            $(document).find('#products').empty();
        }
    })

    $(document).on('focusout', function (e) {
        var $tar = $(e.target);
        if ($tar.hasClass('fechahora')) {
          var val = $(document).find('.fechahora').val();
          //window.location.href = window.location.href.replace( /[\?#].*|$/, "?fecha=" + val)
          window.location.href = window.location.href.replace(/[\?#].*|$/, "?fecha=" + val)

          $.get(
              '/sistema',
                  { fecha : val },
                       function (data) {
              }
          );
        }
    });

    $(document).on('keyup', function (e) {
        var $tar = $(e.target);
        var tipo = $($tar).hasClass('servicios');
        var prod = $(document).find('.servicios').val();
        if (tipo) {

            if (prod.length > 3) {
                var prod = $(document).find('.servicios').val();
                buscaProduct(prod);
            } else {
              $(document).find('#products').empty();
            }
        }

        var bus = $($tar).hasClass('clients');
        var cliente = $('body').find('.clients').val();
        if (bus) {

            if (cliente.length > 3) {
                var client = $('body').find('.clients').val();
                buscaClient(client);
            } else {
              $(document).find('#clientes').empty();
            }
        }

    });

    function buscaClient(client) {
        $('body').find('#clientes').empty();

        $.get(
            '/cliente',
                { filtro: client },
                     function (data) {
                $('body').find('#clientes').append(data);
            }
        );

    }

    function buscaProduct(prod) {

        $(document).find('#products').empty();

        $.get(
            '/prods',
                { filtro: prod },
                     function (data) {
                $(document).find('#products').append(data);
            }
        );

    }

    function datepa() {
        $('body').find('.fecha').each(function (n) {
            var date = new Date(Date.parse($(this).text()));

            var $monthNames = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
                'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ]
            var dia = date.getDate() ;
            var mes = $monthNames[date.getMonth()];
            var year = date.getFullYear();
            var fecha = dia + '  ' + mes + '  ' + year;
            $('<div style="float:right" class="">' + fecha + '</div>').insertAfter(this);
            $(this).remove();
        });
    };



});
