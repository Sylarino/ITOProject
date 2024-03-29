///Eleccion de filtros y busqueda de datos
$('button[id="btn-buscar-walk"]').on('click', function () {

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

    $.ajax({
        type: 'GET',
        data: { 'listar[]': JSON.stringify(fila), csrfmiddlewaretoken: '{{ csrf_token }}' },
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
    $("#divTabla").removeClass("d-none");
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
            { "data": "disciplina", "name": "Disciplina" },
            { "data": "accion", "name": "Descripcion" },
            { "data": "prioridad", "name": "Prioridad" },
            { "data": "fecha_compromiso", "name": "Fecha_compromiso" },
            {
                "data": "id_observacion", "render": function (data, type, full, meta) {
                    return `<a onclick="abrir_modal_edicion('modifiedwalkreport/` + data + `');"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#B52323" class="bi bi-pencil" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                        </svg></a>`;
                }
            },
            {
            "data": "id_reporte", "render": function (data, type, full, meta) {
                    return '<a href="downloadwalkpdf/walkreport/' + data + '"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#B52323" class="bi bi-download" viewBox="0 0 16 16">' +
                    '< path d = "M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />' +
                    '<path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />' +
                    '</svg ></a>';
                }
            }
        ]
    });
    return false;
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

