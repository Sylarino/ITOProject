var i = 0;
var dataImgNonCon = [];

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

///Agregar nuevas imagenes (Intentar reciclarlo más adelante con el registernonconformity.js)
$(function () {

    document.getElementById("file-noncon").onchange = function (e) {

        var largo = 0;
        var largo_temp = 0;
        if (dataImgNonCon.length > 0) {

            largo = dataImgNonCon.length;
            largo_temp = largo + 1;

        }

        var inc = 0;

        for (var x = 0; x < (e.target.files.length); x++) {

            let reader = new FileReader();

            reader.readAsDataURL(e.target.files[x]);

            dataImgNonCon[largo_temp + x] = e.target.files[x];

            reader.onload = function () {

                var section = document.getElementById("section-img-noncon");
                var image = document.createElement('img');
                var but = document.createElement('input');
                var div = document.createElement('div');

                div.setAttribute("class", "col-md-4 form-report");
                div.setAttribute("id", "div_" + (largo_temp + inc));
                but.setAttribute("class", "btn btn-danger");
                but.setAttribute("value", "Borrar");
                but.setAttribute("type", "button");
                image.setAttribute("id", "img_" + (largo_temp + inc));
                image.setAttribute("class", "img-thumbnail");
                but.setAttribute("onclick", "eliminarImg(" + (largo_temp + inc) + ");")

                image.src = reader.result;

                section.append(div);
                div.append(image);
                div.insertBefore(but, image);

                inc++;
            }
        }

        return dataImgNonCon;

    };

});

///Eliminar
function eliminarImg(id) {

    deleteDiv = document.getElementById("div_" + id).parentNode;
    imgDiv = document.getElementById("div_" + id);

    deleteDiv.removeChild(imgDiv);

    id_img_div = parseInt(imgDiv.id.replace('div_', ''));

    dataImgNonCon.splice(id_img_div, 1);

}

///Editar
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
