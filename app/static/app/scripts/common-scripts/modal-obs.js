function abrir_modal_edicion(id_report) {
    var $ = jQuery.noConflict();
    
    $('#edicion').load(id_report, function () {

        $(this).modal('show');

    });

}