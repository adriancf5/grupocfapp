(function ($) {
    
    "use strict";
    
    function empleado() { 

        var emp = '/agendaPend?asig=' + $(document).find('.agendaEm').val();
        return emp
    }  
    
    var options = {
        language: 'es-ES',
        //events_source: '../html/events.json.php',
        events_source:   empleado()  + '',
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
    
    var calendar = $('#calendario').calendar(options);
    
    $('.btn-group button[data-calendar-nav]').each(function () {
        var $this = $(this);
        $this.click(function () {
       
            calendar.navigate($this.data('calendar-nav'));
        });
    });
    
    $('.btn-group button[data-calendar-view]').each(function () {
        var $this = $(this);
        $this.click(function () {
           
            calendar.view($this.data('calendar-view'));
        });
    });
    
    $('#first_day').change(function () {
        var value = $(this).val();
        value = value.length ? parseInt(value) : null;
        calendar.setOptions({ first_day: value });
        calendar.view();
    });
    
    $('#language').change(function () {
        calendar.setLanguage($(this).val());
        calendar.view();
    });
    
    $('.agendaEm').change(function () {
        $(document).find('#calendario').empty()
        var view = $(document).find('.calendar button.active').attr('data-calendar-view')
        var value = $(this).val();
        options.view = view;
        options.events_source =   empleado() + '';
        var calendar = $('#calendario').calendar(options);
    })
    
    $('#events-in-modal').change(function () {
        var val = $(this).is(':checked') ? $(this).val() : null;
        calendar.setOptions({ modal: val });
    });
    $('#events-modal .modal-header, #events-modal .modal-footer').click(function (e) {
		//e.preventDefault();
		//e.stopPropagation();
    });
}(jQuery));