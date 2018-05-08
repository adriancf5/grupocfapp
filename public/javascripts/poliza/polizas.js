
$(document).ready(function () {
    datepa()
    function datepa() {
        var $fecha = $(document).find('.fecha');
        //alert($fecha[0]);
        $('.card').find('.fecha').each(function (n) {
            var date = new Date(Date.parse($(this).text()));

            var $monthNames = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
                'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ]
            var dia = date.getDate() + 1;
            var mes = $monthNames[date.getMonth()];
            var year = date.getFullYear();
            var fecha = dia + '  ' + mes + '  ' + year;
            var name = $(this).attr('name')
            $('<div>' +  name + ' '  + fecha + '</div>').insertAfter(this);
            $(this).remove();
        });
    };


});
