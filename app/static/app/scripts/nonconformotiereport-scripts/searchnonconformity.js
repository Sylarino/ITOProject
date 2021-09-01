var i = 0;
var dataImgNonCon = [];

function cargarTablaNoConformidad(response) {

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

///Eliminar
function eliminarImg(id) {

    deleteDiv = document.getElementById("div_" + id).parentNode;
    imgDiv = document.getElementById("div_" + id);

    deleteDiv.removeChild(imgDiv);

    id_img_div = parseInt(imgDiv.id.replace('div_', ''));

    dataImgNonCon.splice(id_img_div, 1);

}

///Editar No Conformidad
function modificarNoConformidad(id) {

    var fecha_compromiso = document.getElementById("date-noncon-real");
    var data = new FormData();

    for (var x = 0; x < dataImgNonCon.length; x++) {
        var file = dataImgNonCon[x];
        data.append('files', file);
    }

    data.append('id_reporte', id);
    data.append('real_close_date', fecha_compromiso.value)

    $.ajax({
        url: 'savemodifiednonconformity/',
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

///
function messageSuccessPDF(data) {

    if (data.submitted == 1) {

        swal.fire("Modificado", "Reporte N°" + data.id_reporte + " modificado satisfactoriamente", "success", {
            confirmButtonText: "Descargar"
        }).then((result) => {

            if (result.isConfirmed) {
                //downloadwalkreport(data.id_report);
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
