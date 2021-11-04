$('button[id="btn-buscar-detalle"]').on('click', function () {

    var api = document.getElementById("api_det_select");
    var contrato = document.getElementById("con_det_select");
    var caminata = document.getElementById("cam_det_select");
    var sistema = document.getElementById("sis_det_select");
    var empresa = document.getElementById("ent_det_select");
    //var subsistema = document.getElementById("sub_det_select");

    let fila = {
        id_api: api.options[api.selectedIndex].id,
        id_contrato: contrato.options[contrato.selectedIndex].id,
        id_caminata: caminata.options[caminata.selectedIndex].id,
        id_sistema: sistema.options[sistema.selectedIndex].id,
        id_empresa: empresa.options[empresa.selectedIndex].id
    //    id_subsistema: subsistema.options[subsistema.selectedIndex].id
    };

    $.ajax({
        type: 'GET',
        data: {
            'listar[]': JSON.stringify(fila),
            csrfmiddlewaretoken: '{{ csrf_token }}'
        },
        url: "/searchwalks",
        dataType: 'json',
    }).done(function (search) {

        cargarDetallesTerminacion(search);

    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    })

});

function cargarDetallesTerminacion(response) {

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
            { "data": "area", "name": "Area" },
            { "data": "disciplina", "name": "Disciplina" },
            { "data": "fecha_compromiso", "name": "Fecha_compromiso" },
            { "data": "fecha_compromiso_real", "name": "Fecha_compromiso_real" },
            { "data": "originador", "name": "Originador" },
            { "data": "num_audit", "name": "Numero_auditoria" },
            { "data": "sistema", "name": "Sistema" },
            { "data": "subsistema", "name": "Subsistema" },
            {
                "data": "id_reporte", "render": function (data, type, full, meta) {
                    return '<a onclick="abrir_modal_edicion(' + data + ');"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#B52323" class="bi bi-pencil" viewBox="0 0 16 16">' +
                        '<path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>' +
                        '</svg></a>';
                }
            },
            {
                "data": "id_reporte", "render": function (data, type, full, meta) {
                    return '<a href="downloadpdfnoncon/nonconformity/' + data + '"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#B52323" class="bi bi-download" viewBox="0 0 16 16">' +
                        '< path d = "M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />' +
                        '<path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />' +
                        '</svg ></a>';
                }
            },
        ]
    });
    return false;
}