///Elecci�n de filtros y b�squeda de datos
$('input[id="btn-buscar-walk"]').on('click', function () {

    var exportexist = document.getElementById("export");
    var exportexcelexist = document.getElementById("exportarexcel");

    if (exportexcelexist != null) {
        exportexist.removeChild(exportexcelexist);
    }

    if (startDate === "" && endDate === "") {
        console.log("Si verifico");
    } else {
        startDate = startDate.format('DD/MM/YYYY');
        endDate = endDate.format('DD/MM/YYYY');
    }

    var api = document.getElementById("api_walk_select");
    var contrato = document.getElementById("con_walk_select");
    var autor = document.getElementById("autor_walk_select");
    var lider = document.getElementById("leader_walk_select");
    var disciplina = document.getElementById("disi_walk_select");
    var area = document.getElementById("area_walk_select");
    var prioridad = document.getElementById("prio_walk_select");

    let datos = [];

    let fila = {
        id_api: api.options[api.selectedIndex].id,
        id_contrato: contrato.options[contrato.selectedIndex].id,
        id_autor: autor.options[autor.selectedIndex].id,
        id_lider: lider.options[lider.selectedIndex].id,
        id_disciplina: disciplina.options[disciplina.selectedIndex].id,
        id_area: area.options[area.selectedIndex].id,
        id_prioridad: prioridad.options[prioridad.selectedIndex].id,
        fecha_inicio: startDate,
        fecha_termino: endDate
    };

    datos.push(fila);

    debugger
    $.ajax({
        type: 'GET',
        data: { 'listar[]': JSON.stringify(datos), csrfmiddlewaretoken: '{{ csrf_token }}' },
        url: "/searchwalks",
        dataType: 'json',
    }).done(function (search) {

        cargarTablaCaminatas(search);

    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    }).always(function (data) {

    });
});

function cargarTablaCaminatas(response) {

    console.log(response);

    $("#divTabla").addClass("hidden");

    if (response == null) {

        swal("Oops!", "No se encontraron datos, intente nuevamente.", "warning");
        return false;
    }
    $("#divTabla").removeClass("hidden");
    var url = "modifiedwalkreport/"
    var tablaActividades = "";
    /*    if (!$.fn.dataTable.fnIsDataTable($('#tableActivities'))) {*/
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
            { "data": "caminata", "name": "Caminata" },
            { "data": "ubicacion", "name": "Ubicacion" },
            { "data": "plano", "name": "N_plano" },
            { "data": "equipo", "name": "Codigo_equipo" },
            { "data": "disciplina", "name": "Disciplina" },
            { "data": "accion", "name": "Descripcion" },
            { "data": "originador", "name": "Originado_por" },
            { "data": "responsable", "name": "Resp_construccion" },
            { "data": "lider", "name": "Lider_caminata" },
            { "data": "prioridad", "name": "Prioridad" },
            { "data": "fecha_compromiso", "name": "Fecha_compromiso" },
            {
                "data": "id_observacion", "render": function (data, type, full, meta) {
                    return '<a onclick="abrir_modal_edicion('+ data +');" class="form-control btn-danger"><i class="glyphicon glyphicon-pencil"></i></a>';
                }
            },
            
        ]
    });
    
    return false;
}

function abrir_modal_edicion(id_report) {
    debugger;
    var $ = jQuery.noConflict();


    $('#edicion').load('modifiedwalkreport/' + id_report, function () {

        $(this).modal('show');

    });

}

function modificarObservacion(id) {

    var fecha_compromiso = document.getElementById("mod-fecha-walk");
    var archivos_nuevos = document.getElementById("file_walk");
    var data = new FormData();

    for (var x = 0; x < archivos_nuevos.files.length; x++) {
        var file = archivos_nuevos.files[x];
        data.append('files', file);
    }

    data.append('id_observation', id);

    if (archivos_nuevos.files.length > 0) {
        var file_val = 1;
        var file_exist = 1;
    } else {
        var file_val = 0;
        var file_exist = 0;
    }

    debugger;
    $.ajax({
        url: 'savemodifiedwalkreport/',
        type: 'POST',
        data: {
            action: 'save_walk_report',
            id: id,
            fecha_compromiso_real: fecha_compromiso.value,
            existe: file_exist
        },
        dataType: 'JSON',

    }).done(function (data) {

        if (file_val === 0) {
            messageSuccessPDF(data);
        }

    }).fail(function (data) {
        Swal.fire("Reporte de Caminata No Agregado", "Verifique los datos a ingresar", "warning");
        return false;
    });

    if (file_val === 1) {
        $.ajax({
            url: 'savemodifiedwalkreport/',
            type: 'POST',
            data: data,
            contentType: false,
            processData: false,
            dataType: 'json',
        }).done(function (data) {

            messageSuccessPDF(data);

        }).fail(function (data) {
            Swal.fire("Reporte No Agregado", "Verifique que imagenés esten correctas", "warning");
            return false;
        });
    }
}

function messageSuccessPDF(data) {

    if (data.submitted == 1) {

        swal.fire("Guardado", "Reporte N°" + data.id_report + " agregado satisfactoriamente", "success", {
            confirmButtonText: "Descargar"
        }).then((result) => {

            if (result.isConfirmed) {
                downloadwalkreport(data.id_report);
                Swal.fire('Descargado!', '', 'success', {
                    confirmButtonText: "Ok"
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                        window.scrollTo(0, 0);
                    } else {
                        window.location.reload();
                        window.scrollTo(0, 0);
                    }
                });
            }
        });

    }
}

