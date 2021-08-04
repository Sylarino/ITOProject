function cargarTablaNoConformidad(response) {

    console.log(response);

    $("#divTabla").addClass("hidden");

    if (response == null) {

        swal("Oops!", "No se encontraron datos, intente nuevamente.", "warning");
        return false;
    }
    $("#divTabla").removeClass("hidden");
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
                    return '<a onclick="abrir_modal_edicion(' + data + ');" class="btn btn-danger"><i class="glyphicon glyphicon-pencil"></i></a>';
                }
            },
            {
                "data": "id_reporte", "render": function (data, type, full, meta) {
                    return '<a href="downloadpdfnoncon/' + data + '" class="btn btn-danger"><i class="glyphicon glyphicon-floppy-disk"></i></a>';
                }
            },
        ]
    });
    return false;
}

$('input[id="btn-buscar-noncon"]').on('click', function () {

    if (startDate === "" && endDate === "") {
        console.log("Si verifico");
    } else {
        startDate = startDate.format('DD/MM/YYYY');
        endDate = endDate.format('DD/MM/YYYY');
    }

    var api = document.getElementById("api_noncon_select");
    var contrato = document.getElementById("con_noncon_select");
    var autor = document.getElementById("autor_noncon_select");
    var disciplina = document.getElementById("disi_noncon_select");
    var area = document.getElementById("area_noncon_select");

    let datos = [];

    let fila = {
        id_api: api.options[api.selectedIndex].id,
        id_contrato: contrato.options[contrato.selectedIndex].id,
        id_autor: autor.options[autor.selectedIndex].id,
        id_disciplina: disciplina.options[disciplina.selectedIndex].id,
        id_area: area.options[area.selectedIndex].id,
        fecha_inicio: startDate,
        fecha_termino: endDate
    };

    datos.push(fila);

    $.ajax({
        type: 'GET',
        data: { 'listar[]': JSON.stringify(datos), csrfmiddlewaretoken: '{{ csrf_token }}' },
        url: "/searchnonconformityingrid",
        dataType: 'json',
    }).done(function (search) {

        cargarTablaNoConformidad(search);

    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    }).always(function (data) {

    });

});

function abrir_modal_edicion(id_report) {

    var $ = jQuery.noConflict();

    $('#edicion').load('modifiednonconformityreport/' + id_report, function () {

        $(this).modal('show');

    });

}
