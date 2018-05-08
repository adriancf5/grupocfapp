$(document).ready(function () {
  datepa()
  function datepa(){
      var $fecha = $('body').find('.fecha');
      //alert($fecha[0]);
      $('body').find('.fecha').each(function (n) {
          var date = new Date(Date.parse($(this).text()));

          var $monthNames = [
              'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
              'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
          ]
          var dia = date.getDate();
          var mes = $monthNames[date.getMonth()];
          var year = date.getFullYear();
          var fecha = dia + '  ' + mes + '  ' + year;
          $('<div class="fecha">' + fecha + '</div>').insertAfter(this);
          $(this).remove();
      });
  }


});
