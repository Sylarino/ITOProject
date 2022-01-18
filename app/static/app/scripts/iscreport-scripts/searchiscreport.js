var i = 0;
var dataImgNonCon = [];

$('button[id="btn-buscar-iscrep"]').on('click', function () {

    if (startDate === "" && endDate === "") {
        console.log("Si verifico");
    } else {
        startDate = startDate.format('DD/MM/YYYY');
        endDate = endDate.format('DD/MM/YYYY');
    }

    var api = document.getElementById("api_isc_select");
    var contrato = document.getElementById("con_isc_select");

    let datos = [];

    let fila = {
        id_api: api.options[api.selectedIndex].id,
        id_contrato: contrato.options[contrato.selectedIndex].id,
        fecha_inicio: startDate,
        fecha_termino: endDate
    };

    datos.push(fila);

    $.ajax({
        type: 'GET',
        data: { 'listar[]': JSON.stringify(datos), csrfmiddlewaretoken: '{{ csrf_token }}' },
        url: "/searchiscreportingrid",
        dataType: 'json',
    }).done(function (search) {

        cargarTablaISCReport(search);

    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    }).always(function (data) {

    });

});

function cargarTablaISCReport(response) {

    console.log(response);

    $("#divTabla").addClass("hidden");

    if (response == null) {

        swal("Oops!", "No se encontraron datos, intente nuevamente.", "warning");
        return false;
    }
    $("#divTabla").removeClass("d-none");
    tablaActividades = $('#tableActivities').DataTable({
        paging: true,
        destroy: true,
        searching: false,
        "language": {
            "lengthMenu": "Mostrando _MENU_ registros por pagina",
            "zeroRecords": "No se encontraron resultados",
            "info": "Mostrando pagina _PAGE_ de _PAGES_",
            "infoEmpty": "Sin informacion",
            "infoFiltered": "(filtrando en _MAX_ registros)",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente",
                "first": "Primero",
                "last": "Último"
            }
        },
        "data": response,
        "columns": [
            { "data": "id_reporte", "name": "Reporte" },
            { "data": "api", "name": "Proyecto" },
            { "data": "contrato", "name": "N_de_contrato" },
            { "data": "historico_fecha", "name": "Fecha_de_registro" },
            { "data": "num_audit", "name": "Numero_auditoria" },
            { "data": "correlativo", "name": "Correlativo" },
            {
                "data": "id_reporte", "render": function (data, type, full, meta) {
                    return '<a onclick="abrir_modal_edicion(' + data + ');"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#B52323" class="bi bi-pencil" viewBox="0 0 16 16">'+
                            '<path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>'+
                            '</svg></span></a>';
                }
            },
            {
                "data": "id_reporte", "render": function (data, type, full, meta) {
                    return '<a href="downloadpdfiscreport/iscreport/' + data + '"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#B52323" class="bi bi-download" viewBox="0 0 16 16">'+
                            '< path d = "M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />'+
                            '<path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />'+
                            '</svg ></a>';
                }
            },
        ]
    });
    return false;
}

function abrir_modal_edicion(id_report) {

    var $ = jQuery.noConflict();

    $('#edicion').load('modifiediscreport/' + id_report, function () {

        $(this).modal('show');

        $("#btn-save-isc").click(function () {

            var data_files = document.querySelector("#file-isc");
            var data = new FormData();

            for (var x = 0; x < data_files.files.length; x++) {
                data.append('files', data_files.files[x]);
            }

            data.append('id_reporte', id_report);

            $.ajax({
                url: 'savemodifiediscreport/',
                type: 'POST',
                data: data,
                contentType: false,
                processData: false,
                dataType: 'json',
            }).done(function (data, response) {

                if (data.submit == 'success') {
                    Swal.fire("Reporte Modificado",
                        "Reporte ISC N " + id_report + " modificado correctamente",
                        "success");
                    return response;
                }

            }).fail(function (data, response) {
                Swal.fire("Reporte No Agregado",
                            "Verifique que archivos sean correctos",
                            "warning");
                return false;
            });

        });

    });

}

