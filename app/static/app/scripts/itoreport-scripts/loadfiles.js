var dataload;

function upload(event) {
     
    event.preventDefault();
    var filesdata = new FormData();
    var file = document.getElementById('file').files[0];
    filesdata.append('file', file);
     
    $.ajax({
        url: 'readexcel/',
        type: 'POST',
        data: filesdata,
        cache: false,
        processData: false,
        contentType: false,
    }).done(function (load) {
        cargarTabla(load)
    }).fail(function (response) {
        Swal.fire("Archivo Incorrecto", "El archivo no cumple estructura o no es valido.", "warning");
        return false;
    });
    return false;
}

$(function () {
    $('form').submit(upload);
});

function cargarTabla(response) {

    var saveexist = document.getElementById("button_cont");
    var savebuttonexist = document.getElementById("save_data");

    if (savebuttonexist != null) {
        saveexist.removeChild(savebuttonexist);
    }

    if (response == null) {

        swal("Oops!", "No se encontraron datos, intente nuevamente.", "warning");
        return false;
    }

    $("#divTabla").removeClass("d-none");
     
    var tablaActividades = "";
    tablaActividades = $('#table-load').DataTable({
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
        data: response,
        "columns": [
            { "data": "numero_contrato", "name": "Contrato" },
            { "data": "empresa", "name":"Empresa"},
            { "data": "actividad", "name": "Actividad" },
            { "data": "subactividad", "name": "Subactividad" },
            { "data": "dias_proyectado", "name": "Dias_proyectado" },
            {
                "data": "obs_validacion", "name": "Observacion",
                createdCell: function (td, cellData, rowData, row, col) {
                    $(td).addClass(rowData.clase_validacion);
                }
            },
            {
                "data": null, 
                "render": function (data) {
                    return '<a onclick="abrir_modal_leer(' + data + ');"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#B52323" class="bi bi-pencil" viewBox="0 0 16 16">' +
                        '<path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>' +
                            '</svg></a>';
                }
            }
            //{
            //    "name": "Observacion", "data": null,"render": function (data, type, full, meta) {
            //        var classObs = data.clase_validacion;
            //        var Obser = data.obs_validacion;

            //        resultado = '<td class="danger" >' + Obser + '</td>';
            //        return resultado;
            //    }
            //}
        ]
    });

    dataload = response;
    var divbutton = document.getElementById('button_cont');
    var loadbutton = document.createElement('a');
    loadbutton.className = 'btn btn-danger';
    loadbutton.type = 'button';
    loadbutton.textContent = 'Guardar';
    data_click = "guardarDatos();";
    loadbutton.setAttribute("onclick", data_click);
    loadbutton.id = 'save_data';
    //loadbutton.href = 'downloadexcelsearch/excelconfiltro';
    divbutton.appendChild(loadbutton);
     
    return false;

}

function abrir_modal_leer(full) {

    var $ = jQuery.noConflict();
    data = JSON.stringify(full);
     
    $('#edicion').load('readsubactivityinfo/' + full, function () {

        $(this).modal('show');

    });

}

function guardarDatos() {

     
    $.ajax({
        url: 'submitdata/',
        type: 'POST',
        data: { 'data[]': JSON.stringify(dataload), csrfmiddlewaretoken: '{{ csrf_token }}' },
        dataType: 'json',
    }).done(function (data) {

        if (data == 1) {

            Swal.fire("Guardado!", "Datos cargados y guardados correctamente.", "success");
            return false;

        }
        else {

            Swal.fire("Error", "Revise que los datos esten correctos.", "warning");
            return false;
        }

    });

}