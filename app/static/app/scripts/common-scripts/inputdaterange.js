var startDate = "";
var endDate = "";

///Generación de Input Date Range (searchactivities.js (1-40))
$(function () {
    $('input[name="daterange"]').daterangepicker({
        startDate: moment().subtract('days', 29),
        endDate: moment(),
        "locale": {
            "daysOfWeek": [
                "Dom",
                "Lun",
                "Mar",
                "Mie",
                "Jue",
                "Vie",
                "Sáb"
            ],
            "monthNames": [
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agosto",
                "Septiembre",
                "Octubre",
                "Noviembre",
                "Diciembre"
            ],
            format: 'DD/MM/YYYY'
        },
        opens: 'left'
    }, function (start, end, label) {
        console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
        startDate = start;
        endDate = end;
    });
});